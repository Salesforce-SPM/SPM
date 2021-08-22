// ? maybe this could be a project

import * as Utils from "../../utils";
import * as Fs from "fs";
import * as Path from "path";

type LogType = "INFO" | "ERROR" | "PROCESS";

// export  LogTypes = "DEBUG" | "ERROR" | "PROCESS"

class Logger {
  protected filePath: string;
  readonly types: LogType;
  private log: string[] = [];

  constructor(logPath?: string) {
    this.filePath = logPath;
  }

  get path() {
    return this.filePath;
  }

  set path(filePath: string) {
    if (!this.filePath && filePath) this.filePath = filePath;
  }

  public getLog(splited: boolean = false) {
    if (splited) return [...this.log];
    else return this.log.join("\n");
  }

  public addLog(text: string, type: LogType, options?: { prompt?: boolean; callback?: Function }) {
    let rawText = `${text}`;

    options = options ?? {};
    options.prompt = options.prompt ?? true;

    text = `${Utils.string.logTimeStamp()}|${type}|${`${text}`.replace("\n", " ")}`;

    this.log.push(text);

    if (this.filePath) {
      if (!Fs.existsSync(Path.dirname(this.filePath))) Fs.mkdirSync(Path.dirname(this.filePath), { recursive: true });
      if (!Fs.existsSync(this.filePath)) Fs.writeFileSync(this.filePath, this.log.join("\n"));
      else Fs.appendFileSync(this.filePath, `\n${text}`);
    }

    if (options.callback) options.callback(rawText);
    else if (options.prompt) console.log(rawText);
  }

  public info(text: string, prompt = false) {
    this.addLog(text, "INFO", { prompt });
  }

  public error(text: string, options: { exception: boolean; prompt?: boolean }) {
    if (options.exception) {
      this.addLog(text, "ERROR", { callback: Utils.string.errorMessage });
    } else if (options.prompt) {
      this.addLog(text, "ERROR", { callback: Utils.string.color.red });
    } else {
      this.addLog(text, "ERROR", { prompt: false });
    }
  }
}

export const logger = new Logger();
