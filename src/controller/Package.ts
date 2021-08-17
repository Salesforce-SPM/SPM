import * as Utils from "../utils";
import * as Fs from "fs";
import * as Controller from "../controller";
import spmConfig = require("../config.json");
//@ts-ignore
import xml2js = require("xml2js");
import { sanitizeString } from "../utils/string";

interface PackageArgs {
  dirname?: string;
  options?: {
    project?: Controller.Project;
    templates?: Array<string>; // TODO
    hasDestructive?: boolean;
    version?: string;
  };
}

interface xmlFile {
  Package: {
    $: { xmlns: "http://soap.sforce.com/2006/04/metadata" };
    fullName: string;
    types?: any;
    version: string;
  };
}
export class Package {
  private dirname: string;
  private project: Controller.Project;
  private hasDestructive: boolean;

  private xmlFile: xmlFile = {
    Package: {
      $: { xmlns: "http://soap.sforce.com/2006/04/metadata" },
      fullName: "",
      types: {},
      version: spmConfig.salesforceApi,
    },
  };

  constructor(args: PackageArgs = {}) {
    args.options = args.options ?? {};
    this.name = args.dirname;
    this.project = args.options.project;

    if (args.options.version) this.version = args.options.version;
    else if (this.project != null) this.version = this.project.apiVersion ?? spmConfig.salesforceApi;
  }

  get path() {
    return `${this.project.path}\\packages\\${this.dirname}`;
  }

  get version() {
    return this.xmlFile.Package.version;
  }

  set version(version: string) {
    this.xmlFile.Package.version = version;
  }

  get name() {
    return this.dirname;
  }

  set name(name: string) {
    this.dirname = sanitizeString(name, { preserveCaps: true });
    this.xmlFile.Package.fullName = this.dirname;
  }

  public addMetadata(metadataAPI: string, metadataitem: string | string[]) {
    if (!Array.isArray(metadataitem)) metadataitem = [metadataitem];
    if (!this.xmlFile.Package.types) this.xmlFile.Package.types = {};

    if (!this.xmlFile.Package.types[metadataAPI]) {
      this.xmlFile.Package.types[metadataAPI] = {
        name: metadataAPI,
        members: [],
      };
    }

    for (const i of metadataitem) {
      this.xmlFile.Package.types[metadataAPI].members.push(i);
    }
  }

  public insertExample(metadataAPI: string) {
    const pkgexample = require(`${this.project.path}\\templates\\packageExamples.json`);

    this.addMetadata(metadataAPI, pkgexample[metadataAPI]);
  }

  public toXML() {
    var xmlBuilder = new xml2js.Builder();

    let tempTypes = this.xmlFile.Package.types;

    this.xmlFile.Package.types = [];

    for (const metadataApi in tempTypes) this.xmlFile.Package.types.push(tempTypes[metadataApi]);

    let response = xmlBuilder
      .buildObject(this.xmlFile)
      .replace("  <types>", "\n  <types>")
      .replace("  </types>", "  </types>\n")
      .replace("  <version>", "\n  <version>")
      .replace("  </fullName>", "");

    this.xmlFile.Package.types = tempTypes;

    return response;
  }

  public save(options?: { path?: string; overwrite?: boolean }) {
    options = options ?? {};
    options.path = options.path ?? this.path;
    options.overwrite = options.overwrite ?? false;

    if (Fs.existsSync(options.path) && !options.overwrite) {
      Utils.string.errorMessage(`${options.path} already exist!`);
    } else if (!Fs.existsSync(options.path)) {
      Fs.mkdirSync(this.path);
    }

    let file = this.toXML();

    Fs.writeFileSync(this.path + "\\package.xml", file);

    // TODO create destructive file
  }
}
