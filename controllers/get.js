'use strict';

/**
 * Getter endpoints, which are exposed to users.
 */

const router    = require( 'express' ).Router();

const Event     = require( '../models/event' );
const Reference = require( '../models/reference' );
const UserError = require( '../helpers/errors' );

router.get( '/events',
	parseToken,
	( req, res, next ) => {
		let query  = new Event();
		let params = req.query;

		if ( params.user ) {
			query.where( 'userId', parseInt( params.user ) );
		}
		if ( params.office ) {
			query.where( 'officeId', parseInt( params.office ) );
		}
		if ( params.service ) {
			query.where( 'service', 'LIKE', params.service + '%' );
		}
		if ( params.dateStart ) {
			let start = new Date( params.dateStart );
			if ( NaN !== start ) {
				query.where( 'occurredAt', '>=', start );
			}
		}
		if ( params.dateEnd ) {
			let end = new Date( params.dateEnd );
			if ( NaN !== end ) {
				query.where( 'occurredAt', '<=', end );
			}
		}
		if ( params.message ) {
			query.where( 'message', 'LIKE', '%' + params.message + '%' );
		}

		if ( ! isNaN( Number.parseInt( params.limit ) ) ) {
			query.query( 'limit', Number.parseInt( params.limit ) );
		} else {
			query.query( 'limit', 100 );
		}
		if ( ! isNaN( Number.parseInt( params.offset ) ) ) {
			query.query( 'offset', Number.parseInt( params.offset ) );
		}

		return query.fetchAll()
		.then( events => {
			res.json( events.toJSON() );
		});
	}
);

router.get( '/events/:id(\\d+)',
	parseToken,
	( req, res, next ) => {
		return new Event({ id: req.params.id })
		.fetch({ withRelated: [ 'references' ] })
		.then( event => {
			res.json( event.toJSON() );
		});
	}
);

router.get( '/references',
	parseToken,
	( req, res, next ) => {

		let params = req.query;

		if ( ! params.object ) {
			return next( new UserError( 'Missing required param "object"', 400 ) );
		} else if ( ! params.objectId ) {
			return next(  new UserError( 'Missing required param "objectId"', 400 ) );
		} else if ( ! params.service ) {
			return next(  new UserError( 'Missing required param "service"', 400 ) );
		}

		let query = new Reference()
		.where({
			objectId: params.objectId,
			object:   params.object,
			'reference.service':  params.service
		});

		if ( ! isNaN( Number.parseInt( params.limit ) ) ) {
			query.query( 'limit', Number.parseInt( params.limit ) );
		} else {
			query.query( 'limit', 100 );
		}
		if ( ! isNaN( Number.parseInt( params.offset ) ) ) {
			query.query( 'offset', Number.parseInt( params.offset ) );
		}

		return query
		.withEvents()
		.fetchAll()
		.then( refs => {
			res.json( refs.toJSON() );
		});
	}
);

router.get( '/references/:id(\\d+)',
	parseToken,
	( req, res, next ) => {
		return new Reference({ id: req.params.id })
		.fetch({ withRelated: [ 'event' ] })
		.then( refs => {
			res.json( refs.toJSON() );
		});
	}
);

function parseToken( req, res, next ) {
	if ( 'token' in req.cookies ) {
		req.query.token = req.cookies.token;
	}

	if ( ! req.query.token ) {
		return next( new UserError( 'Token not provided', 403 ) );
	}

	// TODO: Validate token in User Hub.

	next();
}

module.exports = router;
