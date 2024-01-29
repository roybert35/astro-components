#! /usr/bin/env node
import chalk from "chalk";
import { resolve } from "path";
import packageJson from "../package.json" assert { type: "json" };
import { readFile, verifyFileExistence, writeFile } from "./lib/file-helper";
import { readFromConsole } from "./lib/read-console";
import { Config, SupportedIntegrations, ValidExtensions } from "./types";

import gradientBox from "gradient-boxen";
const nombreArchivo = "astro.config.mjs";
console.log("Hola")
const verifyIsAstroProject = await verifyFileExistence(nombreArchivo);
if (!verifyIsAstroProject) {
  console.error(chalk.red("Debe ser en un proyecto de astro"));
  process.exit()
};

const borderColor = "#3245ff";
const textColor = "#f041ff";

console.log(
  gradientBox(
    chalk.white(`Astro components cli v.${packageJson.version}`),
    {
      borderStyle: "round",
      padding: 1,
      margin: 0,
    },
    [borderColor, textColor]
  )
);

import { program } from "commander";
program
  .version(packageJson.version)
  .description("Mi aplicación de línea de comandos")
  .option("-n, --name <nombre>", "Especificar un nombre")
  .option("--help", "Mostrar ayuda")
  .parse(process.argv);
const params = program.opts();
console.log(params)
if (params.help) {
  program.outputHelp();
  process.exit();
}

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit();
}

console.log(
  chalk.white(
    "Lets start create a new component and improve tour productivity. "
  )
);

let config: Config = {
  questionMe: true,
};

const loadConfig = async () => {
  const filename = "astro-components.json";
  const configExist = await verifyFileExistence(filename);
  if (configExist) {
    const configJSON = await readFile(filename);
    if (configJSON) {
      const configParse = JSON.parse(configJSON) as Config;
      config = {
        ...config,
        ...configParse,
      };
    }
  } else {
    console.log("Sin configuración");
  }
};

await loadConfig();

//Obtain the parameters
const parameters = process.argv.slice(2);

// Obtén la ruta completa del archivo
const rutaArchivo = resolve(nombreArchivo);

const verifyIntegration = (
  integration: SupportedIntegrations,
  file: string
) => {
  let importIntegration = "";
  let integrationImplement = "";
  if (integration === "react") {
    importIntegration = `import react from "@astrojs/react"`;
    integrationImplement = "react()";
  } else if (integration === "svelte") {
    importIntegration = `import svelte from '@astrojs/svelte';`;
    integrationImplement = "svelte()";
  } else {
    if (integration === "vuejs") {
      importIntegration = `import vue from '@astrojs/vue';`;
      integrationImplement = "vue()";
    }
  }
  const importIntegrationWithOtherQuote = importIntegration.replaceAll(
    `"`,
    "'"
  );
  const fileContainImportIntegration =
    file.includes(importIntegration) ||
    file.includes(importIntegrationWithOtherQuote);
  const fileContainIntegrationImplementation =
    file.includes(integrationImplement);

  return fileContainImportIntegration && fileContainIntegrationImplementation;
};

const integrations: SupportedIntegrations[] = [];

//Reading the astro config file
const file = await readFile(rutaArchivo);
if (!file) process.exit();
// Ejecutar las funciones
let sourceFolder = "src/components";
let componentName = "";
const verifyParametersAndSetComponentName = async () => {
  if (parameters.length === 0) {
    try {
      const answer = await readFromConsole(
        chalk.blue("Nombre del componente: ")
      );
      if (!answer) {
        console.log("You must provide a name for the component");
        process.exit();
      }
      componentName = answer;
    } catch (error) {
      console.log(error);
    }
  } else {
    const component = parameters[0];
    if (component.includes("/")) {
      const arrayArgsComponent = component.split("/");
      componentName = arrayArgsComponent[arrayArgsComponent.length - 1];
      sourceFolder = arrayArgsComponent
        .slice(0, arrayArgsComponent.length - 1)
        .join("/");
      console.log("Componente", componentName, sourceFolder);
    } else {
      componentName = component;
    }
  }
};

await verifyParametersAndSetComponentName();

const addCurrentInterations = () => {
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

addCurrentInterations();

type AllIntegrations = SupportedIntegrations | "astro";

let typeScriptEnabled = await verifyFileExistence("tsconfig.json");

let frameworkChoosed: AllIntegrations = "astro";

const validateIntegrations = async (): Promise<AllIntegrations> => {
  const message = `Este componente de que framework es (Astro, ${integrations.join(
    ","
  )}) (astro default): `;
  const componentFramework = (await readFromConsole(
    chalk.blue(message)
  )) as AllIntegrations;
  console.log(
    chalk.yellow(
      `"Este es el framework del componente: " ${componentFramework}`
    )
  );
  frameworkChoosed = componentFramework;
  return componentFramework;
};

let componentExtension: ValidExtensions = ".astro";
const validateAvailableIntegrationsAndSeFileExtension = async () => {
  if (integrations.length > 0) {
    const componentFramework: AllIntegrations = await validateIntegrations();
    const componentFrameworkExtension: Record<
      SupportedIntegrations | "astro",
      ValidExtensions
    > = {
      astro: ".astro",
      react: ".tsx",
      svelte: ".svelte",
      vuejs: ".vue",
    };
    if (componentFramework === "react") {
      componentExtension = typeScriptEnabled ? ".tsx" : ".jsx";
    } else {
      componentExtension =
        componentFrameworkExtension[componentFramework] ?? ".astro";
    }
  }
};

await validateAvailableIntegrationsAndSeFileExtension();

const componentFileName = `${componentName}${componentExtension}`;
const componentAbsoulteRoot = `${sourceFolder}/${componentFileName}`;

const baseTemplateUr = "./src/templates/";
const fileTemplateByFramwork: Record<
  AllIntegrations,
  {
    js: string;
    ts: string;
  }
> = {
  astro: {
    js: "",
    ts: "",
  },
  svelte: {
    js:
      config.svelteJSTemplate ??
      `${baseTemplateUr}svelte/SvelteComponentJavaScript.svelte`,
    ts:
      config.svelteTSTemplate ??
      `${baseTemplateUr}svelte/SvelteComponentTypeScript.svelte`,
  },
  react: {
    js:
      config.reactJsxTemplate ??
      `${baseTemplateUr}react/ReactComponentJavaScript.txt`,
    ts:
      config.reactTsx ?? `${baseTemplateUr}react/ReactComponentTypeScript.txt`,
  },
  vuejs: {
    js: `${baseTemplateUr}vue/VueComponentTypeScript.txt`,
    ts: `${baseTemplateUr}vue/VueComponentTypeScript.txt`,
  },
};

let content = "Astro component work";
if (frameworkChoosed !== "astro") {
  const contentFile = fileTemplateByFramwork[frameworkChoosed] as {
    js: string;
    ts: string;
  };
  const fileFrameworkTemplate = contentFile[typeScriptEnabled ? "ts" : "js"];
  const readedTemplateFramework = await readFile(fileFrameworkTemplate);
  content = readedTemplateFramework;
}

if (config.questionMe) {
  const answer = await readFromConsole(
    chalk.blue(
      `¡Todo listo! ¿Quieres agregar este archivo ${componentFileName} a ${sourceFolder}: `
    )
  );
  if (answer) {
    await writeFile(componentAbsoulteRoot, content, sourceFolder);
    console.log("Componente creado exitosamente ");
  } else {
    console.log(chalk.blue("Gracias por todo. Hasta la próxima"));
  }
} else {
  await writeFile(componentAbsoulteRoot, content, sourceFolder);
  console.log("Componente creado exitosamente ");
}
