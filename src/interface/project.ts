

export interface ConfigFile {
    name: string,
    defaultUrl: string,
    api?: string
}

export interface ClassArgs {
    path?: string,
    name?: string,
    config?: ConfigFile
    loadConfig?: Boolean
}


// Class Methods
// Private
export interface CM_Create {
    path?: string,
}