
export interface EnvironmentFile {
    name: string,
    url: string,
    user: string,
    password: string,
    token: string,
}


export interface EnvironmentArgs {
    fileName: string,
    projectPath: string,
}


export interface EnvListItem {
    name?: string,
    value?: string
}