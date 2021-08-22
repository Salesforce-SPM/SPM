import * as JSForce from "jsforce";
import * as Controller from "../controller";
import * as Interface from "../interface";
import * as Utils from "../utils";
import { color } from "../utils/string";
import { logger } from "../private/class/logger";

export class EnvironmentConnection {
  private env: Controller.Environment;
  private conn: JSForce.Connection;

  constructor(env: Controller.Environment, options?: Interface.Environment.ConnOptions) {
    this.env = env;

    // if (!options) options = {};
  }

  async login(options: { verbose?: boolean } = {}): Promise<boolean> {
    let hasError = false;
    if (!this.env.url || !Utils.validation.isValidURL(this.env.url)) {
      hasError = true;
      this.logError("Environment doens't has a valid URL", false);
    } else if (!this.env.user || !Utils.validation.isValidEmail(this.env.user)) {
      hasError = true;
      this.logError("Environment doens't has a valid user", false);
    } else if (!this.env.password) {
      hasError = true;
      this.logError("Environment doens't has a password", false);
    } else if (!this.env.token) {
      hasError = true;
      this.logError("Environment doens't has a token", false);
    }

    if (hasError) this.logError("Invalid environment", true);

    if (!this.conn) {
      this.info(
        `Creating connection to ${this.env.url} as ${this.env.user} with api ${this.env.apiVersion}`,
        options.verbose
      );

      this.conn = new JSForce.Connection({ loginUrl: this.env.url, version: this.env.apiVersion });
    }

    try {
      this.info(`Requested a access token to ${this.env.url} as ${this.env.user}`, options.verbose);
      await this.conn.login(this.env.user, `${this.env.password}${this.env.token}`);
      return true;
    } catch (error) {
      this.logError(
        `Error on requesting a access token to ${this.env.name}(${this.env.url}) ${error.toString().replace("Error: ", "")}`,
        true
      );
      return false;
    }
  }

  async retrievePackage(options: any) {
    if (!(await this.login())) Utils.string.errorMessage("login failed");

    try {
      //@ts-ignore
      return await this.conn.metadata.retrieve(options).complete({ details: true });
    } catch (error) {
      console.log(error);
    }
  }

  private logError(text: string, exception = false) {
    if (logger) logger.error(text, { exception });
    else Utils.string.errorMessage(text);
  }

  private info(text: string, prompt = false) {
    if (logger) logger.info(text, prompt);
    else console.log(text);
  }
}
