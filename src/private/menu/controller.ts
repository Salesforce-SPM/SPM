import * as Controllers from "../../controller";
import * as Interfaces from "../../interface";
import * as Utils from "../../utils";
import * as inquirer from "inquirer";
import chalk = require("chalk");

interface menuActions {
  name: string;
  value: Function | string;
}

export class MenuController {
  static readonly lineSeparator = "==============";
  readonly menuText: string;
  readonly isMenu: Boolean = true;
  protected finishProccess = false;

  public actions: Array<menuActions | inquirer.SeparatorOptions | Object> = [];

  constructor(menuText: string, options?: { actions?: Array<menuActions | inquirer.SeparatorOptions | Object> }) {
    this.menuText = menuText;

    if (!options) options = {};
    this.actions = options.actions ?? [];
  }

  public async inquire() {
    return (
      await inquirer.prompt({
        type: "list",
        choices: this.actions,
        name: "resp",
        message: this.menuText,
        pageSize: 15,
      })
    ).resp;
  }

  public static endLine = () => {
    let l = new inquirer.Separator();
    l.line = `${MenuController.lineSeparator}\n \n  ${MenuController.lineSeparator}`;

    return l;
  };

  public static separator = () => {
    let l = new inquirer.Separator();
    l.line = MenuController.lineSeparator;

    return l;
  };

  protected async start() {
    if (this.finishProccess) return "return";

    var choice: string | Function | MenuController = null;

    do {
      choice = await this.inquire();

      //@ts-ignore
      if (choice.isMenu) choice = await choice.start();
      //@ts-ignore
      else if (typeof choice == typeof Function) choice = await choice();
    } while (choice != "return");

    return "return";
  }

  static buildAction(
    display: string,
    value: Function | string,
    options?: { complement?: string; hideValue?: boolean }
  ): menuActions {
    if (!options) options = {};

    let name = options.complement != null ? chalk.bold(`${display}: `) : display;

    if (options.complement && options.complement != "") {
      if (options.hideValue) name += Utils.string.hideString(options.complement);
      else name += options.complement;
    }

    return { name, value };
  }
}
