'use strict';

const router   = require( 'express' ).Router();
const _        = require( 'lodash' );

const version  = require( '../package.json' ).version;
const prefix   = '/v' + version.split( '.' ).shift();

router.get( '/',
	( req, res ) => {
		res.json({ message: 'Welcome to the authentication system', version: version });
	}
);

router.use( prefix + '/', require( './get' ) );

router.use( prefix + '/', require( './create' ) );

module.exports = router;
