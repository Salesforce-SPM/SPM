import * as ChildProcess from 'child_process'
import * as Fs from 'fs';

import { Command, flags } from '@oclif/command';
import * as inquirer from 'inquirer';

import * as Utils from '../utils/'
import * as controller from '../controller/'

interface ProjectData {
  name: String,
  path: String
}

const commandDescription = Utils.oclif.commandDescription(
  'init',
  [
    'Will create a new project, if no path is informed, it will be created in the current folder.',
    'The name argument and path are both optional',
    'If informed a name, it be converted to "camelCase" on folder creation',
    'If informed a path, it must be absolute and not exist.',
    'In order to inform a path, a must be informed before: "$ spm init "Some Name" c:\\someName"'
  ]
);

const commandExamples = Utils.oclif.commandExample(
  { command: 'init', },
  [
    `"Some Name"`,
    `"Some Name" c:\\someName`,
    `"Some Name" c:\\someOtherName`,
    `"Some Name" c:\\someOtherName -f`,
  ]
);

export default class InitProject extends Command {
  static description = commandDescription

  static examples = commandExamples

  static flags = {
    help: flags.help({ char: 'h', description: 'Show command options' }),
    force: flags.boolean({
      char: 'f',
      default: false,
      description: 'Auto confirm project creation',
    })
  }

  static args = [
    { name: 'name', description: 'Optional, set project name, if not informed, terminal will ask for a project name.' },
    { name: 'path', description: 'Optional, set project path, by default, it uses the current terminal location.' }
  ]

  getName = async (defaultValue: String | undefined) => {
    return defaultValue ? defaultValue.trim() : ((await inquirer.prompt({ type: 'input', name: 'resp', message: "Project name" })).resp).trim();
  }

  getPath = async (defaultValue: String | undefined) => {
    let response = defaultValue ?? process.cwd();

    if (response == undefined) response = '';

    try {
      if (Fs.lstatSync(<string>response).isDirectory() == false) response = '';
    }
    catch (error) { response = '' }

    return response
  }

  async run() {
    const { args, flags } = this.parse(InitProject);

    const projectName: string = await this.getName(args.name);
    const projectPath: string = args.path ?? process.cwd() + '\\' + Utils.string.camelCase(projectName);

    var confirmCreation: Boolean = flags.force;

    const project = new controller.Project({
      path: projectPath,
      name: projectName,
    });

    project.isValid();


    console.log(Utils.string.warning(`Creating new project:`));
    Utils.string.printPretty([
      ["Name", project.name],
      ["At", project.path]
    ])

    if (confirmCreation) {
      console.log(`Project creation auto confirmed`);
    } else {
      confirmCreation = (await inquirer.prompt({
        type: 'confirm',
        name: 'resp',
        message: `Confirm creation of new project? `
      })).resp;
    }

    if (!confirmCreation) console.log(Utils.string.warning('Project creation canceled'));

    if (project.create()) {
      console.log(Utils.string.warning(project.name + " created."));

      try { ChildProcess.exec('start "" ' + project.path) }
      catch (error) { console.log(error, "\nFail to open dir on file explorer") }
    }
  }
}