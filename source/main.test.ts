import { expect } from "chai";
import { execa } from "execa";
import { after, before, describe, it } from "mocha";
import mockFs, { restore } from "mock-fs";
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

  describe("eap directory (async)", () => {
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

    before(() => {
      mockFs({
        "C:\\Program Files (x86)\\JetBrains\\WebStorm 163.9999\\bin\\webstorm64.exe": "foo",
      });
    });
    after(() => {
      restore();
    });

    it("should return the webstorm binary", done => {
      void whichWebstorm()
        .catch(() => {
          done();
        })
        .then(result => {
          expect(result).to.equal(
            "C:\\Program Files (x86)\\JetBrains\\WebStorm 163.9999\\bin\\webstorm64.exe",
          );
          done();
        });
    });
  });

  describe("eap directory", () => {
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

    before(() => {
      mockFs({
        "C:\\Program Files (x86)\\JetBrains\\WebStorm 163.9999\\bin\\webstorm64.exe": "foo",
      });
    });
    after(() => {
      restore();
    });

    it("should return the webstorm binary", () => {
      return expect(whichWebstorm.sync()).to.equal(
        "C:\\Program Files (x86)\\JetBrains\\WebStorm 163.9999\\bin\\webstorm64.exe",
      );
    });
  });

  describe("return latest", () => {
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

    before(() => {
      mockFs({
        "C:\\Program Files (x86)\\JetBrains\\WebStorm 2020.1\\bin\\webstorm64.exe": "foo",
        "C:\\Program Files (x86)\\JetBrains\\WebStorm 17.9.0\\bin\\webstorm64.exe": "foo",
        "C:\\Program Files (x86)\\JetBrains\\WebStorm 2020.1.4\\bin\\webstorm64.exe": "foo",
        "C:\\Program Files (x86)\\JetBrains\\WebStorm 2020.2\\bin\\webstorm64.exe": "foo",
        "C:\\Program Files (x86)\\JetBrains\\WebStorm 163.9999\\bin\\webstorm64.exe": "foo",
      });
    });
    after(() => {
      restore();
    });

    it("should return the LATEST webstorm binary", () => {
      return expect(whichWebstorm.sync()).to.equal(
        "C:\\Program Files (x86)\\JetBrains\\WebStorm 2020.2\\bin\\webstorm64.exe",
      );
    });
  });
  describe("return latest (async)", () => {
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

    before(() => {
      mockFs({
        "C:\\Program Files (x86)\\JetBrains\\WebStorm 2020.1\\bin\\webstorm64.exe": "foo",
        "C:\\Program Files (x86)\\JetBrains\\WebStorm 17.9.0\\bin\\webstorm64.exe": "foo",
        "C:\\Program Files (x86)\\JetBrains\\WebStorm 2020.1.4\\bin\\webstorm64.exe": "foo",
        "C:\\Program Files (x86)\\JetBrains\\WebStorm 2020.2\\bin\\webstorm64.exe": "foo",
        "C:\\Program Files (x86)\\JetBrains\\WebStorm 163.9999\\bin\\webstorm64.exe": "foo",
      });
    });
    after(() => {
      restore();
    });

    it("should return the LATEST webstorm binary", done => {
      void whichWebstorm()
        .catch(() => {
          done();
        })
        .then(result => {
          expect(result).to.equal(
            "C:\\Program Files (x86)\\JetBrains\\WebStorm 2020.2\\bin\\webstorm64.exe",
          );
          done();
        });
    });
  });
  describe("CLI", () => {
    it("should not throw when being executed", async () => {
      const cli = await execa("node", ["output/main.js"]);
      return expect(cli.exitCode).to.equal(0);
    });
  });
});
