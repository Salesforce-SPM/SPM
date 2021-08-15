import * as Utils from "../utils";
import * as Fs from "fs";

interface PackageArgs {
  name: string;
}

export class Package {
  // readonly path: string;
  // constructor(args: PackageArgs) {
  //   this.path = process.cwd() + "//packages//" + args.name;

  //   if (!Fs.existsSync(this.path)) Utils.string.errorMessage("Package " + args.name + " not founded.");
  //   if (!Fs.existsSync(this.path + "//package.xml")) Utils.string.errorMessage("Missing package.xml at " + args.name);
  // }
}
