
exports.up = function( knex, Promise ) {
	return knex.schema.createTable( 'reference', table => {
		table.increments().primary();
		table.integer( 'eventId' ).unsigned().notNullable().index();
		table.string( 'service' ).notNullable().index();
		table.string( 'object' ).notNullable().index();
		table.integer( 'objectId' ).unsigned().notNullable().index();
	});
};

exports.down = function( knex, Promise ) {
	return knex.schema.dropTable( 'reference' );
};
