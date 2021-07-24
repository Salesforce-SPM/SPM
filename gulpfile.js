const fs = require('fs'),
    { task, src, dest, pipe } = require('gulp'),
    inquirer = require('inquirer'),
    ChildProcess = require('child_process');



task('newCommand', async () => {
    let rawCommandName = (await inquirer.prompt({ message: 'Command name: ', type: "input", name: "resp" })).resp.trim().toLowerCase();

    let names = parseName(rawCommandName)

    let file = `// Generated with gulp, task: newCommand
import { Command, flags } from '@oclif/command'
import * as Fs from 'fs';
import * as Utils from '../utils/'
import * as controller from '../controller/'

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

        // commandNameUpperCase = commandName.charAt(0).toUpperCase() + commandName.slice(1);

    }
})