#!/usr/bin/env node

"use strict";

const Promise = require("bluebird");

const fs = Promise.promisifyAll(require("fs"));
const path = require("path");
const whichAsync = Promise.promisify(require("which"));
const semver = require("semver");

function findWebstorm() {
	return whichAsync(findWebstorm.webstormBinary()).catch(() => {
		// Not found on PATH, attempt manual lookup.
		return findManual();
	});
}
findWebstorm.webstormBinary = () =>
	process.arch === "x64" ? "webstorm64.exe" : "webstorm.exe";

function findManual() {
	switch (process.platform) {
		case "win32":
			return findManualWindows();

		default:
			throw new Error(`Platform '${process.platform}' is not supported.`);
	}
}

function customSort(a, b) {
	return semver.gt(a.version, b.version) ? -1 : 1;
}

function findManualWindows() {
	return fs
		.readdirAsync(path.join(process.env["ProgramFiles(x86)"], "JetBrains"))
		.filter((entry) => entry.match(/WebStorm/))
		.map((entry) => {
			return path.join(
				process.env["ProgramFiles(x86)"],
				"JetBrains",
				entry,
				"bin",
				findWebstorm.webstormBinary()
			);
		})
		.filter((candidate) =>
			fs
				.statAsync(candidate)
				.then(() => true)
				.catch(() => false)
		)
		.map((entry) => {
			const ver = entry.match(/WebStorm[^0-9]([0-9\.]+)/) || ["", ""];
			return {
				version: semver.valid(semver.coerce(ver[1])),
				path: entry,
			};
		})
		.then((entries) => {
			if (!entries || !entries.length) {
				throw new Error("WebStorm not found");
			}
			const latest = entries.sort(customSort);
			return latest[0].path;
		});
}

if (module.parent) {
	module.exports = findWebstorm;
} else {
	findWebstorm().then(console.log).catch(console.error);
}
