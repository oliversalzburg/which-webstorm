/// <reference types="node" />
import * as fs from "fs";
declare module "which-webstorm" {
	type findWebstormAsync = () => Promise<string>;
	type findWebstormSync = {
		sync: () => string;
		webstormBinary: () => string;
	};
	const findWebstorm: findWebstormAsync & findWebstormSync;

	type readDirResult = string[] | Buffer[] | fs.Dirent[];

	export class WebStormLocator {
		webstormBinary: () => string;
		findWebstorm: () => string;
		findWebstormAsync: () => Promise<string>;
		findJetbrainsProducts: () => readDirResult;
		findJetbrainsProductsAsync: () => Promise<readDirResult>;
		findManual: () => string;
		findManualAsync: () => string;
		findManualWindows: (
			jetbrainsProducts: readDirResult,
			validateSynchronously: boolean
		) => string;
	}
}
export default findWebstorm;
