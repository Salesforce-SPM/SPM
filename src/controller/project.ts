import * as Fs from "fs";
import * as Utils from "../utils";
import * as Interface from "../interface";
import * as Path from "path";
import * as chalk from "chalk";
//@ts-ignore

import * as defaultProjectConfig from "../templates/projectConfig.json";
import { isAbsolute } from "path";

//@ts-ignore
import xml2js = require("xml2js");

const defaultArg: Interface.Project.ClassArgs = {
  config: defaultProjectConfig,
  loadConfig: false,
};

const defaultDirs: string[] = ["", ".envs", "packages", "logs", "closedPackage", "source", "templates"];

const jsonDefaultPackage = {
  Package: {
    $: { xmlns: "http://soap.sforce.com/2006/04/metadata" },
    version: "{{API_VERSION}}",
  },
};
var builder = new xml2js.Builder();
delete builder.options.xmldec.standalone;
var defaultPackage = builder.buildObject(jsonDefaultPackage);

export class Project {
  private _path: string;
  public config: Interface.Project.ConfigFile;
  private configFile: string;

  constructor(args: Interface.Project.ClassArgs = null) {
    // TODO set default api version

    if (!args) args = defaultArg;
    else args = { ...defaultArg, ...args };

    this.path = args.path ?? process.cwd();

    if (args.loadConfig) {
      this.loadConfig();
    } else {
      this.config = args.config ?? defaultProjectConfig;
      if (args.name) this.name = args.name;
    }
  }

  get name() {
    return this.config.name;
  }
  set name(name: string) {
    this.config.name = name.trim();
  }

  get path() {
    return this._path;
  }
  set path(path: string) {
    this._path = path.trim();
    this.configFile = this._path + "\\config.json";
  }

  get api() {
    return this.config.api;
  }
  set api(apiVersion: string) {
    this.config.api = apiVersion;
  }

  public isValid(preventException: Boolean = false): Boolean {
    let message = "";

    if (!this.config.name || this.config.name == "") message = chalk.bold.red("Missing or invalid project name");
    else if (this._path == "") message = chalk.bold.red("Invalid project path");
    else if (!Path.isAbsolute(this._path)) message = chalk.bold.red(`"${this._path}" isn't a valid path!`);

    if (preventException) console.log(message);
    else if (message != "") throw new Error(message);

    return message == "";
  }

  public create(args: Interface.Project.CM_Create = {}): Boolean {
    this.isValid();

    let saveAt: string = args.path ?? this.path;
    if (!saveAt) {
      Utils.string.errorMessage("Project must have a destination path: Ex: C:\\testProject");
    }

    if (Fs.existsSync(saveAt)) {
      Utils.string.errorMessage(`Dir at ${saveAt} already exist!`);
    }

    for (const dir of defaultDirs) Fs.mkdirSync(`${saveAt}\\${dir}`);

    this.saveConfig();

    return true;
  }

  public saveConfig(path: string = this.configFile, force: Boolean = false): Boolean {
    path = path ?? this.configFile;

    if (!Path.isAbsolute(path)) Utils.string.errorMessage(`"${path}" isn't a valid path!`);
    else if (!force && this.configFileExist()) Utils.string.errorMessage(`"${path}" already exist`);

    Fs.writeFileSync(path, JSON.stringify(this.config, null, 4));

    return true;
  }

  public configFileExist(): Boolean {
    return Fs.existsSync(this.configFile);
  }

  public loadConfig(): Interface.Project.ConfigFile {
    if (!this.configFileExist()) Utils.string.errorMessage(`Missing file "${this.configFile}".`);

    try {
      this.config = JSON.parse(Fs.readFileSync(this.configFile, {}).toString());
    } catch (error) {
      Utils.string.errorMessage(`Fail on reading file at "${this.configFile}".`);
    }

    return this.config;
  }

  // TODO Save project on informed folder as a new project
  // public saveAt(){}
}
