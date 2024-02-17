#! /usr/bin/env node
import chalk from "chalk";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { readFile, verifyFileExistence, writeFile } from "./lib/file-helper.js";
import { addCurrentInterations, getComponentTemplate, loadConfig, validateAvailableIntegrationsAndSetFileExtension, verifyIsAstroProject, verifyParametersAndSetComponentName, } from "./lib/astro-lib.js";
import confirm from "@inquirer/confirm";
import { program } from "commander";
import gradientBox from "gradient-boxen";
const filename = "astro.config.mjs";
const result = await verifyIsAstroProject(filename);
if (!result) {
    console.log(chalk.red("You must be into an Astro project"));
}
const borderColor = "#3245ff";
const textColor = "#f041ff";
const version = "0.0.18";
console.log(gradientBox(chalk.white(`Astro components cli v.${version}`), {
    borderStyle: "round",
    padding: 1,
    margin: 0,
}, [borderColor, textColor]));
program
    .version(version)
    .description("Astro component cli")
    .option("-n, --name [name]", "Especificar un nombre")
    .option("-a, --alias [alias]", "Alias para la ruta de una carpeta")
    .option("--help", "Mostrar ayuda")
    .parse();
const params = program.opts();
console.log(params);
if (params.help) {
    program.outputHelp();
    process.exit();
}
console.log(chalk.white("Lets start create a new component and improve tour productivity. "));
console.log("                                                             ");
let config = {
    questionMe: true,
};
// Cargamos la configuraci
const customConfig = await loadConfig();
if (customConfig) {
    config = customConfig;
}
//Obtain the parameters
const parameters = [...process.argv.slice(2), ...Object.values(params)];
const componentNameGet = getComponentName(process.argv, params.name);
function getComponentName(args, name) {
    return name ?? args.slice(2)[0] ?? "";
}
// Obtén la ruta completa del archivo
const fileRoot = resolve(filename);
const integrations = [];
//Reading the astro config file
const file = await readFile(fileRoot);
if (!file)
    process.exit();
// Ejecutar las funciones
const { componentName, sourceFolder } = await verifyParametersAndSetComponentName({
    componentName: componentNameGet,
    withAlias: typeof params.alias !== "undefined" ? "YES" : "NO",
    options: {
        config: customConfig,
        alias: params.alias,
    },
});
addCurrentInterations({
    file,
    integrations,
});
const typeScriptEnabled = await verifyFileExistence("tsconfig.json");
async function resolveComponentExtension() {
    // ? Should I deny the create of the component if the component have jsx extension this for react framework
    // * NOTE: For now, I will show only a warn message to the user.
    if (componentNameGet.includes(".")) {
        const componentFrameworkExtension = {
            ".astro": "astro",
            ".svelte": "svelte",
            ".vue": "vuejs",
            ".jsx": "react",
            ".tsx": "react",
        };
        const componentExtension = `.${componentNameGet.split(".").at(-1)}`;
        let framework = componentFrameworkExtension[`${componentExtension}`];
        if (typeScriptEnabled && framework === "react" && componentExtension === ".jsx") {
            console.log(chalk.yellow("You're creating a JSX Component (JavaScript syntax extension) in a TypeScript Project (statically typed superset of JavaScript)"));
        }
        return {
            componentExtension: componentExtension ?? ".astro",
            frameworkChoosed: framework,
        };
    }
    else {
        const { componentExtension, frameworkChoosed } = await validateAvailableIntegrationsAndSetFileExtension({
            integrations,
            typeScriptEnabled,
        });
        return { componentExtension, frameworkChoosed };
    }
}
const { componentExtension, frameworkChoosed } = await resolveComponentExtension();
const componentFileName = `${componentName}${componentExtension}`;
const componentAbsoulteRoot = `${sourceFolder}/${componentFileName}`;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const baseTemplateUrl = resolve(__dirname, "templates");
let componentTemplate = await getComponentTemplate({
    frameworkChoosed,
    config,
    baseTemplateUrl,
    typeScriptEnabled,
    componentExtension
});
if (config.questionMe) {
    const answer = await confirm({
        message: chalk.blue(`¡Todo listo! ¿Quieres agregar este archivo ${componentFileName} a ${sourceFolder} : `),
    });
    if (answer) {
        if (frameworkChoosed === "react") {
            componentTemplate = componentTemplate.replaceAll("ReactComponent", componentName);
        }
        await writeFile(componentAbsoulteRoot, componentTemplate, sourceFolder);
        console.log("Componente creado exitosamente ");
    }
    else {
        console.log(chalk.blue("Gracias por todo. Hasta la próxima"));
    }
}
else {
    await writeFile(componentAbsoulteRoot, componentTemplate, sourceFolder);
    console.log("Componente creado exitosamente ");
}
