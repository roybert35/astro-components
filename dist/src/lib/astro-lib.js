import chalk from "chalk";
import { readFile, verifyFileExistence } from "./file-helper.js";
import { readFromConsole } from "./read-console.js";
import select from "@inquirer/select";
export const verifyIsAstroProject = async (filename) => {
    const verifyIsAstroProject = await verifyFileExistence(filename);
    if (!verifyIsAstroProject) {
        return false;
    }
    return true;
};
export const verifyIntegration = (integration, file) => {
    let importIntegration = "";
    let integrationImplement = "";
    if (integration === "react") {
        importIntegration = `import react from "@astrojs/react"`;
        integrationImplement = "react()";
    }
    else if (integration === "svelte") {
        importIntegration = `import svelte from '@astrojs/svelte';`;
        integrationImplement = "svelte()";
    }
    else {
        if (integration === "vuejs") {
            importIntegration = `import vue from '@astrojs/vue';`;
            integrationImplement = "vue()";
        }
    }
    const importIntegrationWithOtherQuote = importIntegration.replaceAll(`"`, "'");
    const fileContainImportIntegration = file.includes(importIntegration) ||
        file.includes(importIntegrationWithOtherQuote);
    const fileContainIntegrationImplementation = file.includes(integrationImplement);
    return fileContainImportIntegration && fileContainIntegrationImplementation;
};
function hasOptions(props) {
    return props.withAlias === "YES";
}
export const verifyParametersAndSetComponentName = async (props) => {
    const { componentName, withAlias } = props;
    if (!componentName) {
        try {
            const componentName = await readFromConsole("Nombre del componente: ");
            if (!componentName) {
                console.log(chalk.red("You must provide a name for the component"));
                return {
                    componentName: "",
                    sourceFolder: "",
                };
            }
            //TODO: Question the user the source folder and if he define aliasses question if they want use it or not
            return {
                componentName,
                sourceFolder: "src/components",
            };
        }
        catch (error) {
            console.log(error);
        }
    }
    else {
        const component = componentName.split(".")[0];
        let sourceFolder = "src/components";
        // CASE 1: when the component name doesn't have src folder on the name
        if (!component.includes("/")) {
            // CASE 2: when the user define a custom alias for components source folder
            if (hasOptions(props)) {
                const { options: { config, alias }, } = props;
                if (withAlias && config?.aliasses) {
                    const sourceConfigAlias = config?.aliasses[alias];
                    if (sourceConfigAlias) {
                        console.log(sourceConfigAlias);
                        sourceFolder = sourceConfigAlias;
                        return {
                            componentName: component,
                            sourceFolder,
                        };
                    }
                    else {
                        console.log(chalk.red("The alias provided doesn't exist"));
                    }
                }
                else {
                    console.log(chalk.red("The alias provided doesn't exist"));
                }
            }
            /*
             If the user not previuosly define a custom alias and the name
             doesn't have the source folder
            */
            return {
                componentName: component,
                sourceFolder,
            };
        }
        // CASE 3: when the user name have the current component source folder
        const arrayArgsComponent = component.split("/");
        // Get the last item with the name of the component
        const componentNameSource = arrayArgsComponent.at(-1).split(".")[0];
        sourceFolder = arrayArgsComponent
            .slice(0, arrayArgsComponent.length - 1)
            .join("/");
        return {
            componentName: componentNameSource,
            sourceFolder,
        };
    }
};
export const addCurrentInterations = ({ integrations, file, }) => {
    if (verifyIntegration("react", file)) {
        integrations.push("react");
    }
    if (verifyIntegration("svelte", file)) {
        integrations.push("svelte");
    }
    if (verifyIntegration("vuejs", file)) {
        integrations.push("vuejs");
    }
};
export const validateFileExtensionIntegrations = async ({ integrations, }) => {
    try {
        const allIntegrations = ["astro", ...integrations];
        const choices = allIntegrations.map((integration) => {
            const name = integration.charAt(0).toUpperCase() + integration.slice(1);
            return {
                name,
                value: integration,
            };
        });
        const answer = await select({
            message: "Select a framework from your integrations",
            choices,
        });
        // const componentFramework = (await readFromConsole(
        //   message
        // )) as AllIntegrations;
        return answer;
    }
    catch (error) {
        return "";
    }
};
export const loadConfig = async () => {
    let config = {
        questionMe: true,
    };
    const filename = "astro-components.json";
    const configExist = await verifyFileExistence(filename);
    if (!configExist)
        return config;
    const configJSON = await readFile(filename);
    if (configJSON) {
        const configParse = JSON.parse(configJSON);
        return {
            ...config,
            ...configParse,
        };
    }
};
export const validateAvailableIntegrationsAndSetFileExtension = async ({ integrations, typeScriptEnabled, }) => {
    if (integrations.length > 0) {
        const frameworkChoosed = await validateFileExtensionIntegrations({
            integrations,
        });
        if (frameworkChoosed === "") {
            console.log(chalk.red("No integration found, please try again"));
            process.exit(1);
        }
        const componentFrameworkExtension = {
            astro: ".astro",
            react: ".tsx",
            svelte: ".svelte",
            vuejs: ".vue",
        };
        if (frameworkChoosed === "react") {
            return {
                componentExtension: typeScriptEnabled ? ".tsx" : ".jsx",
                frameworkChoosed,
            };
        }
        else {
            return {
                componentExtension: componentFrameworkExtension[frameworkChoosed] ?? ".astro",
                frameworkChoosed,
            };
        }
    }
    return {
        componentExtension: ".astro",
        frameworkChoosed: "astro",
    };
};
export const getFileTemplateByFrameWork = (config, baseTemplateUrl) => {
    return {
        astro: {
            js: "",
            ts: "",
        },
        svelte: {
            js: config.svelteJSTemplate ??
                `${baseTemplateUrl}/svelte/SvelteComponentJavaScript.svelte`,
            ts: config.svelteTSTemplate ??
                `${baseTemplateUrl}/svelte/SvelteComponentTypeScript.svelte`,
        },
        react: {
            js: config.reactJsxTemplate ??
                `${baseTemplateUrl}/react/ReactComponentJavaScript.txt`,
            ts: config.reactTsx ??
                `${baseTemplateUrl}/react/ReactComponentTypeScript.txt`,
        },
        vuejs: {
            js: `${baseTemplateUrl}/vue/VueComponentTypeScript.txt`,
            ts: `${baseTemplateUrl}/vue/VueComponentTypeScript.txt`,
        },
    };
};
export const getComponentTemplate = async ({ frameworkChoosed, config, baseTemplateUrl, typeScriptEnabled, componentExtension }) => {
    let content = "Astro component work";
    if (frameworkChoosed !== "astro") {
        const fileTemplateByFramwork = getFileTemplateByFrameWork(config, baseTemplateUrl);
        const contentFile = fileTemplateByFramwork[frameworkChoosed];
        // TODO: Know if I should deny this operation or not
        // *NOTE: For nox, I will allow  the user to do it
        if (typeScriptEnabled && frameworkChoosed === "react" && componentExtension === ".jsx") {
            const fileFrameworkTemplate = contentFile["js"];
            const readedTemplateFramework = await readFile(fileFrameworkTemplate);
            return readedTemplateFramework;
        }
        const fileFrameworkTemplate = contentFile[typeScriptEnabled ? "ts" : "js"];
        const readedTemplateFramework = await readFile(fileFrameworkTemplate);
        return readedTemplateFramework;
    }
    return content;
};
