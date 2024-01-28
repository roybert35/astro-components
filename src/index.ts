// archivo-main.ts
import chalk from "chalk";
import readline from "readline";
import { writeConsole } from "./lib/beautify-console";
import { readFromConsole } from "./lib/read-console";
import { access, constants, readFile } from "fs/promises";
import { resolve } from "path";
import { SupportedIntegrations, ValidExtensions } from "./types";
import { verifyFileExistence } from "./lib/file-helper";

const args = process.argv.slice(2);

console.log("Argumentos", args);
const nombreArchivo = "astro.config.mjs";

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
// Ejecutar las funciones
const verifyIsAstroProject = await verifyFileExistence(nombreArchivo);
if (!verifyIsAstroProject) process.exit();

let componentName = "";
if (args.length === 0) {
  try {
    const answer = await readFromConsole(chalk.blue("Nombre del componente: "));
   
    componentName = answer;
  } catch (error) {
    console.log(error);
   
  }
}
console.log("El archivo existe");
const file = await readFile(rutaArchivo, "utf-8");
if (!file) process.exit();
if (verifyIntegration("react", file)) {
  integrations.push("react");
}
if (verifyIntegration("svelte", file)) {
  integrations.push("svelte");
}
console.log("Integrations", integrations);
const validateIntegrations = async () => {
  const message = `Este componente de que framework es (Astro, ${integrations.join(
    ","
  )}) (astro default): `;
  const componentFramework = await readFromConsole(chalk.blue(message));
  console.log(
    chalk.yellow(
      `"Este es el framework del componente: " ${componentFramework}`
    )
  );
  return componentFramework;
};
let componentExtension: ValidExtensions = ".astro";
if (integrations.length > 0) {
  const componentFramework: SupportedIntegrations | "astro" =
    (await validateIntegrations()) as SupportedIntegrations | "astro";
  const componentFrameworkExtension: Record<
    SupportedIntegrations | "astro",
    ValidExtensions
  > = {
    astro: ".astro",
    react: ".tsx",
    svelte: ".svelte",
    vuejs: ".tsx",
  };
  componentExtension =
    componentFrameworkExtension[componentFramework] ?? ".astro";
}

const componentFileName = `${componentName}${componentExtension}`;
console.log("Component Name Extension", componentFileName);
function escribirConEstilo() {
  console.log(chalk.blue("Texto con estilo en azul"));
  console.log(chalk.green.bold("Texto en verde y en negrita"));
  console.log(chalk.red.underline("Texto subrayado en rojo"));
  console.log(writeConsole("Rojo", "red"));
  console.log(
    chalk.green(
      "I am a green line " +
        chalk.blue.underline.bold("with a blue substring") +
        " that becomes green again!"
    )
  );
}

async function leerDeConsola() {
  const answer = await readFromConsole(
    chalk.blue("¿Este es un proyecto de astro?")
  );
  console.log(chalk.yellow(`"Este es un proyecto de astro" ${answer}`));
}
