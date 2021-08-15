import * as Controller from "../../controller";
import * as Utils from "../../utils";
import { MenuController } from "../menu/controller";
// import * as inquirer from "inquirer";
import * as Fs from "fs";

// import { environment as environmentInquirer } from "../inquirer";

interface menuActions {
  name: string;
  value: Function | string;
}

export class EnvironmentMenu extends MenuController {
  private failedConnectionsTrys = 1;
  private environment: Controller.Environment;
  private returnText: string;
  private deletable: Boolean;

  constructor(env: Controller.Environment, options: { text?: string; returnText?: string; deletable?: Boolean } = {}) {
    super(options.text ?? `Update ${env.name}`);

    this.environment = env;
    this.returnText = options.returnText ?? "Return";
    this.deletable = options.deletable ?? false;
  }

  public async start() {
    this.buildActions();
    return await super.start();
  }

  private async buildActions() {
    this.actions = [
      MenuController.buildAction("Name", async () => await this.updateName(), { complement: this.environment.name }),
      MenuController.buildAction("URL", async () => await this.updateURL(), { complement: this.environment.url }),
      MenuController.buildAction("User", async () => await this.updateUser(), { complement: this.environment.user }),
      MenuController.buildAction("Password", async () => await this.updatePassword(), {
        complement: Utils.string.hideString(this.environment.password),
      }),
      MenuController.buildAction("Token", async () => await this.updateToken(), { complement: this.environment.token }),
    ];

    if (this.environment.isValid({ ignore: { name: true } }) == true) {
      this.actions.push(EnvironmentMenu.separator());
      this.actions.push(
        MenuController.buildAction("Test environment", async () => {
          if (await this.environment.conn.login({ verbose: true })) {
            Utils.string.color.green("Success");
          } else {
            Utils.string.color.red("Fail");
          }
        })
      );
    }

    if (this.deletable) {
      this.actions.push(EnvironmentMenu.separator());

      this.actions.push(
        MenuController.buildAction(Utils.string.color.red("Delete environment", false), async () => {
          return await this.deleteEnvironemnt();
        })
      );
    }

    this.actions.push(EnvironmentMenu.separator());
    this.actions.push({ name: this.returnText, value: "return" });
  }

  private async updateName() {
    this.environment.name = await Utils.inquirer.input({
      message: "Inform environment name",
      error: "Must inform a valid environment name",
      defaultValue: this.environment.name,
    });

    this.buildActions();
  }

  private async updateURL() {
    this.environment.url = await Utils.inquirer.url({
      message: "Inform the environment URL",
      error: "Must inform a valid URL",
      defaultValue: this.environment.url ?? "https://test.salesforce.com",
    });

    this.buildActions();
  }

  private async updateUser() {
    this.environment = await Utils.inquirer.email({
      message: "Inform the user name",
      error: "Must inform a valid username",
      defaultValue: this.environment.user,
    });

    this.buildActions();
  }

  private async updateToken() {
    this.environment.token = await Utils.inquirer.input({
      message: "Inform environment token",
      error: "Must inform a token",
      defaultValue: this.environment.token,
    });

    this.buildActions();
  }

  private async updatePassword() {
    this.environment.password = await Utils.inquirer.password({
      message: "Inform environment password",
      error: "Must inform a password",
      defaultValue: "",
    });

    this.buildActions();
  }

  private async deleteEnvironemnt() {
    let confirm = await Utils.inquirer.confirm(`Delete ${this.environment.name}? This, can't be undone.`);

    console.log("p", this.environment.path);

    if (!confirm) return;

    this.finishProccess = true;
    Fs.unlinkSync(this.environment.path);

    return "return";
  }
}
