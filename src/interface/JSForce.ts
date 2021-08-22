import * as JSforce from "jsforce";
import * as Controller from "../controller";

export interface RetrievePackageArgs {
  environment: Controller.Environment;
  package: Controller.Package;
  project: Controller.Project;
}

export interface RetrieveMessage {
  fileName: string;
  problem: string;
}

export interface RetrieveResult extends JSforce.AsyncResult {
  zipFile?: string;
  success?: string;
  messages?: RetrieveMessage | Array<RetrieveMessage>;
  errorMessage?: string;
  status?: string;
  errorStatusCode?: string;
}
