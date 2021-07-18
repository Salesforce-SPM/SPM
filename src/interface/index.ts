export * as Project from './project'

export interface EnvironmentFile {
    name: string,
    url: string,
    user: string,
    password: string,
    token: string,
}

export interface ActionsInterface {
    name: string,
    value: Function | string
}

export interface EnvironmentArgs {
    fileName: string,
    projectPath: string,
}
