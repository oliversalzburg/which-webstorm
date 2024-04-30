#!/usr/bin/env node

import { WebStormLocator } from "../output/main.js";

new WebStormLocator().findWebstormAsync().then(console.log).catch(console.error);
