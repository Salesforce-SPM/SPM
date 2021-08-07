// Generated with gulp, task: newCommand
import { Command, flags } from "@oclif/command";
import * as Fs from "fs";
import * as Utils from "../../utils";
import * as controller from "../../controller";
import inquirer = require("inquirer");
import * as defaultEnv from "../../templates/environmentFile.json";
import chalk = require("chalk");

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
    }),
    name: flags.string({ description: "Optional" }), // TODO do a better description
    url: flags.string({ description: "Optional" }), // TODO do a better description
    user: flags.string({ description: "Optional" }), // TODO do a better description
    secretToken: flags.string({ description: "Optional" }), // TODO do a better description
    password: flags.string({ description: "Optional" }), // TODO do a better description
    clientID: flags.string({ description: "Optional" }), // TODO do a better description
    clientSecret: flags.string({ description: "Optional" }), // TODO do a better description
  };

  private environment: controller.Environment;
  private contextArgs: any = {};
  private contextFlags: any = {};

  async run() {
    const { args, flags } = this.parse(Environment);

    this.doInit(args, flags);

    this.environment = new controller.Environment({
      data: {
        name: await this.getEnvName(),
        user: await this.getEnvUser(),
        url: await this.getEnvURL(),
        password: await this.getEnvPassword(),
        secretToken: await this.getEnvSecretToken(),
        clientId: await this.getEnvClientId(),
        clientSecret: await this.getEnvClientSecret(),
      },
    });
    this.printEnv();

    await this.execute();
  }

  doInit(args: any, flags: any) {
    for (const key in args) if (args[key] == "") delete args[key];
    for (const key in flags) if (flags[key] == "") delete flags[key];

    if (!Utils.oclif.checkConfigFile()) Utils.string.errorMessage("Missing config.json");

    if (flags.user && !Utils.validation.isValidEmail(flags.user))
      Utils.string.errorMessage(flags.user + " isn't a valid username!");
    if (flags.url && !Utils.validation.isValidURL(flags.url))
      Utils.string.errorMessage(flags.url + " isn't a valid URL!");

    this.contextArgs = args;
    this.contextFlags = flags;
  }

  printEnv() {
    console.log(chalk.bold("New environment:"));

    Utils.string.printPretty([
      ["Name", this.environment.name],
      ["User", this.environment.user],
      ["URL", this.environment.url],
      ["Password", Utils.string.hideString(this.environment.password)],
      ["Token", this.environment.secretToken],
      ["clientId", this.environment.clientId],
      ["clientSecret", this.environment.clientSecret + "\n"],
    ]);
  }

  async getEnvName() {
    return (
      this.contextArgs.name ??
      this.contextFlags.name ??
      (await Utils.inquirer.input("Inform environment name", "Must inform a valid environment name"))
    );
  }

  async getEnvUser() {
    return (
      this.contextFlags.user ?? (await Utils.inquirer.email("Inform the user name", "Must inform a valid username"))
    );
  }

  async getEnvURL() {
    return (
      this.contextFlags.url ??
      (await Utils.inquirer.url("Inform the environment URL", "Must inform a valid URL", "https://test.salesforce.com"))
    );
  }

  async getEnvPassword() {
    return (
      this.contextFlags.password ??
      (await Utils.inquirer.input("Inform environment password", "Must inform a password"))
    );
  }

  async getEnvSecretToken() {
    return (
      this.contextFlags.secretToken ?? (await Utils.inquirer.input("Inform environment token", "Must inform a token"))
    );
  }

  async getEnvClientId() {
    return (
      this.contextFlags.clientID ??
      (await Utils.inquirer.input("Inform environment connect app client id", "Must inform a client id"))
    );
  }

  async getEnvClientSecret() {
    return (
      this.contextFlags.clientSecret ??
      (await Utils.inquirer.input("Inform environment connect app client secret", "Must inform a client secret"))
    );
  }

  async execute() {
    let fileExist = Fs.existsSync(`${process.cwd()}\\.envs\\${this.environment.filename}`);
    let confirmOverwrite = this.contextFlags.force ?? false;

    if (fileExist && !confirmOverwrite) {
      confirmOverwrite = await Utils.inquirer.confirm(`File ${this.environment.filename} already exist, overwrite it?`);
    } else confirmOverwrite = true;

    if (!confirmOverwrite) return console.log(Utils.string.warning("Canceled"));

    this.environment.save();

    console.log(`${chalk.bold(this.environment.name)} created on .envs as ${chalk.bold(this.environment.filename)}`);
  }
}
