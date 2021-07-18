import { Command, flags } from '@oclif/command';
import * as controller from '../controller/'
import * as inquirer from 'inquirer';
// import * as Interfaces from '../interfaces'
// import * as Utils from '../utils'

// import * as Menu from '../menu'

// // import * as CEnv from '../controller/environment'

// const MainMenu = () => {
//   const menu = new controller.TaskMenu('Main menu', process.cwd());
//   menu.checkPath();

//   menu.actions = [
//     { name: "1. Environments", value: '1.ENVS' }, // TODO ENV CRUD
//     { name: "2. Packages", value: '1.PKG' },         // TODO PKG CRUD
//     new inquirer.Separator(),
//     { name: "3. Finish", value: 'exit' },
//   ];

//   return menu;
// }


export default class StartMenu extends Command {
  static description = ''; //TODO

  static examples = [``]; // TODO

  static flags = {
    help: flags.help({ char: 'h' }), // flag with a value (-n, --name=VALUE)
  }


  async run() {
    // const { args, flags } = this.parse(StartMenu)

    // // var choice: Function | string = '1.ENVS';

    // const mainMenu = Menu.main;

    // mainMenu.start();
    // // // choice = await environmentsMenu.displayOptions();
    // // const mainMenu: controller.TaskMenu = MainMenu();

    // //todo montar menu utils



    // do {
   



    // } while (choice != 'exit');

  }
}
