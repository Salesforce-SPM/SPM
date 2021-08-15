import * as chalk from "chalk";

function template(text: string, print = true) {
  if (print) console.log(text);

  return text;
}

export function bold(text: string, print = true) {
  return template(chalk.bold(text), print);
}

export function red(text: string, print = true) {
  return template(chalk.red.bold(text), print);
}

export function yellow(text: string, print = true) {
  return template(chalk.bgYellow.blackBright.bold(` ${text} `), print);
}

export function green(text: string, print = true) {
  return template(chalk.green.bold(text), print);
}
