import * as inquirer from 'inquirer';


import * as Utils from '../utils'


import { default as MenuController } from '../controller/menu'

class MainMenu extends MenuController {
    constructor() {
        super();

        this.menuText = this.project.name + ' options';

        this.actions = [
            // { name: "Project", value: 'projectMenu' },
            // { name: "Environments", value: 'envMenu' },
            // { name: "Packages", value: 'envMenu' },
            { name: 'Print project', value: () => this.displayEnvironment(this) },
            // TODO Log
            new inquirer.Separator(),
            { name: 'Finish', value: "return" }
        ]
    }



    displayEnvironment(env: MainMenu) {

        console.log('');

        Utils.string.printPretty([
            ['Name', env.project.name],
            ['Path', env.project.path],
            ['Default URL', env.project.config.defaultUrl]
            // TODO Env count
            // TODO active package count
        ])

        console.log('');
    }
}

export const mainMenu = new MainMenu();