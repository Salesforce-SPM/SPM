import * as Fs from "fs";
import { Command, flags } from "@oclif/command";
import * as Utils from "../../utils";
import * as Controller from "../../controller";
import chalk = require("chalk");
import * as Interface from "../../interface";

import spmConfig = require("../../config.json");

const defaultApiVersion = spmConfig.salesforceApi;

export default class Project extends Command {
  static description = "Create a new package";

  // static examples = 'commandExamples' // TODO

  static flags = {
    help: flags.help({ char: "h", description: "Help" }), // TODO better desc
    name: flags.string({ char: "n", description: "New package name" }),
    force: flags.boolean({
      char: "f",
      description: "Won't confirm package creation. And ignorer errors when usint --template. Depends on --name",
      dependsOn: ["name"],
    }),
    // TODO creat destructive routine
    // hasDestructive: flags.boolean({char: "d", default: false, description: "If informed, will create a destructive xml file on package dir." }),
    template: flags.string({ char: "t", multiple: true }),
    version: flags.string({ char: "v", description: `Set package API version, default is ${defaultApiVersion}` }),
  };

  private project: Controller.Project;
  private args: any;
  private flags: any;
  private package: Controller.Package;
  private searchTemplate: boolean = false;
  private projectTemplates: any = {};

  private doInit() {
    const { args, flags } = this.parse(Project);

    this.project = new Controller.Project({ path: process.cwd(), options: { loadConfig: true } });

    this.args = Utils.validation.sanitizeJson(args);
    this.flags = Utils.validation.sanitizeJson(flags);

    let templates = new Set<string>(this.flags.template ?? []);
    if (templates.size > 0) {
      this.projectTemplates = this.project.getTemplate("packageExamples.json");

      templates.forEach((tp) => {
        if (tp == "y") {
          this.searchTemplate = true;
          templates.delete("y");
        } else if (this.projectTemplates[tp] == null) {
          this.searchTemplate = true;
          templates.delete(tp);
          this.warn(`Package template "${tp}" not founded`);
        }
      });
    }

    this.package = new Controller.Package({
      dirname: Utils.string.sanitizeString(this.flags.name, { preserveCaps: true }),
      options: { project: this.project, version: this.flags.version },
    });

    this.flags.templates = templates;
  }

  async run() {
    this.doInit();

    for (let tp of this.flags.templates.entries()) this.package.insertExample(tp[0]);

    await this.getName();

    // TODO checa duplicado
    if (Fs.existsSync(`${this.package.path}`) && !this.flags.force) {
      this.warn(`Package ${this.package.name} already exists!`);

      let confirmOverwrite = await Utils.inquirer.confirm(`Overwrite "${this.package.path}\\package.xml"?`);

      if (!confirmOverwrite) return Utils.string.color.red("Operation canceled");
    }

    if (this.searchTemplate || true) await this.getExampleOptions();

    this.package.save({ overwrite: true });
    this.log(`Package ${this.package.name} created at ./packages/${this.package.name}`);
  }

  private async getName() {
    this.package.name = this.flags.name;

    if (!this.package.name) {
      let message = "Project name";
      this.project.name = await Utils.inquirer.input({ message, error: "Package must have a name" });
    }
  }

  private async getExampleOptions() {
    if (this.flags.force) return this.warn("Can't use example templeta when --force was informed");

    let choices: Array<string | { name: string; value: string }> = [];

    for (let i in this.projectTemplates) {
      if (this.projectTemplates[i].label) choices.push({ name: this.projectTemplates[i].label, value: i });
      else choices.push(i);
    }

    let message = `Select exemples to insert on ${this.package.name}`;
    let picked: Array<string> = <Array<string>>await Utils.inquirer.check({ message, choices, searchable: true });

    for (let tp of picked) this.package.insertExample(tp);
  }
}

/*private getProject() {
    if (!this.project) this.project = new Controller.Project(process.cwd(), { loadConfig: true });

    return this.project;
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

 

  private async pickExamples(pkgName: string, flags: any) {
    let types: Array<{ name: string; members: string[] }> = [];

    if (!Fs.existsSync("./templates/packageExamples.json") || !flags.template) return types;

   
    let choices = this.getExampleOptions();

    

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
  }*/
