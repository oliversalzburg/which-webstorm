import { expect } from "chai";
import { execa } from "execa";
import { after, before, describe, it } from "mocha";
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
      expect(whichWebstorm.webstormBinary()).to.equal("webstorm.exe");
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
      expect(whichWebstorm.webstormBinary()).to.equal("webstorm64.exe");
    });
  });

  describe("CLI", () => {
    it("should not throw when being executed", async () => {
      const cli = await execa("node", ["output/main.js"]);
      return expect(cli.exitCode).to.equal(0);
    });
  });
});
