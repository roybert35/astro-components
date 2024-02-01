import { getComponentTemplate, verifyIsAstroProject, verifyParametersAndSetComponentName } from "./astro-lib";
import * as fileHelper from "./file-helper.js";
import * as consoleReader from "./read-console.js";
jest.mock("./file-helper");
jest.mock("./read-console");
describe("CLI Functions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // Pruebas para verifyIsAstroProject
    test("verifyIsAstroProject should throw an error if not in an Astro project", async () => {
        fileHelper.verifyFileExistence.mockResolvedValue(false);
        const filename = "astro.config.mjs";
        const verifyResult = await verifyIsAstroProject(filename);
        expect(verifyResult).toBe(false);
    });
    test("verifyIsAstroProject should not throw an error in an Astro project", async () => {
        fileHelper.verifyFileExistence.mockResolvedValue(true);
        const filename = "../../astro.config.mjs";
        const verifyResult = await verifyIsAstroProject(filename);
        expect(verifyResult).toBe(true);
    });
    // Otras pruebas similares para las demás funciones...
    // Pruebas para verifyParametersAndSetComponentName
    test("verifyParametersAndSetComponentName should prompt for component name if no parameters provided", async () => {
        const consoleSpy = jest
            .spyOn(consoleReader, "readFromConsole")
            .mockResolvedValue("TestComponent");
        const result = await verifyParametersAndSetComponentName({
            parameters: [],
        });
        expect(consoleSpy).toHaveBeenCalledWith("Nombre del componente: ");
        expect(result).toEqual({
            componentName: "TestComponent",
            sourceFolder: "src/components",
        });
    });
    // Pruebas para addCurrentInterations, validateFileExtensionIntegrations, loadConfig, etc.
    // Pruebas para getComponentTemplate
    test("getComponentTemplate should return default content for Astro framework", async () => {
        const config = {
            questionMe: true,
        };
        const frameworkChoosed = "astro";
        const baseTemplateUrl = "./src/templates/";
        const typeScriptEnabled = false;
        const result = await getComponentTemplate({
            frameworkChoosed,
            config,
            baseTemplateUrl,
            typeScriptEnabled,
        });
        expect(result).toEqual("Astro component work");
    });
    // Otras pruebas para distintas opciones y casos...
});
