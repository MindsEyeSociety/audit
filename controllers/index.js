'use strict';

const router   = require( 'express' ).Router();
const _        = require( 'lodash' );

const version  = require( '../package.json' ).version;
const prefix   = '/v' + version.split( '.' ).shift();

const UserError = require( '../helpers/errors' );

router.get( '/',
	( req, res ) => {
		res.json({ message: 'Welcome to the authentication system', version: version });
	}
);

router.get( prefix + '/', ( req, res ) => {
	res.json({ message: 'here!' });
});

router.get(
	prefix + '/test',
	( req, res, next ) => {
		let port = req.app.get( 'internalPort' );
		if ( ! port ) {
			next( new UserError( 'Internal error', 500 ) );
		}
		if ( Number.parseInt( port ) !== req.socket.localPort ) {
			next( new UserError( 'Request over insecure port', 403 ) );
		}
		next();
	},
	( req, res ) => {
		res.json({ foo: 'secure here' });
	}
);

module.exports = router;
