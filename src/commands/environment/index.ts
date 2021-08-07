import * as ChildProcess from 'child_process'
import * as Fs from 'fs';

import { Command, flags } from '@oclif/command';
import * as inquirer from 'inquirer';

import * as Utils from '../../utils'
import * as controller from '../../controller'

export default class Environment extends Command {
  static description = 'some desc';

  static hidden = true;

  static flags = { help: flags.help({ char: 'h', description: '' }) }

  async run() { const { args, flags } = this.parse(Environment); }
}

// TODO delete
// TODO update
// TODO export
