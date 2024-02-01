import readline from "readline/promises";
/**
 * This function read answer by the end user
 * and return it responding a custom question
 * @param question Message that is shown to the user
 * @returns string
 */
export async function readFromConsole(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    try {
        // Wait for the user response
        const answer = await rl.question(question);
        return answer;
    }
    catch (error) {
        console.log(`Error in question ${question}`, error);
        return "";
    }
    finally {
        // Finally close the current console question
        rl.close();
    }
}
