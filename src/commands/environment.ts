// Generated with gulp, task: newCommand
import { Command, flags } from '@oclif/command'
import * as Fs from 'fs';
import * as Utils from '../utils/'
import * as controller from '../controller/'
import inquirer = require('inquirer');
import * as defaultEnv from '../templates/default/environmentFile.json';
import chalk = require('chalk');

const useNameArg: string[] = ['-d', '-u (not implemented)', '-s (not implemented)']

const commandDescription = Utils.oclif.commandDescription('environment', [
    'Multiple environemnt tools',
    'Must be runned at project root',
    `Must inform the name arg "spm environment envName" if using the flags: ${useNameArg.join(',')}`
]);

const commandExamples = Utils.oclif.commandExample({ command: 'environment' }, [
]);

const optionalDesc = 'Optional, use it when creating or updating a environment.';


export default class Environment extends Command {
    static description = commandDescription;

    static examples = commandExamples;

    static flags = {
        // TODO delete: flags.boolean({ char: 'd', description: 'Delete informed environment, must pass name arg.' })
        // TODO show: flags.boolean({ char: 's', description: '' })
        // TODO update: flags.boolean({ char: '', description: '' })
        help: flags.help({ char: 'h' }),
        force: flags.boolean({
            char: 'f',
            description: `Force command: ` +
                `deleting won't confirm deletion, ` +
                `creating will overwrite a existing file with the same name`
        }),
        create: flags.boolean({
            char: 'c',
            default: false,
            description: 'Create a new environment.',
            exclusive: ['delete']
        }),
        name: flags.string({ char: 'n', description: optionalDesc }),
        url: flags.string({ char: 'l', description: optionalDesc }),
        user: flags.string({ char: 'u', description: optionalDesc }),
        token: flags.string({ char: 't', description: optionalDesc }),
        password: flags.string({ char: 'p', description: optionalDesc })
    }

    // static args = []

    static async buildNewEnv(args: any, flags: any) {
        if (flags.user && !Utils.validation.isValidEmail(flags.user)) Utils.string.errorMessage(flags.user + " isn't a valid username!")
        if (flags.url && !Utils.validation.isValidURL(flags.url)) Utils.string.errorMessage(flags.url + " isn't a valid URL!")


        let data = {
            name: args.name ?? flags.name ?? await Utils.inquirer.input('Inform environment name', 'Must inform a valid environment name'),
            user: flags.user ?? await Utils.inquirer.email("Inform the user name", 'Must inform a valid username'),
            url: flags.url ?? await Utils.inquirer.url("Inform the environment URL", 'Must inform a valid URL', "https://test.salesforce.com"),
            password: flags.password ?? await Utils.inquirer.input('Inform environment password', 'Must inform a password'),
            token: flags.token ?? await Utils.inquirer.input('Inform environment token', 'Must inform a token'),
        }

        const env = new controller.Environment({ data })

        console.log(chalk.bold('New environment:'));

        Utils.string.printPretty([
            ['Name', env.name],
            ['User', env.user],
            ['URL', env.url],
            ['Password', Utils.string.hideString(env.password)],
            ['Token', env.token + '\n']
        ]);


        let fileExist = Fs.existsSync(`${process.cwd()}\\.envs\\${env.filename}`);
        let confirmOverwrite = flags.force ?? false;

        if (fileExist && !confirmOverwrite) {
            confirmOverwrite = await Utils.inquirer.confirm(`File ${env.filename} already exist, overwrite it?`);
        }
        else confirmOverwrite = true;

        if (!confirmOverwrite) return console.log(Utils.string.warning("Canceled"));

        env.save();

        console.log(env.name + " created on .envs");

    }

    async run() {
        const { args, flags } = this.parse(Environment);

        for (const key in args) if (args[key] == '') args[key] = null;
        //@ts-ignore
        for (const key in flags) if (flags[key] == '') flags[key] = null;

        if (!Utils.oclif.checkConfigFile()) Utils.string.errorMessage("Missing config.json");

        if (flags.create) return Environment.buildNewEnv(args, flags);


        // console.log({ flags });





    }
}