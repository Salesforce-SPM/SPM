import { Command, flags } from '@oclif/command';

import * as Controller from '../controller/'
import { default as MenuController } from '../controller/menu'
import { Project } from '../interface';

import * as Utils from '../utils/'
import * as Menu from '../menu/'


// `"Some Name"`,
// `"Some Name" c:\\someName`,
// `"Some Name" c:\\someOtherName`,
// `"Some Name" c:\\someOtherName -f`,

export default class StartMenu extends Command {
  static description = Utils.oclif.commandDescription(
    'start',
    [
      'Will SPM menu context, you must AWAYS call it at project root',
      "It doesn't has any argument or options"
    ]
  );

  static examples = Utils.oclif.commandExample({ command: 'start', }, []);

  static flags = {
    help: flags.help({ char: 'h', description: 'Show command options' }),
  }


  async run() {
    const { args, flags } = this.parse(StartMenu);


    Menu.mainMenu.start()

    // const menu = new MenuController()

    // menu.menuText = menu.project.name;

    // TODO criar projeto
    // TODO checar config.json
    // TODO carregar config.json

    // carregar info do menu

  }
}


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



// run ==================== 

// // var choice: Function | string = '1.ENVS';

// const mainMenu = Menu.main;

// mainMenu.start();
// // // choice = await environmentsMenu.displayOptions();
// // const mainMenu: controller.TaskMenu = MainMenu();

// //todo montar menu utils



// do {




// } while (choice != 'exit');