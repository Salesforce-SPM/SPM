// Generated with gulp, task: newCommand
import { Command, flags } from "@oclif/command";
import * as Fs from "fs";
import * as Utils from "../../utils";
import * as Controller from "../../controller";
import * as Helper from "../../helper";
import * as Interface from "../../interface";

const commandDescription = Utils.oclif.commandDescription("Test environment connection with Salesforce remote org", []);

const commandExamples = Utils.oclif.commandExample({ command: "test" }, ["Some example"]);

export default class Test extends Command {
  static description = commandDescription;

  static examples = commandExamples;

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [{ name: "file", description: "Optional, environment file at ./.envs" }];

  async pickEnvironment() {
    let files: Interface.Environment.EnvListItem[] = await Helper.Environment.getEnvList();

    if (files.length == 0) Utils.string.errorMessage("No environmt file founded at ./.envs");

    return await Utils.inquirer.list("Select a environment", files);
  }

  async run() {
    const { args, flags } = this.parse(Test);
    args.file = args.file ?? (await this.pickEnvironment());

    let filePath = "./.envs/" + args.file;

    if (!Fs.existsSync(filePath)) Utils.string.errorMessage(`'${args.file}' not founded at ${filePath}`);

    const env: Controller.Environment = Controller.Environment.loadFile(filePath);

    try {
      console.log("Started connetion test of environment: " + env.name);

      await env.getOauth2AccessToken();
    } catch (error) {
      // console.log(error);
      if (error) {
        if (error.response) {
          let message = "";
          if (error.response.status) message += `Test failed with error status ${error.response.status}`;
          if (error.response.data) {
            if (error.response.data.error_description) {
              message += `: ${error.response.data.error_description}`;
            }
          }
          if (message != "") console.log(message);
        }
      }

      // return false
    }

    // console.log(env.name + ' was succefull conected');

    console.log({ env });

    return true;
  }
}
