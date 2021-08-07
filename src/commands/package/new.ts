import * as Fs from "fs";
import { Command, flags } from "@oclif/command";
import * as Utils from "../../utils";
import * as Controller from "../../controller";
import chalk = require("chalk");
import * as Interface from "../../interface";

const defaultApiVersion = "52.0";

export default class Project extends Command {
  static description = "Create a new package";

  // static examples = 'commandExamples' // TODO

  static flags = {
    help: flags.help({ char: "h", description: "" }),
    name: flags.string({ char: "n", description: "New package name" }),
    force: flags.boolean({
      char: "f",
      description: "Won't confirm package creation.",
    }),
    hasDestructive: flags.boolean({
      char: "d",
      default: false,
      description: "If informed, will create a destructive xml file on package dir.",
    }),
    template: flags.string({ char: "t" }),
    version: flags.string({
      char: "v",
      description: `Set package API version, default is ${defaultApiVersion}`,
    }),
  };

  private project: Controller.Project = null;
  private examples: any = null;

  private getProject() {
    if (!this.project) this.project = new Controller.Project({ loadConfig: true });

    return this.project;
  }

  async getName(name: string) {
    if (name == "") {
      name = null;
      console.log(Utils.string.warning("Informed a invalid package name."));
    }

    name = name ?? (await Utils.inquirer.input("Package name: ", "Inform a valid package name"));

    return Utils.string.sanitizeString(name, { preserveCaps: true });
  }

  async getVersion(version: string) {
    if (version == "" || !version) {
      version = this.getProject().api;
      console.log(Utils.string.warning(`API version not informed, using default API version: ${version}`));
    }

    version = Utils.string.sanitizeString(version, { separator: "." });

    if (version.split(".").length == 1) version += ".0";

    return version;
  }

  private getExample(api: string) {
    if (!this.examples) this.examples = JSON.parse(Fs.readFileSync("./templates/packageExamples.json").toString());

    let item = this.examples[api];

    if (!item) return null;

    if (!Array.isArray(this.examples[api].example)) this.examples[api].example = [this.examples[api].example];

    return {
      name: api,
      members: this.examples[api].example,
    };
  }

  private getExampleOptions() {
    if (!this.examples) this.examples = JSON.parse(Fs.readFileSync("./templates/packageExamples.json").toString());

    let choices: Array<string | { name: string; value: string }> = [];
    for (let i in this.examples) {
      if (this.examples[i].label) choices.push({ name: this.examples[i].label, value: i });
      else choices.push(i);
    }

    return choices;
  }

  private async pickExamples(pkgName: string, flags: any) {
    let types: Array<{ name: string; members: string[] }> = [];

    if (!Fs.existsSync("./templates/packageExamples.json") || !flags.template) return types;

    let message = `Select exemples to insert on ${pkgName}`;
    let choices = this.getExampleOptions();

    let picked: Set<string> = new Set(
      flags.template == "y"
        ? await Utils.inquirer.check({ message, choices, searchable: true })
        : flags.template.split(";")
    );

    for (const example of picked) {
      let e = this.getExample(example);

      if (!e) {
        console.log(Utils.string.warning(`Example ${example} missing at ./templates/packageExamplex.json`));
        continue;
      }

      types.push(e);
    }

    return types;
  }

  private async buildFile(flags: any) {
    let pkgFile = `<?xml version="1.0" encoding="UTF-8"?>
    <Package xmlns="http://soap.sforce.com/2006/04/metadata"></Package>`;

    let packageTemplate: any = Utils.string.parseXML2JSON(pkgFile);

    if (!packageTemplate.Package.types) packageTemplate.Package.types = [];
    else if (typeof packageTemplate.Package.types != typeof []) {
      packageTemplate.Package.types = [packageTemplate.Package.types];
    }

    packageTemplate.Package.types = await this.pickExamples(flags.name, flags);

    packageTemplate.Package.version = [flags.version];

    return Utils.string.parseJSON2XML(packageTemplate);
  }

  async run() {
    const { args, flags } = this.parse(Project);

    this.getProject();

    flags.name = await this.getName(flags.name);
    flags.version = await this.getVersion(flags.version);
    flags.hasDestructive = flags.hasDestructive ?? false;

    if (Fs.existsSync(`./packages/${flags.name}`) && !flags.force) {
      console.log(Utils.string.errorMessage(`Package ${flags.name} already exists!`));

      return;
    }

    let xmlFile = await this.buildFile(flags);

    if (!Fs.existsSync(`./packages/${flags.name}`)) Fs.mkdirSync(`./packages/${flags.name}`);
    Fs.writeFileSync(`./packages/${flags.name}/package.xml`, xmlFile);

    console.log(`Package ${flags.name} created at ./packages/${flags.name}`);
  }
}
