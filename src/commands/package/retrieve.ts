// Generated with gulp, task: newCommand
import { Command, flags } from "@oclif/command";
import * as Fs from "fs";
import * as Utils from "../../utils";
import * as Controller from "../../controller";
import * as Helper from "../../helper";

const commandDescription = Utils.oclif.commandDescription("retrieve", ["Some desc"]);

const commandExamples = Utils.oclif.commandExample({ command: "retrieve" }, ["Some example"]);

export default class Retrieve extends Command {
  static description = commandDescription;

  static examples = commandExamples;

  static flags = {
    help: flags.help({ char: "h" }),
    // TODO
    // * is test
    // * rollback
    // ? await
  };

  static args = [
    { name: "name", description: "Package dir name" },
    { name: "environment", description: "Environment file" },
  ];

  private contextArgs: any;
  private contextFlags: any;

  async run() {
    const { args, flags } = this.parse(Retrieve);
    this.contextArgs = args;
    this.contextFlags = flags;

    if (!Utils.oclif.checkConfigFile()) Utils.string.errorMessage("./config.json not founded");

    let data = {
      pkg: new Controller.Package({ name: await this.getPackageName() }),
      env: await this.getEnvironment(),
    };

  }

  async getPackageName() {
    return this.contextArgs.name;
  }

  async getEnvironment() {
    return Helper.Environment.loadEnvFile(this.contextArgs.environment);
  }
}
