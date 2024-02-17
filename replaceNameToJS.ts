import fs from "fs";
import path from "path";
import ora from 'ora';
import chalk from "chalk";

const spinnerOra = ora('Reemplazando archivos');

function replaceString(filePath: string, searchString: string, replaceString: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  const regex = new RegExp(searchString, "g");
  const newContent = content.replace(regex, replaceString);
  fs.writeFileSync(filePath, newContent);
}

function walkDir(dirPath: string) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath);
    } else if (filePath.endsWith(".js")) {
      for (const iterator of dataToReplace) {
        replaceString(filePath, iterator, `${iterator}.js`);
      }
    }
  }
}


const dataToReplace = ["file-helper", "astro-lib", "read-console"]

// Ruta al directorio donde se encuentra el código
const rootDir = "./dist/src";
spinnerOra.start();
// Iniciar el recorrido por el directorio
walkDir(rootDir);
spinnerOra.succeed()
spinnerOra.stop();

console.log(chalk.green(`Reemplazo completo`));
