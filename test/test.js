"use strict";

const mocha = require("mocha");

const after = mocha.after;
const before = mocha.before;
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const chaiExec = require("@jsdevtools/chai-exec");
const describe = mocha.describe;
const expect = require("chai").expect;
const it = mocha.it;
const mockFs = require("mock-fs");

chai.use(chaiAsPromised);
chai.use(chaiExec);

describe("which-webstorm", () => {
	const whichWebstorm = require("..");

	describe("x86", () => {
		let originalArch;
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
		let originalArch;
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
		let originalArch;
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

		before(() =>
			mockFs({
				"C:\\Program Files (x86)\\JetBrains\\WebStorm 163.9999\\bin\\webstorm64.exe":
					"foo",
			})
		);
		after(() => mockFs.restore());

		it("should return the webstorm binary", () => {
			return expect(whichWebstorm()).to.eventually.equal(
				"C:\\Program Files (x86)\\JetBrains\\WebStorm 163.9999\\bin\\webstorm64.exe"
			);
		});
	});

	describe("eap directory", () => {
		let originalArch;
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

		before(() =>
			mockFs({
				"C:\\Program Files (x86)\\JetBrains\\WebStorm 163.9999\\bin\\webstorm64.exe":
					"foo",
			})
		);
		after(() => mockFs.restore());

		it("should return the webstorm binary", () => {
			return expect(whichWebstorm.sync()).to.equal(
				"C:\\Program Files (x86)\\JetBrains\\WebStorm 163.9999\\bin\\webstorm64.exe"
			);
		});
	});

	describe("return latest", () => {
		let originalArch;
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

		before(() =>
			mockFs({
				"C:\\Program Files (x86)\\JetBrains\\WebStorm 2020.1\\bin\\webstorm64.exe":
					"foo",
				"C:\\Program Files (x86)\\JetBrains\\WebStorm 17.9.0\\bin\\webstorm64.exe":
					"foo",
				"C:\\Program Files (x86)\\JetBrains\\WebStorm 2020.1.4\\bin\\webstorm64.exe":
					"foo",
				"C:\\Program Files (x86)\\JetBrains\\WebStorm 2020.2\\bin\\webstorm64.exe":
					"foo",
				"C:\\Program Files (x86)\\JetBrains\\WebStorm 163.9999\\bin\\webstorm64.exe":
					"foo",
			})
		);
		after(() => mockFs.restore());

		it("should return the LATEST webstorm binary", () => {
			return expect(whichWebstorm.sync()).to.equal(
				"C:\\Program Files (x86)\\JetBrains\\WebStorm 2020.2\\bin\\webstorm64.exe"
			);
		});
	});
	describe("return latest (async)", () => {
		let originalArch;
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

		before(() =>
			mockFs({
				"C:\\Program Files (x86)\\JetBrains\\WebStorm 2020.1\\bin\\webstorm64.exe":
					"foo",
				"C:\\Program Files (x86)\\JetBrains\\WebStorm 17.9.0\\bin\\webstorm64.exe":
					"foo",
				"C:\\Program Files (x86)\\JetBrains\\WebStorm 2020.1.4\\bin\\webstorm64.exe":
					"foo",
				"C:\\Program Files (x86)\\JetBrains\\WebStorm 2020.2\\bin\\webstorm64.exe":
					"foo",
				"C:\\Program Files (x86)\\JetBrains\\WebStorm 163.9999\\bin\\webstorm64.exe":
					"foo",
			})
		);
		after(() => mockFs.restore());

		it("should return the LATEST webstorm binary", () => {
			return expect(whichWebstorm()).to.eventually.equal(
				"C:\\Program Files (x86)\\JetBrains\\WebStorm 2020.2\\bin\\webstorm64.exe"
			);
		});
	});
	describe("CLI", () => {
		it("should not throw when being executed", () => {
			const cli = chaiExec("node index.js");
			return expect(cli).to.exit.with.code(0);
		});
	});
});
