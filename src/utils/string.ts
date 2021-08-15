export * as color from "./chalk";
import * as chalk from "chalk";
import * as Interface from "../interface";
import * as color from "./chalk";

//@ts-ignore
import xml2js = require("xml2js");

let XMLParser = xml2js.parseString;

let XMLBuilder = new xml2js.Builder();
delete XMLBuilder.options.xmldec.standalone;

interface sanitizeStringOptions {
  preserveCaps?: Boolean;
  separator?: string;
}

export function printPretty(list: string[][], separator = true) {
  let message = "";

  for (const item of list)
    message += `${chalk.green("* ")}${chalk.bold(`${item[0]}${separator ? ": " : ""}`)}${item[1]}\n`;

  console.log(message.substring(0, message.length - 1));
}

export function errorMessage(text: string, preventError: Boolean = false) {
  text = color.red(text, false);

  if (preventError) console.log(text);
  else throw new Error(text);
}

export function sanitizeString(str: String, options: sanitizeStringOptions = {}) {
  let { preserveCaps, separator } = options;

  preserveCaps = preserveCaps ?? false;
  separator = separator ?? "-";

  if (!options.preserveCaps) str = str.toLowerCase();

  var r = str
    .trim()
    .replace(/\s+/g, " ")
    .replace(new RegExp(/\s/g), separator)
    .replace(new RegExp(/[àáâãäå]/g), "a")
    .replace(new RegExp(/æ/g), "ae")
    .replace(new RegExp(/ç/g), "c")
    .replace(new RegExp(/[èéêë]/g), "e")
    .replace(new RegExp(/[ìíîï]/g), "i")
    .replace(new RegExp(/ñ/g), "n")
    .replace(new RegExp(/[òóôõö]/g), "o")
    .replace(new RegExp(/œ/g), "oe")
    .replace(new RegExp(/[ùúûü]/g), "u")
    .replace(new RegExp(/[ýÿ]/g), "y")
    .replace(new RegExp(/\W/g), separator);

  while (r.includes("--")) r = r.replace(separator + separator, separator);

  if (r.startsWith(separator)) r = r.slice(1, r.length);
  if (r.endsWith(separator)) r = r.slice(0, r.length - 1);

  return r;
}

export function camelCase(str: string): string {
  str = str ?? "";
  str = sanitizeString(str)
    .replace(/\-/g, " ")
    .replace(/\-/g, " ")
    .replace(/\s[a-z]/g, (s) => s.toUpperCase())
    .replace(/\s+/g, "")
    .replace(/^[A-Z]/g, (s) => s.toLowerCase());
  return str;
}

export function warning(str: string): string {
  return color.yellow("! " + str + " ");
}

export function hideString(text: string) {
  if (!text) text = "";

  var response = "";

  for (const c of text) response += "*";

  return response;
}

export function parseXML2JSON(str: string) {
  let response: Interface.Package.PackageXML;

  XMLParser(str, (err: any, result: any) => {
    response = result;
  });

  return response;
}

export function parseJSON2XML(pkg: Interface.Package.PackageXML) {
  let xmlFile = XMLBuilder.buildObject(pkg)
    .replace("</version>", "</version>\n")
    .replace(/\<\/types\>/, "</types>\n");

  xmlFile += `\n\n\n<!-- https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_types_list.htm -->`;

  return xmlFile;
}

export function printTree(input: any, level: number = 0) {
  let l = chalk.green.bold(" |");

  let root = l;
  for (let i = 0; i < level; i++) root += " " + l;
  root += chalk.green.bold("-");

  for (const key in input) {
    if (typeof input[key] != "object") {
      console.log(`${root} ${chalk.bold(key)}: ` + input[key]);
    } else {
      console.log(`${root} ${chalk.bold(key)}`);
      printTree(input[key], level + 1);
    }
  }
}
