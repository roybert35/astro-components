import { access, constants, readFile as rf } from "fs/promises";
import { resolve } from "path";

// Verifica si el archivo existe
export async function verifyFileExistence(filename: string) {
  try {
    const mainRoot = resolvePath(filename);
    await access(mainRoot, constants.F_OK);
    return true;
  } catch (error) {
    console.error("Error", error);
    return false;
  } finally {
  }
}

export async function readFile(filename: string) {
  try {
    const mainRoot = resolvePath(filename);
    const file = await rf(mainRoot, "utf-8");
    return file;
  } catch (error) {
    console.error("File doesn't exist", error)
    return ""
  }
}

export function resolvePath(filename: string) {
  return resolve(filename);
}
