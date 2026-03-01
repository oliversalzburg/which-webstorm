import assert from "node:assert";
import { after, before, describe, it } from "node:test";
import { execa } from "execa";
import whichWebstorm from "./main.js";

describe("which-webstorm", () => {
  describe("x86", () => {
    let originalArch: string;
    before(() => {
      originalArch = process.arch;
      Object.defineProperty(process, "arch", {
        value: "x86",
      });
    });
    after(() => {
      Object.defineProperty(process, "arch", {
        value: originalArch,
      });
    });

    it("should return the x86 binary name", () => {
      assert.strictEqual(whichWebstorm.webstormBinary(), "webstorm.exe");
    });
  });

  describe("x64", () => {
    let originalArch: string;
    before(() => {
      originalArch = process.arch;
      Object.defineProperty(process, "arch", {
        value: "x64",
      });
    });
    after(() => {
      Object.defineProperty(process, "arch", {
        value: originalArch,
      });
    });

    it("should return the x64 binary name", () => {
      assert.strictEqual(whichWebstorm.webstormBinary(), "webstorm64.exe");
    });
  });

  describe("CLI", () => {
    it("should not throw when being executed", async () => {
      const cli = await execa("node", ["output/main.js"]);
      assert.strictEqual(cli.exitCode, 0);
    });
  });
});
