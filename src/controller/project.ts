import * as fs from 'fs';
import * as Utils from '../utils';
import * as Interface from '../interface'
import * as Path from 'path';
import * as chalk from 'chalk';

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
    private configFile: string;

    /**
     * 
     * @param args Object, see ClassArgs at "src\interface\project.ts"
     * @param args.path Set the project root path, must be a absolute path ("C://myProject")
     * @param args.config Is optional and it sets the project config, you can use it to set the project config.file, see ConfigFile at "src\interface\project.ts"
     * @param args.loadConfig Optional flag, default is false, but if true, will auto load the config.json file ate project root.
     */
    constructor(args: Interface.Project.ClassArgs = null) {
        if (!args) args = defaultArg;
        else args = { ...defaultArg, ...args };

        this.path = args.path;

        if (args.loadConfig) {
            this.loadConfig();
        } else {
            this.config = args.config ?? defaultProjectConfig;
            if (args.name) this.name = args.name;
        }


    }

    get name() { return this.config.name }
    set name(name: string) { this.config.name = name.trim(); }

    get path() { return this._path }
    set path(path: string) {
        this._path = path.trim();
        this.configFile = this.path + '\\config.json';
    }

    /**
     * 
     * @param preventException Default value is false, if true, will log the error at console insted of throw a Exception
     * @returns true if succeed
     */
    public isValid(preventException: Boolean = false): Boolean {
        let message = ''

        if ((!this.config.name || this.config.name == '')) message = chalk.bold.red("Missing or invalid project name");
        else if (this._path == '') message = chalk.bold.red("Invalid project path");
        else if (!Path.isAbsolute(this._path)) message = chalk.bold.red(`"${this._path}" isn't a valid path!`);

        if (preventException) console.log(message);
        else if (message != '') throw new Error(message);

        return message == '';
    }

    /**
     * This method will create the project dir and it default files
     * 
     * @param args Object, see CM_Create at "src\interface\project.ts"
     * @param args.path if not informed, will use this.path value, must be a absolute path
     * @returns true if succeed
     */
    public create(args: Interface.Project.CM_Create = {}): Boolean {
        this.isValid();

        let saveAt: string = args.path ?? this.path;
        if (!saveAt) Utils.string.errorMessage("Project must have a destination path: Ex: C:\\testProject");

        if (fs.existsSync(saveAt)) Utils.string.errorMessage(`Dir at ${saveAt} already exist!`);

        for (const dir of this.defaultDirs) fs.mkdirSync(`${saveAt}\\${dir}`);

        this.saveConfig();

        return true;
    }

    /**
     * 
     * @param path Path to save the config.json file, must be absolute. If not informed the default value is this.configFile
     * @param force If true, will overwrite the config.json file at the informed path
     * @returns true if succeed
     */
    public saveConfig(path: string = this.configFile, force: Boolean = false): Boolean {
        path = path ?? this.configFile;

        if (!Path.isAbsolute(path)) Utils.string.errorMessage(`"${path}" isn't a valid path!`);
        else if (!force && this.configFileExist()) Utils.string.errorMessage(`"${path}" already exist`);

        fs.writeFileSync(path, JSON.stringify(this.config, null, 4))

        return true;
    }

    /**
     * 
     * @returns true if found config.json
     */
    public configFileExist(): Boolean {
        return fs.existsSync(this.configFile);
    }

    /**
     * Load the config options of the project, it uses the path at this.configFile, if fails, will thrown a exception.
     * @returns the config.json as Object, see ConfigFile at "src\interface\project.ts"
     */
    public loadConfig(): Interface.Project.ConfigFile {
        if (!this.configFileExist()) Utils.string.errorMessage(`Missing file at "${this.configFile}".`);

        try {
            this.config = JSON.parse(fs.readFileSync(this.configFile, {}).toString());
        } catch (error) {
            Utils.string.errorMessage(`Fail on reading file at "${this.configFile}".`);
        }

        return this.config
    }

    // TODO Save project on informed folder as a new project
    // public saveAt(){}
}
