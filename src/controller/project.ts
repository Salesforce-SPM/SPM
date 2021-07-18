// import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as Utils from '../utils';
import * as Interface from '../interface'
import * as Path from 'path';
import * as chalk from 'chalk';

//@ts-ignore
import * as defaultProjectConfig from '../templates/default/projectConfig.json';
import { isAbsolute } from 'path';

const defaultArg: Interface.Project.ClassArgs = {
    path: '',
    config: defaultProjectConfig,
    loadConfig: false
}



export class Project {
    readonly defaultDirs: string[] = ['', '.envs', 'packages', 'logs', 'closedPackage', 'source'];
    private _path: string;
    public config: Interface.Project.ConfigFile;

    private dirName: string;

    constructor(args: Interface.Project.ClassArgs = null) {
        if (!args) args = defaultArg;
        else args = { ...defaultArg, ...args };

        this.path = args.path;

        if (args.loadConfig) {
            //TODO auto load config
        } else {
            this.config = args.config ?? defaultProjectConfig;
            if (args.name) this.name = args.name;
        }


    }

    get name() { return this.config.name }
    set name(name: string) { this.config.name = name.trim(); }

    get path() { return this._path }
    set path(path: string) { this._path = path.trim(); }

    public isValid(preventException: Boolean = false): Boolean {
        let message = ''

        console.log('this.config.name', this.config.name);


        if ((!this.config.name || this.config.name == '')) message = chalk.bold.red("Missing or invalid project name");
        else if (this._path == '') message = chalk.bold.red("Invalid project path");
        else if (!Path.isAbsolute(this._path)) message = chalk.bold.red(`"${this._path}" isn't a valid path!`);

        if (preventException) console.log(message);
        else if (message != '') throw new Error(message);

        return message == '';
    }

    public create(args: Interface.Project.CM_Create = {}): Boolean {
        //Set default values
        if (!this.isValid()) {
            // TODO log erro
            return;
        }

        // * Path
        let saveAt: string = null;
        if (args.path && args.path != '') {
            if (Path.isAbsolute(args.path)) Utils.string.errorMessage(`"${args.path}" isn't a absolute path.
            `)
            if (!fs.existsSync(args.path)) Utils.string.errorMessage(`Path at "${args.path}" not founded`)
            // TODO pasta recebedora existe 
            // TODO pasta a ser criada não existe 

            // todo pipocar erro
            saveAt = `${args.path.trim()}\\${Utils.string.camelCase(this.name)}`;
        }
        else if (this.path && this.path != '') {
            // this._creatAt = this._path.split('\\');
            // this._creatAt.pop();
            // this._creatAt = this._creatAt.join('\\');

        }

        // TODO Path: informado
        // TODO Path: projeto com pop
        // if(!Path.isAbsolute(saveAt)) Utils.string.errorMessage("Path isn't a absolut path!");



        // TODO Default: force
        // TODO Default: confirm




        //TODO Salva na pasta
        //TODO Cria pastas
        //TODO Abre pasta
        //TODO Cria config

        //     this.defaultDirs.forEach(dir => { fs.mkdirSync(`${this.path}\\${dir}`) });

        //     fs.writeFileSync(this.path + '\\config.json', JSON.stringify(this.config, null, 4));

        //     childProcess.exec(`start "" "${this.path}"`);


        //saveConfig
        return true;

    }

    //TODO
    public configFileExist() {
        return fs.existsSync(`${this._path}\\config.json`);
    }

    //TODO
    public loadConfig() {
        let confFilePath = `${this._path}\\config.json`;

        try {
            this.config = JSON.parse(fs.readFileSync(confFilePath, {}).toString());
        } catch (error) {
            throw new Error(`Not founded ${confFilePath}`);
        }
    }

    //TODO
    public saveConfig(path: string, force: Boolean = false): Boolean {
        return true;
    }
}
