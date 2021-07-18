import { Command, flags } from '@oclif/command';
import * as Controller from '../controller'
// import * as Utils from '../utils'
// import * as Helper from '../helper'

// import * as Mocks from '../templates/mock'

export default class StartMenu extends Command {

  async run() {
    const project = new Controller.Project()


    project.name = 'testProjectd';
    project.path = process.cwd()

    // console.log(project);
    
    project.create({
      path: 'lala'
    });


    // console.log('project.isValid()', project.isValid()); 

    // var mock = Mocks.environment.valid();

    // Helper.Environment.saveEnvironment(mock);

    // const env = Helper.Environment.loadEnvironment(process.cwd(), 'testEnv.json');

  }
}
