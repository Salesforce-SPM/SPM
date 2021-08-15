// TODO refazer validação no C://
import * as ChildProcess from "child_process";
import * as Fs from "fs";
import * as Path from "path";
import { Command, flags } from "@oclif/command";
import * as inquirer from "inquirer";
import * as Utils from "../../utils";
import * as Controller from "../../controller";
import { color as printColored } from "../../utils/string";
import { default as NewEnvironmentCommand } from "../environment/new";
import chalk = require("chalk");

const cmd = "project:new";

interface ProjectData {
  name: String;
  path: String;
}

const commandDescription = Utils.oclif.commandDescription("Start the wizard to create a new project.", [
  "Will start the SPM wizard to create a new project.",
  "The project name will be converted to camelCase to create the project dir",
]);

const commandExamples = Utils.oclif.commandExample({ command: cmd }, [
  "someName",
  `"Some Name"`,
  `"Some Name" -f`,
  `"Some Name" --no-displayDir -f`,
  `"Some Name" -p=C://some/path -f`,
]);

export default class InitProject extends Command {
  static description = commandDescription;

  static examples = commandExamples;

  static flags = {
    help: flags.help({ char: "h", description: "Show command options" }),
    force: flags.boolean({
      char: "f",
      default: false,
      description: "[default=false] Auto confirm project creation, if it's passed will auto confirm everything",
    }),
    displayDir: flags.boolean({
      char: "d",
      default: true,
      description: "[default=true] Open project on file explorer after create it.",
      allowNo: true,
    }),
    createAt: flags.string({
      char: "p",
      description:
        "Optional, absolute path where the project will be created, will auto complete the path with the project name (like C://myPath/projectName).\nWhen using --force and it's a invalid path or --createAt wasn't informed, its value is the current dir",
    }),
    // config: flags.string({ multiple: true, description: "Option, set's project config, can be passed multiple times on the same call (spm /.../ --config=optionA --config=optionB)." }),
  };

  static args = [
    {
      name: "name",
      description:
        "Optional, set project name, if not informed, terminal will ask for a project name. It's mandatory if passed --force",
    },
  ];

  private flags: any;
  private args: any;
  private project: Controller.Project;

  private doInit() {
    const { args, flags } = this.parse(InitProject);
    flags.force = flags.force ?? false;

    this.flags = Utils.validation.sanitizeJson(flags);
    this.args = Utils.validation.sanitizeJson(args);
  }

  private async getName() {
    if (!this.args.name && this.flags.force) {
      Utils.string.errorMessage(
        'Process has force=true but no name was informed (spm project:new "Some Project Name" -f). See spm project:new -h'
      );
    }
    this.project.name = this.args.name;

    if (!this.project.name) {
      let message = "Project name";
      this.project.name = await Utils.inquirer.input({ message, error: "Project must have a name" });
    }
  }

  private validatePath(path: string): string {
    if (!Path.isAbsolute(path)) return `${path} is't a valid path!`;

    return null;
  }

  private async getPath() {
    if (this.flags.createAt) {
      if (this.validatePath(this.flags.createAt) != null) {
        printColored.red(`"${this.flags.createAt}" isn't a valid path!`);
      } else {
        this.project.path = `${this.flags.createAt}\\${Utils.string.camelCase(this.project.name)}`;
      }
    }

    if (!this.project.path || this.project.path == "") {
      this.project.path = `${process.cwd()}\\${Utils.string.camelCase(this.project.name)}`;

      let confirmPath = this.flags.force;
      if (!confirmPath) {
        let options = { yes: "Yes", no: "No" };
        let message = `Create project at "${this.project.path}"?`;

        confirmPath = await Utils.inquirer.confirm(message, { defaultValue: true, answers: options });
      }

      if (!confirmPath) {
        let message = "Project path";
        let error = "Project must has a path!";

        this.project.path = await Utils.inquirer.input({ message, error, validate: this.validatePath });
      }
    }
  }

  private async confirmCreation() {
    let confirm: Boolean = false;
    if (this.flags.force) {
      printColored.yellow(`Project creation auto confirmed \n`);
      return true;
    }

    confirm = await Utils.inquirer.confirm(`Create new project?`, { defaultValue: true });

    if (!confirm) return false;

    if (Fs.existsSync(this.project.path)) {
      confirm = await Utils.inquirer.confirm(`Dir at ${this.project.path} alread exists, overwrite it?`, {
        defaultValue: true,
      });
      console.log();
    }

    return confirm;
  }

  async run() {
    this.doInit();

    this.project = new Controller.Project();

    await this.getName();
    await this.getPath();

    if (!this.project.isValid(true)) return;

    console.log(chalk.bold("\nCreating new project: "));

    Utils.string.printPretty([
      ["Name", this.project.name],
      ["At", this.project.path],
    ]);

    console.log(chalk.bold(`\nProject options:`));
    Utils.string.printTree(this.project.config);
    console.log();

    if (!this.confirmCreation()) return printColored.red("Project creation canceled");

    if (this.project.create({ force: true })) {
      console.log();
      Utils.string.warning(this.project.name + " created.");

      try {
        if (this.flags.displayDir) ChildProcess.exec('start "" ' + this.project.path);
      } catch (error) {
        console.log(error, "\nFail to open project on file explorer");
      }
    }
  }
}
