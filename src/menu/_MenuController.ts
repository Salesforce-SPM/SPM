import * as Controllers from "../controller";
import * as Interfaces from "../interface";
import * as Utils from "../Utils";
import * as inquirer from "inquirer";

interface ActionsInterface {
  name: string;
  value: Function | string;
}
export default class MenuClass {
  public project: Controllers.Project = null;
  public menuText: string;
  readonly isMenu: Boolean = true;
  public actions: Array<ActionsInterface | inquirer.SeparatorOptions | Object> = [];

  // constructor(menuText: string, projectPath: string = process.cwd()) {
  //     this.project = new Controllers.Project('', projectPath);

  //     if (!this.project.configFileExist()) Utils.string.errorMessage('Missing "config.json"');

  //     this.project.loadConfig();

  //     this.menuText = menuText;
  // }

  // public async inquire() {
  //     return (await inquirer.prompt({
  //         type: 'list',
  //         choices: this.actions,
  //         name: 'resp',
  //         message: this.menuText,
  //         pageSize: 15
  //     })).resp;
  // }

  // public static getTaksEndLine = () => {
  //     let endLine = new inquirer.Separator();
  //     endLine.line = '==============\n \n  =============='

  //     return endLine;
  // }

  // public beforeStart = async () => { };

  // public start = async () => {
  //     await this.beforeStart();

  //     var choice: string | Function | MenuClass = null;

  //     do {
  //         choice = await this.inquire();

  //         //@ts-ignore
  //         if (choice.isMenu) await choice.start();
  //         //@ts-ignore
  //         else if (typeof choice == typeof Function) await choice();

  //     } while (choice != 'return')
  // }
}
