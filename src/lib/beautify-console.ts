
import chalk from 'chalk';

export type ChalkOptions = keyof typeof chalk

export const writeConsole = (message: string, key: ChalkOptions) => {
    chalk.apply(message)
    chalk.arguments = message
    return chalk.call(key)
}