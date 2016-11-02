#!/usr/bin/env node

"use strict";

const Promise = require( "bluebird" );

const fs         = Promise.promisifyAll( require( "fs" ) );
const path       = require( "path" );
const whichAsync = Promise.promisify( require( "which" ) );

function findWebstorm() {
	return whichAsync( "webstorm" )
		.catch( () => {
			// Not found on PATH, attempt manual lookup.
			return findManual();
		} );
}

function findManual() {
	switch( process.platform ) {
		case "win32":
			return findManualWindows();

		default:
			throw new Error( `Platform '${process.platform}' is not supported.` );
	}
}

function findManualWindows() {
	return fs.readdirAsync( path.join( process.env[ "ProgramFiles(x86)" ], "JetBrains" ) )
		.filter( entry => entry.match( /WebStorm/ ) )
		.map( entry => {
			return path.join( process.env[ "ProgramFiles(x86)" ], "JetBrains", entry, "bin/WebStorm.exe" );
		} )
		.filter( candidate => fs.statAsync( candidate )
			.then( () => true )
			.catch( () => false ) )
		.then( entries => {
			if( !entries || !entries.length ) {
				throw new Error( "WebStorm not found" );
			}

			return entries[ 0 ];
		} );
}

if( module.parent ) {// jscs:ignore requirePaddingNewLinesBeforeExport
	module.exports = findWebstorm;

} else {
	findWebstorm()
		.then( console.log )
		.catch( console.error );
}
