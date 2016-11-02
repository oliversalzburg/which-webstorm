#!/usr/bin/env node

"use strict";

const execa         = require( "execa" );
const fs            = require( "fs" );
const path          = require( "path" );
const whichWebstorm = require( ".." );

whichWebstorm()
	.then( webstorm => {
		const args = process.argv.splice( 2 );

		if( args.length ) {
			// Attempt to construct absolute path.
			// This ensures that WebStorm doesn't try to resolve paths relative to
			// the location where the webstorm binary is located.
			const fullPath = path.resolve( args[ 0 ] );
			if( fs.statSync( fullPath ) ) {
				args[ 0 ] = fullPath;
			}
		}

		return execa( webstorm, args.length ? args : [ process.cwd() ], {
			cwd : process.cwd()
		} );
	} );
