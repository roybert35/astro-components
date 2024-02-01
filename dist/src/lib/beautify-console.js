import chalk from 'chalk';
export const writeConsole = (message, key) => {
    chalk.apply(message);
    chalk.arguments = message;
    return chalk.call(key);
};
