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
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g spm
$ spm COMMAND
running command...
$ spm (-v|--version|version)
spm/0.0.0 win32-x64 node-v14.15.1
$ spm --help [COMMAND]
USAGE
  $ spm COMMAND
...
```
<!-- usagestop -->
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
* [`spm environment:new`](#spm-environmentnew)
* [`spm help [COMMAND]`](#spm-help-command)
* [`spm package:new`](#spm-packagenew)
* [`spm package:retrieve`](#spm-packageretrieve)
* [`spm project:menu`](#spm-projectmenu)
* [`spm project:new [NAME]`](#spm-projectnew-name)

## `spm environment:new`

Create a new environment

```
USAGE
  $ spm environment:new

OPTIONS
  -f, --force                Force command: if a file with the same name already exists, force will overwrite it without
                             confirm

  -h, --help                 show CLI help

  --name=name                Optional

  --password=password        Optional

  --secretToken=secretToken  Optional

  --url=url                  Optional

  --user=user                Optional

DESCRIPTION
  * Must be runned at project root

EXAMPLES
  $ spm environment
  $ spm environment -c
```

_See code: [src/commands/environment/new.ts](https://github.com/salesforce-package-manager/salesforce-package-manager-cli/blob/v0.0.0/src/commands/environment/new.ts)_

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

## `spm package:new`

Create a new package

```
USAGE
  $ spm package:new

OPTIONS
  -f, --force              Won't confirm package creation. And ignorer errors when usint --template. Depends on --name
  -h, --help               Help
  -n, --name=name          New package name
  -t, --template=template
  -v, --version=version    Set package API version, default is 52.0
```

_See code: [src/commands/package/new.ts](https://github.com/salesforce-package-manager/salesforce-package-manager-cli/blob/v0.0.0/src/commands/package/new.ts)_

## `spm package:retrieve`

retrieve

```
USAGE
  $ spm package:retrieve

OPTIONS
  -e, --environment=environment
  -f, --force
  -h, --help                     show CLI help
  -p, --package=package
  --noLog
  --saveResult

DESCRIPTION
  * Some desc

EXAMPLES
  $ spm retrieve
  $ spm retrieve Some example
```

_See code: [src/commands/package/retrieve.ts](https://github.com/salesforce-package-manager/salesforce-package-manager-cli/blob/v0.0.0/src/commands/package/retrieve.ts)_

## `spm project:menu`

menu

```
USAGE
  $ spm project:menu

OPTIONS
  -h, --help  show CLI help

DESCRIPTION
  * Some desc

EXAMPLES
  $ spm menu
  $ spm menu Some example
```

_See code: [src/commands/project/menu.ts](https://github.com/salesforce-package-manager/salesforce-package-manager-cli/blob/v0.0.0/src/commands/project/menu.ts)_

## `spm project:new [NAME]`

Start the wizard to create a new project.

```
USAGE
  $ spm project:new [NAME]

ARGUMENTS
  NAME  Optional, set project name, if not informed, terminal will ask for a project name. It's mandatory if passed
        --force

OPTIONS
  -d, --[no-]displayDir    [default=true] Open project on file explorer after create it.
  -f, --force              [default=false] Auto confirm project creation, if it's passed will auto confirm everything
  -h, --help               Show command options

  -p, --createAt=createAt  Optional, absolute path where the project will be created, will auto complete the path with
                           the project name (like C://myPath/projectName).
                           When using --force and it's a invalid path or --createAt wasn't informed, its value is the
                           current dir

DESCRIPTION
  * Will start the SPM wizard to create a new project.
  * The project name will be converted to camelCase to create the project dir

EXAMPLES
  $ spm project:new
  $ spm project:new someName
  $ spm project:new "Some Name"
  $ spm project:new "Some Name" -f
  $ spm project:new "Some Name" --no-displayDir -f
  $ spm project:new "Some Name" -p=C://some/path -f
```

_See code: [src/commands/project/new.ts](https://github.com/salesforce-package-manager/salesforce-package-manager-cli/blob/v0.0.0/src/commands/project/new.ts)_
<!-- commandsstop -->
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
