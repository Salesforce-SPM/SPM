import * as chalk from 'chalk';

export function printPretty(list: string[][]) {
    let message = '';

    for (const item of list) message += `${chalk.bold(`${item[0]}:`)} ${item[1]}\n`;

    console.log(message.substring(0, message.length - 1));
}

export function errorMessage(text: string): string {
    throw new Error(chalk.red.bold(text))
};


export function sanitizeString(str: String) {
    var r = str.toLowerCase().trim().replace(/\s+/g, " ")
        .replace(new RegExp(/\s/g), "-")
        .replace(new RegExp(/[àáâãäå]/g), "a")
        .replace(new RegExp(/æ/g), "ae")
        .replace(new RegExp(/ç/g), "c")
        .replace(new RegExp(/[èéêë]/g), "e")
        .replace(new RegExp(/[ìíîï]/g), "i")
        .replace(new RegExp(/ñ/g), "n")
        .replace(new RegExp(/[òóôõö]/g), "o")
        .replace(new RegExp(/œ/g), "oe")
        .replace(new RegExp(/[ùúûü]/g), "u")
        .replace(new RegExp(/[ýÿ]/g), "y")
        .replace(new RegExp(/\W/g), "-");
    return r;
}

export function camelCase(str: string): string {
    str = sanitizeString(str)
        .replace(/\-/g, " ")
        .replace(/\-/g, " ")
        .replace(/\s[a-z]/g, (s) => s.toUpperCase())
        .replace(/\s+/g, "")
        .replace(/^[A-Z]/g, (s) => s.toLowerCase())
    return str;
}
