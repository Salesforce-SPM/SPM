import * as fuzzy from "fuzzy";

import inquirer = require("inquirer");
import { isValidURL, isValidEmail } from "./validation";
import { errorMessage } from "./string";

inquirer.registerPrompt("search-list", require("inquirer-search-list"));
inquirer.registerPrompt("search-checkbox", require("inquirer-search-checkbox"));

export async function input(message: string, error: string, defaultValue: string = null) {
  let validate = (resp: string) => {
    if (!resp || resp === "") return error ? errorMessage(error) : false;
    return true;
  };

  return (
    await inquirer.prompt({
      type: "input",
      name: "resp",
      default: defaultValue,
      message,
      validate: validate,
    })
  ).resp;
}

export async function url(message: string, error: string, defaultValue: string = null) {
  let validate = (resp: string) => {
    if (!isValidURL(resp)) return error ? errorMessage(error) : false;

    return true;
  };

  let type = "input";
  let name = "resp";

  //@ts-ignore
  return (await inquirer.prompt({ type, name, default: defaultValue, message, validate })).resp;
}

export async function email(message: string, error: string) {
  let validate = (resp: string) => {
    if (!isValidEmail(resp)) return error ? errorMessage(error) : false;

    return true;
  };

  return (await inquirer.prompt({ type: "input", name: "resp", message, validate })).resp;
}

export async function confirm(message: string, defaultValue: Boolean = false, choices: any = null) {
  choices = choices ?? [
    { name: "Confirm", value: true },
    { name: "Cancel", value: false },
  ];

  let type = "list";
  let name = "resp";

  //@ts-ignore
  return (await inquirer.prompt({ type, name, default: defaultValue, message, choices })).resp;
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

interface checkArgs {
  searchable?: Boolean;
  message: string;
  choices: Array<string | { name: string; value: string }>;
  default?: string;
}
