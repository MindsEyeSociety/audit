'use strict';

/**
 * Event model.
 *
 * Stores information about specific events.
 */
const Promise   = require( 'bluebird' );

const Bookshelf = require( '../helpers/db' ).Bookshelf;
const Reference = require( './reference' );

const Event = Bookshelf.Model.extend({
	tableName: 'event',

	references: function() {
		return this.hasMany( Reference, 'eventId' );
	},

	addReferences: function( references ) {
		if ( ! references.length ) {
			return this;
		}

		return Bookshelf.transaction( t => {
			return Promise.map( references, ref => {
				ref.eventId = this.get( 'id' );
				return new Reference( ref ).save( null, { transacting: t } );
			} )
			.then( () => this );
		});
	}
});

module.exports = Event;
