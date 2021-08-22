import * as JSforce from "jsforce";

interface packageTypeRaw {
  name: string[];
  members: string[];
}
interface packageType {
  name: string;
  members: string[];
}

export function buildUnpackaged(rawPackage: any, apiVersion: string): JSforce.Package {
  const unpackage: JSforce.Package = {
    types: [],
    version: apiVersion,
    //   " | "Restricted" | undefined;
    //   description?: string | undefined;
    //   namespacePrefix?: string | undefined;
    //   objectPermissions?: ProfileObjectPermissions[] | undefined;
    //   postInstallClass?: string | undefined;
    //   setupWeblink?: string | undefined;
    //   uninstallClass?: string | undefined;
    //
  };

  if (rawPackage.fullName && rawPackage.fullName.length > 0) {
    unpackage.fullName = rawPackage.fullName[0];
  }

  if (rawPackage.types != null) {
    if (!Array.isArray(rawPackage.types)) rawPackage.types = [rawPackage.types];

    for (let i of rawPackage.types) {
      i = <JSforce.PackageTypeMembers>i;
      unpackage.types.push({ name: i.name[0], members: i.members });
    }
  }

  return unpackage;
}
