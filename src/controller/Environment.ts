import * as Fs from "fs";
import * as SalesforceAPI from "salesforce-api-connector";
import * as Utils from "../utils";

export class Environment extends SalesforceAPI.Environment {
  private _filename: string;

  constructor(args: SalesforceAPI.Interface.Environment.EnvironmentArgs = {}) {
    super(args);
    this.name = args.data.name;
  }

  public set name(name: string) {
    super.name = name;
    this._filename = Utils.string.camelCase(name) + ".json";
  }

  public get name() {
    return super.name;
  }

  public get filename() {
    return this._filename;
  }

  public toJSON() {
    return {
      name: this.name,
      url: this.url,
      user: this.user,
      password: this.password,
      secretToken: this.secretToken,
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    };
  }

  static loadFile(filePath: string): Environment {
    const file: any = JSON.parse(Fs.readFileSync(filePath).toString());

    return new Environment({
      data: {
        name: file.name,
        url: file.url,
        user: file.user,
        password: file.password,
        secretToken: file.secretToken,
        clientId: file.clientId,
        clientSecret: file.clientSecret,
      },
    });
  }

  public save() {
    let filePath = `${process.cwd()}\\.envs\\${this.filename}`,
      fileContent = JSON.stringify(this.toJSON(), null, 4);

    return Fs.writeFileSync(filePath, fileContent);
  }

  // public  getAccessToken = super.getAccessToken
}
