import { mustExist } from "@oliversalzburg/js-utils/nil.js";
import { existsSync, promises, readdirSync } from "node:fs";
import { join } from "node:path";
import { coerce, gt, valid } from "semver";
import which from "which";

export class WebStormLocator {
  webstormBinary(): string {
    return process.arch === "x64" ? "webstorm64.exe" : "webstorm.exe";
  }

  findWebstorm() {
    try {
      return which.sync(this.webstormBinary());
    } catch (error) {
      // Not found on PATH, attempt manual lookup.
      return this.findManual();
    }
  }
  async findWebstormAsync() {
    try {
      return await which(this.webstormBinary());
    } catch (error) {
      // Not found on PATH, attempt manual lookup.
      return this.findManual();
    }
  }

  findJetbrainsProducts(): Array<string> {
    return readdirSync(join(mustExist(process.env["ProgramFiles(x86)"]), "JetBrains"));
  }
  findJetbrainsProductsAsync(): Promise<Array<string>> {
    return promises.readdir(join(mustExist(process.env["ProgramFiles(x86)"]), "JetBrains"));
  }

  findManual(): string {
    switch (process.platform) {
      case "win32":
        return this.findManualWindows(this.findJetbrainsProducts());

      default:
        throw new Error(`Platform '${process.platform}' is not supported.`);
    }
  }
  async findManualAsync(): Promise<string> {
    switch (process.platform) {
      case "win32":
        return this.findManualWindows(await this.findJetbrainsProductsAsync());

      default:
        throw new Error(`Platform '${process.platform}' is not supported.`);
    }
  }

  findManualWindows(jetbrainsProducts: Array<string>) {
    return this._getLatest(
      jetbrainsProducts
        .filter(entry => entry.match(/WebStorm/))
        .map(entry => {
          return join(
            mustExist(process.env["ProgramFiles(x86)"]),
            "JetBrains",
            entry,
            "bin",
            this.webstormBinary(),
          );
        })
        .filter(candidate => existsSync(candidate))
        .map(entry => {
          const ver = entry.match(/WebStorm[^0-9]([0-9.]+)/) ?? ["", ""];
          return {
            version: mustExist(valid(coerce(ver[1]))),
            path: entry,
          };
        })
        .sort(this._customSort.bind(this)),
    );
  }

  _customSort(a: { version: string }, b: { version: string }) {
    return gt(a.version, b.version) ? -1 : 1;
  }

  _getLatest(entries: Array<{ path: string }>) {
    if (entries.length === 0) {
      throw new Error("WebStorm not found");
    }
    return entries[0].path;
  }
}

const locator = new WebStormLocator();
const _export: (() => Promise<string>) & { sync: () => string; webstormBinary: () => string } =
  Object.assign(locator.findWebstormAsync.bind(locator), {
    sync: locator.findWebstorm.bind(locator),
    webstormBinary: locator.webstormBinary.bind(locator),
  });
export default _export;
