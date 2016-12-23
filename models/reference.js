'use strict';

/**
 * Reference model.
 *
 * Stores information about what events have affected.
 */
const bookshelf = require( '../helpers/db' ).Bookshelf;

const Reference = bookshelf.Model.extend({
	tableName: 'reference',

	event: function() {
		return this.belongsTo( require( './event' ), 'eventId' );
	},

	withEvents: function() {
		return this.query( qb => {
			qb.innerJoin( 'event', 'event.id', 'reference.eventId' )
			.select(
				'reference.*',
				'event.userId',
				'event.officeId',
				'event.message',
				'event.occurredAt',
				'event.createdAt'
			);
		});
	},

	serialize: function() {
		let attrs = bookshelf.Model.prototype.serialize.apply( this, arguments );
		const _ = require( 'lodash' );

		if ( ! _.has( attrs, 'userId' ) ) {
			return attrs;
		}

		let whitelist = [ 'userId', 'officeId', 'message', 'occurredAt', 'createdAt' ];
		let retAttrs = _.omit( attrs, whitelist );
		retAttrs.event = _.pick( attrs, whitelist );
		return retAttrs;
	}
});

module.exports = Reference;
