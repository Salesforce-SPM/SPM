import * as fuzzy from "fuzzy";

import inquirer = require("inquirer");
import { isValidURL, isValidEmail } from "./validation";
import { errorMessage } from "./string";

import * as Fs from "fs";
import * as Path from "path";

inquirer.registerPrompt("search-list", require("inquirer-search-list"));
inquirer.registerPrompt("search-checkbox", require("inquirer-search-checkbox"));

interface inputOptions {
  message: string;
  error?: string;
  defaultValue?: string;
  validate?: Function;
}

interface confirmOptions {
  defaultValue?: Boolean;
  answers?: { yes?: string; no?: string };
}

interface checkArgs {
  searchable?: Boolean;
  message: string;
  choices: Array<string | { name: string; value: string }>;
  default?: string;
}

/**
 *
 *
 * @export
 * @param {inputOptions} args
 * @return {*}  {Promise<string>}
 */
export async function input(args: inputOptions): Promise<string> {
  let { message, error, defaultValue, validate: aditionalValidation } = args;

  let validate = (resp: string) => {
    if (error && (!resp || resp === "")) return errorMessage(error);

    if (aditionalValidation) {
      let aditionalValidationMessage = aditionalValidation(resp);

      if (aditionalValidationMessage) return errorMessage(aditionalValidationMessage);
    }
    return true;
  };

  return (
    await inquirer.prompt({
      //@ts-ignore
      type: "input",
      name: "resp",
      default: defaultValue,
      message,
      //@ts-ignore
      validate: validate,
    })
  ).resp;
}

export async function url(args: { message: string; error?: string; defaultValue?: string }): Promise<string> {
  let validate = (resp: string) => {
    if (!isValidURL(resp)) return args.error ? errorMessage(args.error) : false;

    return true;
  };

  let type = "input";
  let name = "resp";

  //@ts-ignore
  return (await inquirer.prompt({ type, name, default: args.defaultValue, message: args.message, validate })).resp;
}

export async function email(args: { message: string; error: string; defaultValue?: string }) {
  let validate = (resp: string) => {
    if (!isValidEmail(resp)) return args.error ? errorMessage(args.error) : false;

    return true;
  };

  return (
    await inquirer.prompt({
      //@ts-ignore
      type: "input",
      name: "resp",
      message: args.message,
      default: args.defaultValue,
      //@ts-ignore
      validate,
    })
  ).resp;
}

export async function confirm(message: string, options?: confirmOptions) {
  options = options ?? {};

  options.defaultValue = options.defaultValue ?? false;
  if (!options.answers) {
    options.answers = { yes: "Confirm", no: "Cancel" };
  } else {
    options.answers.yes = options.answers.yes ?? "Confirm";
    options.answers.no = options.answers.no ?? "Cancel";
  }

  let { defaultValue, answers } = options;

  let choices = [
    { name: answers.yes, value: true },
    { name: answers.no, value: false },
  ];

  let type = "list";
  let name = "resp";

  //@ts-ignore
  return <boolean>(await inquirer.prompt({ type, name, default: defaultValue, message, choices })).resp;
}

export async function list(message: string, choices: any, searchable = false, defaultResp: string = null) {
  let type = searchable ? "search-list" : "list";
  let name = "resp";

  //@ts-ignore
  return (await inquirer.prompt({ type, message, name, choices, default: defaultResp })).resp;
}

export async function check(args: checkArgs) {
  //message: string, choices: any, searchable = false, defaultResp: string[] = null
  let { searchable, message, choices } = args;

  let type = searchable ? "search-checkbox" : "checkbox";
  let name = "resp";

  //@ts-ignore
  return (await inquirer.prompt({ type, message, name, choices, default: args.default })).resp;
}

export async function password(args: inputOptions): Promise<string> {
  let { message, error, defaultValue, validate: aditionalValidation } = args;

  return (await inquirer.prompt({ type: "password", name: "resp", default: defaultValue, message })).resp;
}

export async function pickEnvironment(projectPath: string, message: string = "Select a environment"): Promise<string> {
  let choices = [];

  for (const env of Fs.readdirSync(Path.join(projectPath, ".envs"), { withFileTypes: true })) {
    if (env.isDirectory() || !env.name.endsWith(".json")) continue;

    let envFile = JSON.parse(Fs.readFileSync(Path.join(projectPath, ".envs", env.name)).toString());

    choices.push({ name: `${envFile.name} (${env.name})`, value: env.name });
  }

  if (choices.length == 0) return null;

  choices.push({ name: `Cancel`, value: "return" });

  return <string>await list(message, choices, true);
}

export async function pickPackage(projectPath: string, message: string = "Select a package"): Promise<string> {
  let choices = [];

  for (const pkg of Fs.readdirSync(Path.join(projectPath, "packages"), { withFileTypes: true })) {
    if (!pkg.isDirectory()) continue;

    choices.push(pkg.name);
  }

  if (choices.length == 0) return null;

  choices.push({ name: `Cancel`, value: "return" });

  return <string>await list(message, choices, true);
}
