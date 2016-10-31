#!/usr/bin/env node

"use strict";

const execa         = require( "execa" );
const whichWebstorm = require( ".." );

whichWebstorm()
	.then( webstorm => {
		const args = process.argv.splice( 2 );

		return execa( webstorm, args.length ? args : [ process.cwd() ] );
	} );
