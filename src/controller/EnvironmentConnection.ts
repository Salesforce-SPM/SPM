import * as JSForce from "jsforce";
import * as Controller from "../controller";
import * as Interface from "../interface";
import * as Utils from "../utils";
import { color } from "../utils/string";

export class EnvironmentConnection {
  private env: Controller.Environment;
  private conn: JSForce.Connection;
  constructor(env: Controller.Environment, options?: Interface.Environment.ConnOptions) {
    this.env = env;

    // if (!options) options = {};
  }

  async login(options: { verbose?: Boolean } = {}): Promise<boolean> {
    if (!this.env.url || !Utils.validation.isValidURL(this.env.url)) {
      Utils.string.errorMessage("Environment doens't has a valid URL");
    }

    if (!this.env.user || !Utils.validation.isValidEmail(this.env.user)) {
      Utils.string.errorMessage("Environment doens't has a valid user");
    } else if (!this.env.password) {
      Utils.string.errorMessage("Environment doens't has a password");
    } else if (!this.env.token) {
      Utils.string.errorMessage("Environment doens't has a token");
    } else if (!this.conn) {
      if (options.verbose) {
        console.log(`Creating connection to ${this.env.url} as ${this.env.user} with api ${this.env.apiVersion}`);
      }

      this.conn = new JSForce.Connection({ loginUrl: this.env.url, version: this.env.apiVersion });
    }

    try {
      if (options.verbose) {
        console.log(`Requested a accesstoken to ${this.env.url} as ${this.env.user}`);
      }
      await this.conn.login(this.env.user, `${this.env.password}${this.env.token}`);
      return true;
    } catch (error) {
      color.red(`Error on requesting the token to ${this.env.url} ${error.toString().replace("Error: ", "")}`);
      return false;
    }
  }
}
