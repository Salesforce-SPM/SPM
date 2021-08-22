// Generated with gulp, task: newCommand
import { Command, flags } from "@oclif/command";
import * as Fs from "fs";
import * as Path from "path";
import * as Utils from "../../utils";
import * as Controller from "../../controller";
import * as Interface from "../../interface";
import cli from "cli-ux";
import { logger } from "../../private/class/logger";

const cmd = "retrieve";

const commandDescription = Utils.oclif.commandDescription("retrieve", ["Some desc"]);

const commandExamples = Utils.oclif.commandExample({ command: "retrieve" }, ["Some example"]);

export default class Retrieve extends Command {
  static description = commandDescription;

  static examples = commandExamples;

  static flags = {
    help: flags.help({ char: "h" }),

    environment: flags.string({ char: "e" }),
    package: flags.string({ char: "p" }),
    force: flags.boolean({ char: "f" }),
    noLog: flags.boolean(),
    saveResult: flags.boolean(),
  };

  private flags: any;
  private project: Controller.Project;
  private package: Controller.Package;
  private environment: Controller.Environment;

  // static args = []

  async run() {
    this.doInit();
    await this.getEnvironemnt();
    await this.getPackage();

    const deployer = new Controller.RetrievePackage({
      environment: this.environment,
      project: this.project,
      package: this.package,
    });

    deployer.prepareRetrieve();

    let doRetrieve = this.flags.force;

    if (!doRetrieve) {
      doRetrieve = await Utils.inquirer.confirm("Execute retrieve?", { defaultValue: true });
    }

    if (!doRetrieve) this.cancelProcess();

    cli.action.start("Executing retrieve");

    await deployer.execute(this.flags.saveResult);

    if (deployer.retriveHasErrors()) {
      cli.action.stop(Utils.string.color.red("fail", false));
      logger.error(`Failed, log saved at ${logger.path}`, { exception: false });

      const errors: any = {};

      for (const i of Array.isArray(deployer.result.messages) ? deployer.result.messages : [deployer.result.messages]) {
        errors[i.fileName] = Array.isArray(i.problem) ? i.problem : [i.problem];
      }

      Utils.string.color.red("Retrieve errors:");
      for (const key in errors) {
        Utils.string.color.red(" - " + key + ":");
        Utils.string.color.red("   - " + errors[key]);
      }

      logger.error(`Retrieve failed`, { exception: true });
    } else {
      cli.action.stop(Utils.string.color.green("done", false));
      await deployer.unzip();
    }

    await cli.wait(100);

    if (this.flags.force) return;

    if (this.flags.noLog) {
      deployer.deleteLog();
      logger.info("--noLog=true, auto deleted logs", true);
      return;
    }

    if (!deployer.retriveHasErrors() && !this.flags.saveResult) {
      let deleteLogs = await Utils.inquirer.confirm("Delete logs?", { defaultValue: true });
      if (deleteLogs) {
        logger.info("Deleted logs");
        deployer.deleteLog();
      }
    }
  }

  private doInit() {
    const { args, flags } = this.parse(Retrieve);

    this.flags = flags;

    this.project = new Controller.Project({ path: process.cwd(), options: { loadConfig: true } });
  }

  private async getEnvironemnt() {
    let filename: string = this.flags.environment;

    if (filename && !filename.endsWith(".json")) filename = filename + ".json";

    if (filename && !Fs.existsSync(Path.join(this.project.path, ".envs", filename))) {
      Utils.string.warning("Not founded environment " + filename);
      filename = null;
    }

    if (!filename && this.flags.force) Utils.string.errorMessage("Missing --environment");
    else if (!filename) {
      filename = await Utils.inquirer.pickEnvironment(process.cwd());
    }

    if (!filename) Utils.string.errorMessage("No environment founded");
    else if (filename == "return") this.cancelProcess();

    this.environment = Controller.Environment.loadEnvironment(this.project, filename);
  }

  private async getPackage() {
    let dirname: string = this.flags.package;

    if (dirname && !Fs.existsSync(Path.join(this.project.path, "packages", dirname))) {
      Utils.string.warning("Not founded package " + dirname);
      dirname = null;
    }

    if (!dirname && this.flags.force) Utils.string.errorMessage("Missing --package");
    else if (!dirname) {
      dirname = await Utils.inquirer.pickPackage(process.cwd());
    }

    if (!dirname) Utils.string.errorMessage("No package founded");
    else if (dirname == "return") this.cancelProcess();

    this.package = Controller.Package.getPackage(Path.join(this.project.path, "packages", dirname));
  }

  private cancelProcess() {
    Utils.string.errorMessage("Operation canceled");
  }
}

//..\..\runSPM.bat package:retrieve -e=testEnvironment -p="XPTO-1234" --saveResult
//..\..\runSPM.bat package:retrieve -p="XPTO-1234" --saveResult
//..\..\runSPM.bat package:retrieve -e=testEnvironment

//..\..\runSPM.bat package:retrieve -e=testEnvironment -p="XPTO-1234a"
