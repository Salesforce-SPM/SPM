import * as Fs from "fs";
import * as Utils from "../utils";
import * as Interface from "../interface";
import * as Path from "path";
import * as chalk from "chalk";
//@ts-ignore
// import * as defaultProjectConfig from "../templates/projectConfig.json";
import { isAbsolute } from "path";

import spmConfig = require("../config.json");

const defaultDirs: string[] = [
  "",
  ".envs",
  "packages",
  "logs", // TODO
  "closedPackage", // TODO
  "source", // TODO
  "templates", // TODO ?
  "scripts",
];
const endWith: string[] = ["\\", "//", "/"];
const defaultExample = {
  ApexClass: "SomeClassname",
  CustomField: ["Account.name", "SomeCustomObject__c.SomeCustomField__c"],
};

abstract class ProjectConfig {
  constructor() {}

  public config: Interface.Project.File;

  protected _path: string;
  protected configFile: string;

  get name() {
    this.checkConfig();
    return this.config.name;
  }

  /**
   * @param {string} [name='string']
   * @memberof ProjectConfig
   */
  set name(name: string) {
    this.checkConfig();

    if (name && name != "") {
      this.config.name = name.trim();
    }
  }

  get path() {
    this.checkConfig();

    return this._path;
  }

  /**
   * @param {string | undefined} [path='string | undefined']
   * @memberof ProjectConfig
   */
  set path(path: string | undefined) {
    this.checkConfig();

    if (!path || path == "") Utils.string.errorMessage(`"${path}" isn't a valid path!`);

    this._path = path.trim();

    let foundedEndWith = false;

    for (const i of endWith) {
      if (this._path.endsWith(i)) {
        foundedEndWith = true;
        break;
      }
    }

    while (this._path.includes("/")) this._path = this._path.replace("/", "\\");
    while (this._path.includes("\\\\")) this._path = this._path.replace("\\\\", "\\");

    this.configFile = this._path + (foundedEndWith ? "config.json" : "\\config.json");
  }

  get apiVersion() {
    this.checkConfig();

    return this.config.apiVersion;
  }

  set apiVersion(apiVersion: string) {
    this.checkConfig();

    this.config.apiVersion = apiVersion;
  }

  private checkConfig() {
    if (this.config == null) {
      this.config = {
        name: null,
        defaultUrl: "https://test.salesforce.com",
        apiVersion: spmConfig.salesforceApi,
      };
    }
  }
}

export class Project extends ProjectConfig {
  constructor(args?: { path?: string; options?: Interface.Project.ProjectOptions }) {
    if (!args) args = { options: {} };

    args.options = args.options ?? {};

    super();

    if (args.path) {
      this._path = args.path;
      this.configFile = this._path + "\\config.json";
    }

    if (args.options.loadConfig) this.loadConfig();
  }

  public isValid(preventException: Boolean = false): Boolean {
    let message = "";

    if (!this.config.name || this.config.name == "") message = chalk.bold.red("Missing or invalid project name");
    else if (this._path == "") message = chalk.bold.red("Invalid project path");
    else if (!Path.isAbsolute(this._path)) message = chalk.bold.red(`"${this._path}" isn't a valid path!`);

    if (preventException && message != "") console.log(message);
    else if (message != "") throw new Error(message);

    return message == "";
  }

  /**
   * @param {Interface.Project.CreationArguments} [args={}]
   * @return {*}  {Boolean}
   * @memberof Project
   */
  public create(args: Interface.Project.CreationArguments = {}): Boolean {
    this.isValid();
    args.verbose = args.verbose ?? true;

    let saveAt: string = args.path ?? this.path;

    if (!saveAt) {
      Utils.string.errorMessage("Project must have a destination path: Ex: C:\\testProject");
    }

    saveAt = saveAt.replace("\\", "//");

    if (!args.force && Fs.existsSync(saveAt)) {
      Utils.string.errorMessage(`Dir at ${saveAt} already exist!`);
    }

    console.log(chalk.bold("Created: "));

    for (const dir of defaultDirs) {
      let dirPath = Path.join(saveAt, dir);

      if (!Fs.existsSync(dirPath)) {
        Fs.mkdirSync(dirPath);
        if (args.verbose) Utils.string.printPretty([["", dirPath.split("\\").join("/")]], false);
      }
    }

    this.saveConfig({ force: args.force });

    //defaultExample
    Fs.writeFileSync(Path.join(saveAt, 'templates', 'packageExamples.json'), JSON.stringify(defaultExample, null, 4));

    return true;
  }

  public saveConfig(options: Interface.Project.SaveConfigArguments = {}): Boolean {
    options.path = options.path ?? this.configFile;
    options.force = options.force ?? false;

    let { path, force } = options;

    if (!Path.isAbsolute(path) || !path.endsWith(".json")) Utils.string.errorMessage(`"${path}" isn't a valid path!`);
    else if (!force && this.configFileExist()) Utils.string.errorMessage(`"${path}" already exist`);

    Fs.writeFileSync(path, JSON.stringify(this.config, null, 4));

    return true;
  }

  public configFileExist(): Boolean {
    return Fs.existsSync(this.configFile);
  }

  public loadConfig(): Interface.Project.File {
    if (!this.configFileExist()) Utils.string.errorMessage(`Missing file "${this.configFile}".`);

    try {
      this.config = JSON.parse(Fs.readFileSync(this.configFile, {}).toString());
    } catch (error) {
      Utils.string.errorMessage(`Fail on reading file at "${this.configFile}".`);
    }

    return this.config;
  }

  public getTemplate(fileName: string) {
    let rawFile = Fs.readFileSync(`${this.path}\\templates\\${fileName}`).toString();

    if (fileName.endsWith(".json")) return JSON.parse(rawFile);

    return rawFile;
  }

  static get(path: string) {
    const project = new Project({ path, options: { loadConfig: true } });
  }

  // TODO Save project on informed folder as a new project
  // public saveAt(){}
}
