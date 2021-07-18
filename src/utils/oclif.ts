import * as chalk from 'chalk';

interface oclifUtilArg {
    command: string,
    allowNoArg?: Boolean
}

export function commandDescription(command: string, descriptions: string[]): string {
    var desc = `spm ${command}`;

    if (descriptions.length > 0) desc += `\n${chalk.green("* ")}` + descriptions.join(`\n${chalk.green("* ")}`)

    return desc;
}

export function commandExample(args: oclifUtilArg, examples: string[] = []): string[] {
    var desc: string[] | string = [];

    if (args.allowNoArg != false) args.allowNoArg = true;

    if (args.allowNoArg) desc.push(`$ spm ${args.command}`)

    for (const exp of examples) desc.push(`$ spm ${args.command} ${exp}`)

    return desc;
}