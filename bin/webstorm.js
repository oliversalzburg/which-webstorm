#!/usr/bin/env node

"use strict";

const Promise = require("bluebird");

const execa = require("execa");
const fs = require("fs");
const path = require("path");
const whichWebstorm = require("..");

whichWebstorm().then((webstorm) => {
	const args = process.argv.splice(2);

	if (args.length) {
		return Promise.map(args, (arg) => {
			// Attempt to construct absolute path.
			// This ensures that WebStorm doesn't try to resolve paths relative to
			// the location where the webstorm binary is located.
			const fullPath = path.resolve(arg);
			if (fs.statSync(fullPath)) {
				arg = fullPath;
			}

			return execa(webstorm, [arg], {
				cwd: process.cwd(),
			});
		});
	}

	return execa(webstorm, {
		cwd: process.cwd(),
	});
});
