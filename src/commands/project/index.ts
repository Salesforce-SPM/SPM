import * as ChildProcess from 'child_process'
import * as Fs from 'fs';

import { Command, flags } from '@oclif/command';
import * as inquirer from 'inquirer';

import * as Utils from '../../utils'
import * as controller from '../../controller'

export default class Project extends Command {
  static description = 'commandDescription'
  static hidden = true;

  // static examples = 'commandExamples'

  static flags = {
    help: flags.help({ char: 'h', description: '' }),
  }



  async run() {
    const { args, flags } = this.parse(Project);
    Utils.string.errorMessage("See spm project -h")


  }
}