import { input } from '@inquirer/prompts';
/**
 * This function read answer by the end user
 * and return it responding a custom question
 * @param message Message that is shown to the user
 * @returns string
 */
export async function readFromConsole(message) {
    try {
        // Wait for the user response
        const answer = await input({ message });
        return answer;
    }
    catch (error) {
        return "";
    }
}
