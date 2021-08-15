// Generated with gulp, task: newCommand
import { Command, flags } from "@oclif/command";
import * as Fs from "fs";
import * as Utils from "../../utils";
import * as Controller from "../../controller";
import * as Interface from "../../interface";

const cmd = "menu";

const commandDescription = Utils.oclif.commandDescription("menu", ["Some desc"]);

const commandExamples = Utils.oclif.commandExample({ command: "menu" }, ["Some example"]);

export default class Menu extends Command {
  static description = commandDescription;

  static examples = commandExamples;

  static flags = {
    help: flags.help({ char: "h" }),
  };

  // static args = []

  async run() {
    const { args, flags } = this.parse(Menu);
  }
}
