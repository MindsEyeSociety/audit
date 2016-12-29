'use strict';

const supertest = require( 'supertest' );
const should    = require( 'should' );
const Promise   = require( 'bluebird' );

const Event     = require( '../models/event' );
const Reference = require( '../models/reference' );

const request   = supertest( 'localhost:' + ( process.env.INTERNAL_PORT || '3030' ) );

module.exports = function() {
	describe( 'events', function() {
		it( 'fails if requested over insecure port', function( done ) {
			supertest( 'localhost:' + ( process.env.PORT || '3000' ) )
			.post( '/v1/events' )
			.expect( 403, done );
		});

		it( 'fails if no body is provided', function( done ) {
			request
			.post( '/v1/events' )
			.expect( 400, done );
		});

		let props = [ 'userId', 'service', 'message', 'occurredAt' ];
		props.forEach( prop => {
			it( `fails if missing param ${prop}`, function( done ) {
				let body = {
					userId: 1,
					service: 'audit-test',
					message: 'Test',
					occurredAt: Date.now()
				};
				delete body[ prop ];

				request
				.post( '/v1/events' )
				.send( body )
				.expect( 400, done );
			});
		});

		it( 'returns success on valid body', function( done ) {
			request
			.post( '/v1/events' )
			.send({
				userId: 1,
				service: 'audit-test',
				message: 'Test',
				occurredAt: Date.now()
			})
			.expect( 200 )
			.end( ( err, res ) => {
				if ( err ) {
					done( err );
				}
				res.body.should.be.an.Object();
				res.body.should.have.property( 'success', true );
				done();
			});
		});

		it( 'saves an event in the database', function( done ) {
			request
			.post( '/v1/events' )
			.send({
				userId: 2,
				service: 'audit-test',
				message: 'Test',
				occurredAt: Date.now()
			})
			.expect( 200 )
			.end( ( err, res ) => {
				if ( err ) {
					done( err );
				}

				new Event({ userId: 2, service: 'audit-test' })
				.fetch()
				.then( row => {
					let data = row.toJSON();
					data.should.have.properties([
						'userId',
						'service',
						'id',
						'officeId',
						'message',
						'delta',
						'createdAt',
						'occurredAt'
					]);
					done();
				})
				.catch( err => done( err ) );
			});
		});

		it( 'saves a reference in the database', function( done ) {
			request
			.post( '/v1/events' )
			.send({
				userId: 3,
				service: 'audit-test',
				message: 'Test',
				occurredAt: Date.now(),
				references: [{
					service: 'audit-test',
					object: 'test',
					objectId: 1
				}]
			})
			.expect( 200 )
			.end( ( err, res ) => {
				if ( err ) {
					done( err );
				}

				// Delay, as saving the references takes a bit longer.
				Promise.delay( 100 ).then( () => {
					new Reference({ service: 'audit-test' })
					.fetch({ require: true })
					.then( row => {
						let data = row.toJSON();
						data.should.have.properties([
							'id',
							'service',
							'eventId',
							'object',
							'objectId'
						]);
						done();
					})
					.catch( err => done( err ) );
				});
			});
		} );

		after( 'cleanup', function( done ) {
			Promise.join(
				Event.where({ service: 'audit-test' }).destroy(),
				Reference.where({ service: 'audit-test' }).destroy(),
				() => done()
			);
		});
	});
};
