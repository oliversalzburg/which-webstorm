#!/usr/bin/env node

import { execa } from "execa";
import { statSync } from "node:fs";
import { resolve } from "node:path";
import { WebStormLocator } from "../output/main.js";

new WebStormLocator().findWebstormAsync().then(webstorm => {
  const args = process.argv.splice(2);

  if (args.length) {
    return Promise.all(
      args.map(arg => {
        // Attempt to construct absolute path.
        // This ensures that WebStorm doesn't try to resolve paths relative to
        // the location where the webstorm binary is located.
        const fullPath = resolve(arg);
        if (statSync(fullPath)) {
          arg = fullPath;
        }

        return execa(webstorm, [arg], {
          cwd: process.cwd(),
        });
      }),
    );
  }

  return execa(webstorm, {
    cwd: process.cwd(),
  });
});
