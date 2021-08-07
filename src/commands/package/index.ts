import { Command, flags } from '@oclif/command';
import * as Utils from '../../utils'

export default class Project extends Command {
  static description = 'Packages commands, see "spm package -h"'
  static hidden = true;


  static flags = {
    help: flags.help({ char: 'h', description: '' }),
  }



  async run() {
    const { args, flags } = this.parse(Project);
    Utils.string.errorMessage("See spm project -h")


  }
}