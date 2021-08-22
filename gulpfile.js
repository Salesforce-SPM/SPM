const gulp = require('gulp');

class SPMCommand {
    args = [];

    constructor(command) {
        this.command = command
    }

    addArg(flag, arg) {
        if (arg) {
            if (flag.length > 1) {
                this.args.push(`--${flag}=${arg}`)
            } else this.args.push(`-${flag}=${arg}`)
        } else {
            if (flag.length > 1) {
                this.args.push(`--${flag}`)
            } else {
                this.args.push(`-${flag}`)
            }
        }
    }

    build() {
        let response = this.command;

        for (const arg of this.args) {
            response += ` ${arg}`
        }

        return `..\\..\\runSPM.bat ${response}`
    }
}



gulp.task('newCommand', async () => {
    const fs = require('fs'),
        inquirer = require('inquirer'),
        ChildProcess = require('child_process');

    let rawCommandName = (await inquirer.prompt({ message: 'Command name: ', type: "input", name: "resp" })).resp.trim().toLowerCase();

    let names = parseName(rawCommandName)

    let file = `// Generated with gulp, task: newCommand
import { Command, flags } from '@oclif/command'
import * as Fs from 'fs';
import * as Utils from '../utils/'
import * as Controller from '../controller/'
import * as Interface from '../interface/'

const cmd = "${rawCommandName}";

const commandDescription = Utils.oclif.commandDescription(
    '${rawCommandName}',
    [ 'Some desc' ]
  );
  
  const commandExamples = Utils.oclif.commandExample(
    { command: '${rawCommandName}', },
    [
      'Some example' 
    ]
  );

export default class ${names.camelCase} extends Command {
    static description = commandDescription;

    static examples = commandExamples;

    static flags = {
        help: flags.help({ char: 'h' })
    };

    // static args = []

    async run() {
        const { args, flags } = this.parse(${names.camelCase})


    }
}`

    fs.writeFileSync(`./src/commands/${names.regular}.ts`, file);

    ChildProcess.exec(`code -r ./src/commands/${names.regular}.ts`)

    function parseName(name) {
        let res = []

        for (var i of name.split(' ')) res.push(i.charAt(0).toUpperCase() + i.slice(1));

        let camelCase = res.join('');
        let regular = camelCase.charAt(0).toLocaleLowerCase() + camelCase.slice(1)

        return { regular, camelCase }
    }
})

gulp.task('createPackage', async () => {
    const inquirer = require('inquirer')
    require('dotenv').config();

    console.log('0', 'nothing');
    console.log('1', 'name only');



    let command = 'package:new '

    let scenario = (await inquirer.prompt({ message: 'scenario:', type: 'input', name: 'resp' })).resp;
    let pkgName = process.env.packageName

    switch (scenario) {
        case '1':
            if (process.env.packageName) command += `--name=${process.env.packageName}`
    }

    console.log('running ' + command);
    process.chdir('./dev/test/testProject')

    await require('child_process').exec(`./dev/runSPM.bat ${command}`)
})

gulp.task('create:environment', async () => {
    let command = new SPMCommand('environment:new');
    require('dotenv').config();

    command.addArg('name', `"${process.env.environmentName}"`)
    command.addArg('user', `"${process.env.user}"`)
    command.addArg('url', `"${process.env.url}"`)
    command.addArg('secretToken', `"${process.env.secretToken}"`)
    command.addArg('password', `"${process.env.password}"`)
    command.addArg('f')

    let cmd = command.build()

    console.log('running ' + cmd);
    process.chdir('dev/test/testProject')

    return await require('child_process').exec(cmd, {}, (err) => { console.log({ err }); });
})


gulp.task('retrieve:environment', async () => {
    const inquirer = require('inquirer');

    console.log('running environment:new');

    let rerun = false;

    let command = new SPMCommand('environment:new');
    require('dotenv').config();

    command.addArg('e', `"${process.env.environmentName}"`)
    command.addArg('p', `"${process.env.packageName}"`)
    command.addArg('f')

    let cmd = command.build();

    console.log('running ' + cmd);
    process.chdir('dev/test/testProject')


    do {

        try {
            const pcss = require('child_process').exec(cmd, {})

            pcss.on('message', (msg) => console.log({ msg }))

        } catch (error) {
            console.log(error);
        }

        rerun = false //(await inquirer.prompt({ message: 'Run again?', type: 'confirm', name: 'resp' })).resp;
    } while (rerun);

    return true;
})