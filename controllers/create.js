'use strict';

/**
 * Private creation endpoint.
 */

const router    = require( 'express' ).Router();
const _         = require( 'lodash' );

const UserError = require( '../helpers/errors' );

router.post( '/events',
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
	( req, res, next ) => {
		if ( ! req.body ) {
			return next( new UserError( 'No body provided', 400 ) );
		}

		let body   = req.body;
		let params = {
			userId: 'User ID',
			service: 'Service',
			message: 'Message',
			occurredAt: 'Event date'
		};
		for ( let prop in params ) {
			if ( ! body[ prop ] ) {
				return next( new UserError( 'Missing ' + params[ prop ], 400 ) );
			}
		}

		let validInput = _.pick( body, [
			'userId',
			'officeId',
			'service',
			'message',
			'metadata',
			'delta',
			'occurredAt'
		] );
		let validReferences = [];

		if ( _.isArray( body.references ) ) {
			let refs = _.map( body.references, p => _.pick( p, [
				'service',
				'object',
				'objectId',
			] ) );
			validReferences = _.filter( refs, r => 3 === _.size( r ) );
		}
		validInput.occurredAt = new Date( validInput.occurredAt );

		// We return the response without waiting for MySQL, as that slows everything down.
		res.json({ success: true });

		const Event = require( '../models/event' );

		new Event( validInput )
		.save()
		.then( evt => evt.addReferences( validReferences ) );
	}
);

module.exports = router;
