#!/usr/bin/env node

"use strict";

const fs = require("fs");
const path = require("path");
const which = require("which");
const semver = require("semver");

function findWebstorm() {
	return which(findWebstorm.webstormBinary()).catch(() => {
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
function getLatest(entries) {
	if (!entries || !entries.length) {
		throw new Error("WebStorm not found");
	}
	return entries[0].path;
}

function findManualWindows() {
	return fs.promises
		.readdir(path.join(process.env["ProgramFiles(x86)"], "JetBrains"))
		.then((result) =>
			getLatest(
				result
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
						fs.promises
							.stat(candidate)
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
					.sort(customSort)
			)
		);
}

if (module.parent) {
	module.exports = findWebstorm;
} else {
	findWebstorm().then(console.log).catch(console.error);
}
