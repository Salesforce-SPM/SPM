import * as Fs from "fs";
import * as Utils from "../utils";
import * as Interface from "../interface";
import * as Controller from "../controller";

abstract class EnvironmentConfig {
  constructor(args?: { project?: Controller.Project }) {
    if (!args) args = {};
    this.config = {
      name: null,
      url: null,
      user: null,
      password: null,
      token: null,
    };

    this.project = args.project;
  }

  private project: Controller.Project;
  public config: Interface.Environment.File;
  private _path: string;

  get path() {
    return this._path;
  }

  get name() {
    return this.config.name;
  }

  set name(name: string) {
    this.config.name = name;

    if (this.project && this.project.path) {
      let filename = Utils.string.camelCase(name) + ".json";

      this._path = `${this.project.path}\\.envs\\${filename}`;
    }
  }

  get user() {
    return this.config.user;
  }

  set user(user: string) {
    this.config.user = user;
  }

  get url() {
    return this.config.url;
  }
  set url(url: string) {
    this.config.url = url;
  }

  get password() {
    return this.config.password;
  }
  set password(password: string) {
    this.config.password = password;
  }

  get token() {
    return this.config.token;
  }
  set token(token: string) {
    this.config.token = token;
  }

  get apiVersion() {
    return this.project.apiVersion;
  }
}

export class Environment extends EnvironmentConfig {
  constructor(args?: {
    path?: string;
    options?: { loadFile?: Boolean; project?: Controller.Project; config?: Interface.Environment.File };
  }) {
    if (!args) args = {};
    if (!args.options) args.options = {};
    super({ project: args.options.project });

    if (args.options.config) {
      this.config = args.options.config;
      this.name = this.config.name;
    }

    this.conn = new Controller.EnvironmentConnection(this);
  }

  public conn: Controller.EnvironmentConnection;

  public fileExist() {
    if (!this.path) Utils.string.errorMessage("Environment doesn't has a path!");

    return Fs.existsSync(this.path);
  }

  public toJSON() {
    return {
      name: this.name,
      url: this.url,
      user: this.user,
      password: this.password,
      secretToken: this.token,
    };
  }

  public save(args?: { force?: Boolean }) {
    if (!args) args = {};

    if (!this.path) Utils.string.errorMessage("Environment doesn't has a path!");

    if (!args.force && this.fileExist()) Utils.string.errorMessage(this.path + " already exist");

    let fileContent = JSON.stringify(this.toJSON(), null, 4);

    return Fs.writeFileSync(this.path, fileContent);
  }

  public async buildConn(options?: Interface.Environment.ConnOptions) {
    this.conn = new Controller.EnvironmentConnection(this, options);

    return this.conn;
  }

  public isValid(options: { ignore?: { name?: boolean } } = {}): string | boolean {
    options.ignore = options.ignore ?? {};

    let errors = [];

    if (!options.ignore.name && (!this.name || this.name == "")) errors.push("name");
    if (!this.password || this.password == "") errors.push("password");
    if (!this.token || this.token == "") errors.push("token");
    if (!this.url || this.url == "" || !Utils.validation.isValidURL(this.url)) errors.push("url");
    if (!this.user || this.user == "" || !Utils.validation.isValidEmail(this.user)) errors.push("user");

    let resp = errors.join(", ");

    return resp == "" ? true : resp;
  }
}
