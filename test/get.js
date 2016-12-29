'use strict';

const supertest = require( 'supertest' );
const should    = require( 'should' );

const request   = supertest( 'localhost:' + ( process.env.PORT || '3000' ) );

module.exports = function() {
	describe( 'events', function() {
		it( 'fails if token is not provided', done => noToken( '/v1/events', done ) );

		it( 'fails if the token isn\'t authorized', done => unauthToken( '/v1/events', done ) );

		let tests = [
			{ query: {}, length: 2 },
			{ query: { user: 1 }, length: 1 },
			{ query: { user: 1000 }, length: 0 },
			{ query: { service: 'user-hub' }, length: 1 },
			{ query: { service: 'fake' }, length: 0 },
			{ query: { office: 1 }, length: 1 },
			{ query: { office: 1000 }, length: 0 },
			{ query: { dateStart: '2016-12-19' }, length: 2 },
			{ query: { dateStart: '2016-12-20' }, length: 1 },
			{ query: { dateEnd: '2016-12-20' }, length: 1 },
			{ query: { dateEnd: '2016-12-21' }, length: 2 },
			{ query: { message: 'Steve' }, length: 1 },
			{ query: { limit: 1 }, length: 1 }
		];

		tests.forEach( test => {
			let title = `returns ${test.length} events`;
			let key = Object.keys( test.query ).join( '' );
			if ( '' !== key ) {
				title += ` with ${key} set to "${test.query[ key ]}"`;
			}

			it( title, function( done ) {
				request
				.get( '/v1/events' )
				.query({ token: 'DEV' })
				.query( test.query )
				.expect( 200 )
				.end( ( err, res ) => {
					if ( err ) {
						return done( err );
					}
					res.body.should.be.an.Array();
					if ( 0 === test.length ) {
						res.body.should.be.empty();
					} else {
						res.body.should.be.length( test.length );
						res.body.forEach( testEvent );
					}
					done();
				});
			})
		});
	});

	describe( 'events id', function() {
		it( 'fails if token is not provided', done => noToken( '/v1/events/2', done ) );

		it( 'fails if the token isn\'t authorized', done => unauthToken( '/v1/events/2', done ) );

		it( 'provides an event if authorized', function( done ) {
			request
			.get( '/v1/events/2' )
			.query({ token: 'DEV' })
			.expect( 200 )
			.end( ( err, res ) => {
				if ( err ) {
					return done( err );
				}
				res.body.should.be.an.Object();
				testEvent( res.body );
				res.body.should.have.property( 'references' );
				res.body.references.should.be.an.Array();
				res.body.references.forEach( testReference );
				done();
			});
		});
	});

	describe( 'references', function() {
		it( 'fails if token is not provided', done => noToken( '/v1/references', done ) );

		it( 'fails if the token isn\'t authorized', done => unauthToken( '/v1/references', done ) );

		let params = [ 'object', 'objectId', 'service' ];
		params.forEach( param => {
			it( `fails if missing ${param} param`, function( done ) {
				let query = { object: 'user', objectId: 3, service: 'user-hub' };
				delete query[ param ];

				request
				.get( '/v1/references' )
				.query({ token: 'DEV' })
				.query( query )
				.expect( 400 )
				.end( ( err, res ) => {
					if ( err ) {
						return done( err );
					}
					res.body.should.have.property( 'message', `Missing required param "${param}"` );
					done();
				})
			});
		});

		it( 'provides an array of references if authorized', function( done ) {
			request
			.get( '/v1/references' )
			.query({
				token: 'DEV',
				object: 'user',
				objectId: 3,
				service: 'user-hub'
			})
			.expect( 200 )
			.end( ( err, res ) => {
				if ( err ) {
					return done( err );
				}
				res.body.should.be.an.Array();
				res.body.should.have.length( 1 );
				res.body.forEach( testReference );
				done();
			})
		});
	});

	describe( 'references id', function() {
		it( 'fails if token is not provided', done => noToken( '/v1/references/1', done ) );

		it( 'fails if the token isn\'t authorized', done => unauthToken( '/v1/references/1', done ) );

		it( 'provides a reference if authorized', function( done ) {
			request
			.get( '/v1/references/1' )
			.query({ token: 'DEV' })
			.expect( 200 )
			.end( ( err, res ) => {
				if ( err ) {
					return done( err );
				}
				res.body.should.be.an.Object();
				testReference( res.body );
				res.body.should.have.property( 'event' );
				res.body.event.should.be.an.Object();
				testEvent( res.body.event );
				done();
			});
		} );
	});
};

function noToken( url, done ) {
	request
	.get( url )
	.expect( 403, done );
}

function unauthToken( url, done ) {
	request
	.get( url )
	.query({ token: 'FAKE' })
	.expect( 403, done );
}

function testEvent( event ) {
	event.should.have.properties([
		'id',
		'userId',
		'officeId',
		'service',
		'message',
		'metadata',
		'delta',
		'createdAt',
		'occurredAt'
	]);
}

function testReference( reference ) {
	reference.should.have.properties([
		'id',
		'eventId',
		'service',
		'object',
		'objectId'
	]);
}
