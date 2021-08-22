import * as Controller from ".";
import * as Utils from "../utils";
import * as Interface from "../interface";
import * as Path from "path";
import * as Fs from "fs";
import * as JSforce from "jsforce";
import * as decompress from "decompress";

import { logger } from "../private/class/logger";

//@ts-ignore
import xml2js = require("xml2js");
import { S_IFREG } from "constants";

export class RetrievePackage {
  public project: Controller.Project;
  public environment: Controller.Environment;
  public package: Controller.Package;
  protected path: string;

  private options: any = {};
  private xmlFile: any = {};

  private prepared = false;

  private log: string[] = [];
  private _result: Interface.CustomJSForce.RetrieveResult;
  protected hasError: boolean;

  constructor(args: Interface.CustomJSForce.RetrievePackageArgs) {
    this.environment = args.environment;
    this.package = args.package;
    this.project = args.project;

    let p = Path.join(this.project.path, "logs", this.package.name, `${Utils.string.getTimeStamp()}_retrieve.log`);
    logger.path = p;
  }

  get result(): Interface.CustomJSForce.RetrieveResult {
    return JSON.parse(JSON.stringify(this._result));
  }

  public prepareRetrieve() {
    this.path = Path.join(this.project.path, "packages", this.package.name);

    const rawFile = Fs.readFileSync(Path.join(this.path, "package.xml")).toString();

    xml2js.Parser().parseString(Fs.readFileSync(Path.join(this.path, "package.xml")).toString(), (err: any, r: any) => {
      if (err) Utils.string.errorMessage(err);
      else this.xmlFile = r;
    });

    let version = this.project.apiVersion;

    if (this.xmlFile.Package && this.xmlFile.Package.version && this.xmlFile.Package.version.length > 0) {
      version = this.xmlFile.Package.version[0];
    }

    this.options = {
      singlePackage: true,
      apiVersion: version,
      unpackaged: Utils.xml.buildUnpackaged(this.xmlFile.Package, version),
    };

    logger.info("Preparing retrieve:");
    logger.info(`Using environment: ${this.environment.name} at ${this.environment.path}`);
    logger.info("User: " + this.environment.user);
    logger.info("URL: " + this.environment.url);
    logger.info(`Using package: ${this.package.name} ${this.package.path}`);
    logger.info(`Retrieving metadata:`, true);

    for (const mtda of this.options.unpackaged.types) {
      logger.info(`- ${mtda.name}: ${mtda.members.join(", ")}`, true);
    }

    console.log("");
  }

  public async execute(saveResult = false) {
    let saveResultPath = logger.path.replace("_retrieve.log", "_retrieveResult.json");

    logger.info(`Executing retrieve`, false);
    logger.info(`Retrieve options: ${JSON.stringify(this.options)}`);

    try {
      this._result = await this.environment.conn.retrievePackage(this.options);

      logger.info(`Retrieve ${this._result ? "" : "didn't "}recieved a response`, false);

      if (!this._result) return logger.error("Retrieve failed", { exception: true });
    } catch (error) {
      error = `${error}`.replace("Error: ", "");

      return logger.error(error + ". Retrieve failed", { exception: true });
    }

    this.retriveHasErrors();

    if (this.hasError) {
      let msg = `Retrieve returned status: `;

      if (`${this._result.success.toLowerCase()}` == "true") {
        msg += this._result.success + `, but it got other erros.`;
      } else {
        msg += this._result.success + ".";
      }

      msg += `\nRetrive result will be saved at: ${saveResultPath}`;

      logger.error(msg, { exception: false });

      if (this._result.messages) {
        if (!Array.isArray(this._result.messages)) this._result.messages = [this._result.messages];

        for (const msg of this._result.messages)
          logger.error(`Error at: ${msg.fileName}: ${msg.problem}`, { exception: false, prompt: false });
      }
    } else {
      logger.addLog(`Retrived packages ${this.package.name} with success`, "INFO");
    }

    if (saveResult || this.hasError) {
      if (this.hasError) {
        this._result.zipFile = "";
        delete this._result.zipFile;
      }
      Fs.writeFileSync(saveResultPath, JSON.stringify(this._result, null, 2));

      if (this.hasError) logger.error("Retrieve failed", { exception: false, prompt: false });
    }
  }

  public async unzip() {
    let rawFile = Fs.readFileSync(Path.join(this.package.path, "package.xml")).toString();

    logger.info("Cleaning files at " + this.package.path, true);
    this.package.cleanFiles();

    await decompress(Buffer.from(this._result.zipFile, "base64"), this.package.path);

    Fs.writeFileSync(Path.join(this.package.path, "package.xml"), rawFile);

    this._result.zipFile = "";

    delete this._result.zipFile;
  }

  public deleteLog() {
    if (Fs.existsSync(logger.path)) Fs.unlinkSync(logger.path);

    let saveResultPath = logger.path.replace("_retrieve.log", "_retrieveResult.json");

    if (Fs.existsSync(saveResultPath)) Fs.unlinkSync(saveResultPath);
  }

  public retriveHasErrors() {
    this.hasError = false;

    let validations = [
      { validation: !this._result, error: "Retrieve result has no data" },
      { validation: this._result.errorMessage || this._result.errorStatusCode, error: "Retrieve has error messages" },
      { validation: this._result.messages != null, error: "Retrieve has errors" },
      { validation: this._result.status.toLowerCase() == "failed", error: "Retrieve status = failed" },
      { validation: this._result.success.toLowerCase() == "false", error: "Retrieve success = false" },
    ];

    for (const v of validations) {
      if (v.validation) {
        this.hasError = true;
        logger.error(v.error, { exception: false, prompt: false });

        return this.hasError;
      }
    }

    return this.hasError;
  }
}
