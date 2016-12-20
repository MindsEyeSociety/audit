
exports.up = function( knex, Promise ) {
	return knex.schema.createTable( 'event', table => {
		table.increments().primary();
		table.integer( 'userId' ).notNullable().index();
		table.integer( 'officeId' ).index();
		table.string( 'service' ).notNullable().index();
		table.text( 'message' );
		table.json( 'metadata' );
		table.text( 'delta' );
		table.dateTime( 'createdAt' ).notNullable().index().defaultTo( knex.raw( 'NOW()' ) );
		table.dateTime( 'occurredAt' ).notNullable().index();
	});
};

exports.down = function( knex, Promise ) {
	return knex.schema.dropTable( 'event' );
};
