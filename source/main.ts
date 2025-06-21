import { existsSync, promises, readdirSync } from "node:fs";
import { join } from "node:path";
import { mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import { coerce, gt, valid } from "semver";
import which from "which";

/**
 * Locates WebStorm.
 */
export class WebStormLocator {
  /**
   * Determines the name of the `webstorm` binary, based on the system bitness.
   * @returns The correct name of the `webstorm` binary.
   */
  webstormBinary(): string {
    return process.arch === "x64" ? "webstorm64.exe" : "webstorm.exe";
  }

  /**
   * Find the webstorm binary.
   * @returns The path of the webstorm binary.
   */
  findWebstorm() {
    try {
      return which.sync(this.webstormBinary());
    } catch (_error) {
      // Not found on PATH, attempt manual lookup.
      return this.findManual();
    }
  }
  /**
   * Find the webstorm binary asynchronously.
   * @returns The path of the webstorm binary.
   */
  async findWebstormAsync() {
    try {
      return await which(this.webstormBinary());
    } catch (_error) {
      // Not found on PATH, attempt manual lookup.
      return this.findManual();
    }
  }

  /**
   * Finds all product path names of JetBrains products.
   * @returns A list of all JetBrains product paths on the system.
   */
  findJetbrainsProducts(): Array<string> {
    return readdirSync(join(mustExist(process.env["ProgramFiles(x86)"]), "JetBrains"));
  }
  /**
   * Finds all product path names of JetBrains products asynchronously.
   * @returns A list of all JetBrains product paths on the system.
   */
  findJetbrainsProductsAsync(): Promise<Array<string>> {
    return promises.readdir(join(mustExist(process.env["ProgramFiles(x86)"]), "JetBrains"));
  }

  /**
   * Searches WebStorm in the filesystem.
   * @returns The path of the webstorm binary.
   */
  findManual(): string {
    switch (process.platform) {
      case "win32":
        return this.findManualWindows(this.findJetbrainsProducts());

      default:
        throw new Error(`Platform '${process.platform}' is not supported.`);
    }
  }
  /**
   * Searches WebStorm in the filesystem asynchronously.
   * @returns The path of the webstorm binary.
   */
  async findManualAsync(): Promise<string> {
    switch (process.platform) {
      case "win32":
        return this.findManualWindows(await this.findJetbrainsProductsAsync());

      default:
        throw new Error(`Platform '${process.platform}' is not supported.`);
    }
  }

  /**
   * Find a webstorm binary in a list of JetBrains products.
   * @param jetbrainsProducts - A list of JetBrains product names found on the system.
   * @returns The path of the webstorm binary.
   */
  findManualWindows(jetbrainsProducts: Array<string>) {
    return this.#getLatest(
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
            path: entry,
            version: mustExist(valid(coerce(ver[1]))),
          };
        })
        .sort(this.#customSort.bind(this)),
    );
  }

  #customSort(a: { version: string }, b: { version: string }) {
    return gt(a.version, b.version) ? -1 : 1;
  }

  #getLatest(entries: Array<{ path: string }>) {
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
