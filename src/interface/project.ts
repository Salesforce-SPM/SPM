export interface File {
  name: string;
  defaultUrl: string;
  apiVersion?: string;
}

export interface ProjectOptions {
  name?: string;
  // config?: ConfigFile;
  // useDefaultOptions?: Boolean;
  loadConfig?: Boolean;
}

/**
 * @param {string}path  Absolute path where the project should be created. Optional
 * @param {Boolean}force , if true, will overwrite a existing project. Optional
 */
export interface CreationArguments {
  path?: string;
  force?: Boolean;
  verbose?: Boolean;
}

export interface SaveConfigArguments {
  path?: string;
  force?: Boolean;
}
