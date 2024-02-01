import { access, constants, mkdir, readFile as rf, writeFile as wf, } from "fs/promises";
import { resolve } from "path";
// Verifica si el archivo existe
export async function verifyFileExistence(filename) {
    try {
        const mainRoot = resolvePath(filename);
        await access(mainRoot, constants.F_OK);
        return true;
    }
    catch (error) {
        return false;
    }
    finally {
    }
}
export async function readFile(filename) {
    try {
        const mainRoot = resolvePath(filename);
        const file = await rf(mainRoot, "utf-8");
        return file;
    }
    catch (error) {
        console.error("File doesn't exist", error);
        return "";
    }
}
export function resolvePath(filename) {
    return resolve(filename);
}
export async function writeFile(filename, content, sourceFolder) {
    try {
        // const mainRoot = resolvePath(filename);
        const haveAccess = await verifyFileExistence(sourceFolder);
        if (!haveAccess) {
            await mkdir(sourceFolder, {
                recursive: true
            });
        }
        await wf(filename, content, {
            encoding: "utf-8",
        });
        console.log(`El archivo ${filename} ha sido creado con éxito.`);
    }
    catch (err) {
        console.error(`Error al crear el archivo: ${err}`);
    }
}
