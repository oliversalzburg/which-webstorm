#!/usr/bin/env node

"use strict";

const fs = require("fs");
const path = require("path");
const which = require("which");
const semver = require("semver");

class WebStormLocator {
	webstormBinary() {
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
	findWebstormAsync() {
		try {
			return await which(this.webstormBinary());

		} catch (error) {
			// Not found on PATH, attempt manual lookup.
			return this.findManual();
		}
	}

	findJetbrainsProducts() {
		return fs.readdir(
			path.join(process.env["ProgramFiles(x86)"], "JetBrains")
		);
	}
	findJetbrainsProductsAsync() {
		return fs.promises.readdir(
			path.join(process.env["ProgramFiles(x86)"], "JetBrains")
		);
	}

	findManual() {
		switch (process.platform) {
			case "win32":
				return this.findManualWindows(this.findJetbrainsProducts());

			default:
				throw new Error(`Platform '${process.platform}' is not supported.`);
		}
	}
	async findManualAsync() {
		switch (process.platform) {
			case "win32":
				return this.findManualWindows(await this.findJetbrainsProductsAsync());

			default:
				throw new Error(`Platform '${process.platform}' is not supported.`);
		}
	}

	findManualWindows(jetbrainsProducts) {
		return this._getLatest(
			jetbrainsProducts
				.filter((entry) => entry.match(/WebStorm/))
				.map((entry) => {
					return path.join(
						process.env["ProgramFiles(x86)"],
						"JetBrains",
						entry,
						"bin",
						this.webstormBinary()
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
				.sort(this._customSort)
		);
	}

	_customSort(a, b) {
		return semver.gt(a.version, b.version) ? -1 : 1;
	}

	_getLatest(entries) {
		if (!entries || !entries.length) {
			throw new Error("WebStorm not found");
		}
		return entries[0].path;
	}
}

if (module.parent) {
	const locator = new WebStormLocator();

	// For compatibility with older versions, export a matching interface.
	module.exports = locator.findWebstormAsync.bind(locator);
	module.exports.sync = locator.findWebstorm.bind(locator);
	module.exports.webstormBinary = locator.webstormBinary.bind(locator);
	// Also export the class itself for external consumption.
	module.exports.WebStormLocator = WebStormLocator;
} else {
	new WebStormLocator().findWebstorm().then(console.log).catch(console.error);
}
