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
			throw new Error( `Platform '${process.platform}' is not supported yet.` );
	}
}

function findManualWindows() {
	return fs.readdirAsync( path.join( process.env[ "ProgramFiles(x86)" ], "JetBrains" ) )
		.filter( entry => entry.match( /WebStorm/ ) )
		.then( entries => {
			if( !entries || !entries.length ) {
				throw new Error( "WebStorm not found" );
			}

			return path.join( process.env[ "ProgramFiles(x86)" ], "JetBrains", entries[ 0 ], "bin/WebStorm.exe" );
		} );
}

if( module.parent ) {
	module.exports = findWebstorm;
	return;
}

findWebstorm()
	.then( console.log )
	.catch( console.error );
