#!/usr/bin/env node

import { redirectErrorsToConsole } from "@oliversalzburg/js-utils";
import { WebStormLocator } from "../output/main.js";

new WebStormLocator()
  .findWebstormAsync()
  .then(location => process.stdout.write(location))
  .catch(redirectErrorsToConsole(console));
