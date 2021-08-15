// Generated with gulp, task: newCommand
import { Command, flags } from "@oclif/command";
import * as Fs from "fs";
import * as Utils from "../../utils";
import * as Controller from "../../controller";
import * as chalk from "chalk";
import { color as printColored } from "../../utils/string";

import { EnvironmentMenu } from "../../private/menu";

const useNameArg: string[] = ["-d", "-u (not implemented)", "-s (not implemented)"];

const commandDescription = Utils.oclif.commandDescription("Create a new environment", [
  "Must be runned at project root",
]);

const commandExamples = Utils.oclif.commandExample({ command: "environment" }, [
  "-c", // TODO give more examples
]);

const optionalDesc = "Optional";

export default class Environment extends Command {
  static description = commandDescription;

  static examples = commandExamples;

  static flags = {
    help: flags.help({ char: "h" }),
    force: flags.boolean({
      char: "f",
      description: `Force command: if a file with the same name already exists, force will overwrite it without confirm`,
      dependsOn: ["name", "url", "user", "secretToken", "password"],
    }),
    name: flags.string({ description: "Optional" }), // TODO do a better description
    url: flags.string({ description: "Optional" }), // TODO do a better description
    user: flags.string({ description: "Optional" }), // TODO do a better description
    secretToken: flags.string({ description: "Optional" }), // TODO do a better description
    password: flags.string({ description: "Optional" }), // TODO do a better description
  };

  private environment: Controller.Environment;
  private args: any;
  private flags: {
    force: boolean;
    name: string;
    url: string;
    user: string;
    secretToken: string;
    password: string;
  };

  private menu: EnvironmentMenu;

  private doInit() {
    const { args, flags } = this.parse(Environment);
    flags.force = flags.force ?? false;

    const project = new Controller.Project({
      path: process.cwd(),
      options: { loadConfig: true },
    });

    this.flags = Utils.validation.sanitizeJson(flags);
    this.args = Utils.validation.sanitizeJson(args);

    if (this.flags.user && !Utils.validation.isValidEmail(this.flags.user)) {
      Utils.string.errorMessage(this.flags.user + " isn't a valid username!");
    }
    if (this.flags.url && !Utils.validation.isValidURL(this.flags.url)) {
      Utils.string.errorMessage(this.flags.url + " isn't a valid URL!");
    }

    this.environment = new Controller.Environment({
      options: {
        config: {
          name: this.flags.name ?? null,
          url: this.flags.url ?? project.config.defaultUrl,
          user: this.flags.user ?? "",
          token: this.flags.secretToken ?? "",
          password: this.flags.password ?? "",
        },
        project,
      },
    });

    this.menu = new EnvironmentMenu(this.environment, {
      text: "Setup new environment",
      returnText: chalk.bold("Continue"),
      deletable: false,
    });
  }

  async run() {
    this.doInit();

    if (!this.flags.force) {
      let envIsValid: Boolean | string = false;

      do {
        await this.menu.start();
        envIsValid = this.environment.isValid();

        if (envIsValid != true) Utils.string.color.red("Error, invalid: " + envIsValid);
      } while (envIsValid != true);
    } else if (this.environment.isValid() != true) {
      Utils.string.color.red("Error, invalid environment");
    }

    if (!(await this.confirmCreation())) return this.cancelCreation();

    this.environment.save({ force: true });

    console.log(`\n${chalk.bold(this.environment.name)} environment created at ./.envs`);
  }

  private async confirmCreation() {
    Utils.string.color.bold(`${this.flags.force ? "" : "==============\n"}New environment:`);

    let envJson = this.environment.toJSON();
    envJson.password = Utils.string.hideString(envJson.password);

    Utils.string.printTree(envJson);

    let confirm: Boolean = false;
    if (this.flags.force) {
      printColored.yellow(`Environment creation auto confirmed`);

      if (this.environment.fileExist()) {
        Utils.string.warning(`${this.environment.path} alread exists, it was overwrited due to --force.`);
      }

      return true;
    }

    if (!(await Utils.inquirer.confirm(`Create new environment?`, { defaultValue: true }))) return false;

    if (this.environment.fileExist()) {
      return await Utils.inquirer.confirm(`${this.environment.path} alread exists, overwrite it?`, {
        defaultValue: true,
      });
    }

    return true;
  }

  public cancelCreation() {
    Utils.string.errorMessage("Environment creation canceled");
  }
}
