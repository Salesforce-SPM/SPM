salesforce-package-manager-cli
==============================

<!-- [![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/salesforce-package-manager-cli.svg)](https://npmjs.org/package/salesforce-package-manager-cli)
[![Downloads/week](https://img.shields.io/npm/dw/salesforce-package-manager-cli.svg)](https://npmjs.org/package/salesforce-package-manager-cli)
[![License](https://img.shields.io/npm/l/salesforce-package-manager-cli.svg)](https://github.com/salesforce-package-manager/salesforce-package-manager-cli/blob/master/package.json) -->

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g salesforce-package-manager-cli
$ spm COMMAND
running command...
$ spm (-v|--version|version)
salesforce-package-manager-cli/0.0.0 win32-x64 node-v14.15.1
$ spm --help [COMMAND]
USAGE
  $ spm COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`spm hello [FILE]`](#spm-hello-file)
* [`spm help [COMMAND]`](#spm-help-command)

## `spm hello [FILE]`

describe the command here

```
USAGE
  $ spm hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ spm hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/salesforce-package-manager/salesforce-package-manager-cli/blob/v0.0.0/src/commands/hello.ts)_

## `spm help [COMMAND]`

display help for spm

```
USAGE
  $ spm help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->
