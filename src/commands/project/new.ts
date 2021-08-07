import * as ChildProcess from "child_process";
import * as Fs from "fs";

import { Command, flags } from "@oclif/command";
import * as inquirer from "inquirer";

import * as Utils from "../../utils";
import * as controller from "../../controller";

interface ProjectData {
  name: String;
  path: String;
}

const commandDescription = Utils.oclif.commandDescription("Start the wizard to create a new project on current dir.", [
  "Will create a new project, if no path is informed, it will be created in the current folder.",
  "The name argument and path are both optional",
  'If informed a name, it be converted to "camelCase" on folder creation',
  "If informed a path, it must be absolute and not exist.",
  'In order to inform a path, a must be informed before: "$ spm init "Some Name" c:\\someName"',
]);

const commandExamples = Utils.oclif.commandExample({ command: "init" }, [`"Some Name"`, `"Some Name" -f`]);

export default class InitProject extends Command {
  static description = commandDescription;

  static examples = commandExamples;

  static flags = {
    help: flags.help({ char: "h", description: "Show command options" }),
    force: flags.boolean({
      char: "f",
      default: false,
      description: "Auto confirm project creation",
    }),
    displayDir: flags.boolean({
      char: "d",
      default: true,
      description: "Open project on file explorer after create it.",
      allowNo: true,
    }),
  };

  static args = [
    { name: "name", description: "Optional, set project name, if not informed, terminal will ask for a project name." },
    // { name: 'path', description: 'Optional, set project path, by default, it uses the current terminal location.' }
  ];

  getName = async (defaultValue: String | undefined) => {
    return defaultValue
      ? defaultValue.trim()
      : (await inquirer.prompt({ type: "input", name: "resp", message: "Project name" })).resp.trim();
  };

  getPath = async (defaultValue: String | undefined) => {
    let response = defaultValue ?? process.cwd();

    if (response == undefined) response = "";

    try {
      if (Fs.lstatSync(<string>response).isDirectory() == false) response = "";
    } catch (error) {
      response = "";
    }

    return response;
  };

  async run() {
    const { args, flags } = this.parse(InitProject);

    const projectName: string = await this.getName(args.name);
    const projectPath: string = process.cwd() + "\\" + Utils.string.camelCase(projectName);

    const project = new controller.Project({ path: projectPath, name: projectName });

    project.isValid();

    console.log(Utils.string.warning(`Creating new project:`));
    Utils.string.printPretty([
      ["Name", project.name],
      ["At", project.path],
    ]);

    if (flags.force) console.log(`Project creation auto confirmed`);
    else flags.force = await Utils.inquirer.confirm(`Confirm creation of new project?`, true);

    if (!flags.force) {
      console.log(Utils.string.warning("Project creation canceled"));
      return;
    }

    if (project.create()) {
      console.log(Utils.string.warning(project.name + " created."));

      try {
        if (flags.displayDir) ChildProcess.exec('start "" ' + project.path);
      } catch (error) {
        console.log(error, "\nFail to open dir on file explorer");
      }
    }

    //TODO loop create envs
  }
}
