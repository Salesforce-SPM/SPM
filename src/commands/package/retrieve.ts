// Generated with gulp, task: newCommand
import { Command, flags } from '@oclif/command'
import * as Fs from 'fs';
import * as Utils from '../../utils'
import * as Controller from '../../controller'

const commandDescription = Utils.oclif.commandDescription(
    'retrieve',
    [ 'Some desc' ]
  );
  
  const commandExamples = Utils.oclif.commandExample(
    { command: 'retrieve', },
    [
      'Some example' 
    ]
  );

export default class Retrieve extends Command {
    static description = commandDescription;

    static examples = commandExamples;

    static flags = {
        help: flags.help({ char: 'h' })
    };

    // static args = []

    async run() {
        const { args, flags } = this.parse(Retrieve)


    }
}