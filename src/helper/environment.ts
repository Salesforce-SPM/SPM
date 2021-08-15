import * as Fs from "fs";
import * as Controller from "../controller";
import * as Utils from "../utils";
/*
export async function getEnvList() {
  let files: any = [];

  for (const file of Fs.readdirSync("./.envs", { withFileTypes: true })) {
    if (!file.isFile() || !file.name.endsWith(".json")) continue;

    let envname = "";

    try {
      envname = JSON.parse(Fs.readFileSync("./.envs/" + file.name, { encoding: "utf-8" }).toString()).name;
    } catch (error) {
      continue;
    }

    if (envname == "") continue;

    files.push({ name: `${envname} (${file.name})`, value: file.name });
  }

  return files;
}

export function loadEnvFile(fileName: string) {
  if (!fileName.endsWith(".json")) fileName += ".json";

  let filePath = `${process.cwd()}//.envs//${fileName}`;

  if (!Fs.existsSync(filePath)) Utils.string.errorMessage(filePath + " not founded.");

  return Controller.Environment.loadFile(filePath);
}
*/