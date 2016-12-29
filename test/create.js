'use strict';

const supertest = require( 'supertest' );
const should    = require( 'should' );

const request   = supertest( 'localhost:' + ( process.env.INTERNAL_PORT || '3030' ) );

module.exports = function() {
	describe( 'events', function() {
		it( 'fails if requested over insecure port' );

		it( 'fails if no body is provided' );

		let props = [ 'userId', 'service', 'message', 'occurredAt' ];
		props.forEach( prop => {
			it( `fails if missing param ${prop}` );
		});

		it( 'returns success on valid body' );

		it( 'saves an event in the database' );

		it( 'saves a reference in the database' );

		after( 'cleanup', function( done ) {
			done();
		});
	});
};
