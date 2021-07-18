import { Command, flags } from '@oclif/command';
import * as fs from 'fs';
import * as inquirer from 'inquirer';
import * as chalk from 'chalk';
import * as Utils from '../utils/'
import * as controller from '../controller/'

interface ProjectData {
  name: String,
  path: String
}

function parseNoConfirm(input: string) {
  const allowedReplies = ['y', 'yes', 'true']

  input = input.trim().toLocaleLowerCase();

  return `${allowedReplies.includes(input)}`
}

export default class InitProject extends Command {
  static description = 'spm init will create a new project, if no path is informed, it will be created in the current folder'

  static examples = [
    `$ spm init`,
    `$ spm init "Some Name"`,
    `$ spm init "Some Name" c:\\path`,
    `$ spm init "Some Name" c:\\path -f y`,
    `$ spm init "Some Name" c:\\path -f=y`
  ]

  static flags = {
    help: flags.help({ char: 'h', description: 'Show command options' }),
    force: flags.string({ char: 'f', description: 'Auto config project creation', helpValue: 'y', options: ['y', 'yes', 'true', 'n', 'no', 'false'], parse: input => parseNoConfirm(input) })
  }

  static args = [
    { name: 'name', description: 'Set project name' },
    { name: 'path', description: 'Set project path' }
  ]

  getName = async (defaultValue: String | undefined) => {
    return defaultValue ? defaultValue.trim() : ((await inquirer.prompt({ type: 'input', name: 'resp', message: "Project name" })).resp).trim();
  }

  getPath = async (defaultValue: String | undefined) => {
    let response = defaultValue ?? process.cwd();

    if (response == undefined) response = '';

    try {
      if (fs.lstatSync(<string>response).isDirectory() == false) response = '';
    }
    catch (error) { response = '' }

    return response
  }

  // @ts-ignore
  async run() {
    const { args, flags } = this.parse(InitProject);

    const projectName: string = await this.getName(args.name);
    const projectPath: string = args.path ?? process.cwd() + '\\' + Utils.string.camelCase(projectName);

    var confirmCreation = flags.force === 'true';

    console.log({ projectName });


    const project = new controller.Project({
      path: projectPath,
      name: projectName,
    });

    project.isValid();

    console.log(`Creating new project: \n${project.toString()}\n${chalk.bold('At')}: ${project.creatAt}`);


    // if (!confirmCreation) {
    //   confirmCreation = (await inquirer.prompt({
    //     type: 'confirm',
    //     name: 'resp',
    //     message: `Confirm creation of new project? `
    //   })).resp;
    // }

    // if (confirmCreation) return project.create();
    // else console.log('Project creation canceled');
  }
}
