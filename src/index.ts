#! /usr/bin/env node
import chalk from "chalk";
import { dirname, resolve } from "path";
import { fileURLToPath } from 'url';
import packageJson from "../package.json" assert { type: "json" };
import { readFile, verifyFileExistence, writeFile } from "./lib/file-helper";
import {
  AllIntegrations,
  Config,
  SupportedIntegrations
} from "./types";

import gradientBox from "gradient-boxen";
const filename = "astro.config.mjs";

const result = await verifyIsAstroProject(filename);
if(!result) process.exit()

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

import confirm from '@inquirer/confirm';
import { program } from "commander";
import {
  addCurrentInterations,
  getComponentTemplate,
  loadConfig,
  validateAvailableIntegrationsAndSetFileExtension,
  verifyIsAstroProject,
  verifyParametersAndSetComponentName
} from "./lib/astro-lib";
program
  .version(packageJson.version)
  .description("Astro component cli")
  .option("-n, --name <nombre>", "Especificar un nombre")
  .option("--help", "Mostrar ayuda")
  .parse(process.argv);
const params = program.opts();

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

console.log("                                                             ")

let config: Config = {
  questionMe: true,
};

await loadConfig();

//Obtain the parameters
const parameters = process.argv.slice(2);

// Obtén la ruta completa del archivo
const fileRoot = resolve(filename);

const integrations: SupportedIntegrations[] = [];

//Reading the astro config file
const file = await readFile(fileRoot);
if (!file) process.exit();
// Ejecutar las funciones

const { componentName, sourceFolder } =
  await verifyParametersAndSetComponentName({
    parameters,
  });

addCurrentInterations({
  file,
  integrations,
});

const typeScriptEnabled = await verifyFileExistence("tsconfig.json");

const {
  componentExtension,
  frameworkChoosed,
}: {
  componentExtension: string;
  frameworkChoosed: AllIntegrations;
} = await validateAvailableIntegrationsAndSetFileExtension({
  integrations,
  typeScriptEnabled,
});

const componentFileName = `${componentName}${componentExtension}`;
const componentAbsoulteRoot = `${sourceFolder}/${componentFileName}`;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseTemplateUrl = resolve(__dirname, "templates");

let componentTemplate: string = await getComponentTemplate({
  frameworkChoosed,
  config,
  baseTemplateUrl,
  typeScriptEnabled,
});

if (config.questionMe) {
  const answer = await confirm({ message: chalk.blue(
    `¡Todo listo! ¿Quieres agregar este archivo ${componentFileName} a ${sourceFolder} : `
  ) });
 
  if (answer) {
    if(frameworkChoosed === "react"){
       componentTemplate = componentTemplate.replaceAll("ReactComponent", componentName)
    }
   
    await writeFile(componentAbsoulteRoot, componentTemplate, sourceFolder);
    console.log("Componente creado exitosamente ");
  } else {
    console.log(chalk.blue("Gracias por todo. Hasta la próxima"));
  }
} else {
  await writeFile(componentAbsoulteRoot, componentTemplate, sourceFolder);
  console.log("Componente creado exitosamente ");
}
