
exports.seed = ( knex, Promise ) => {

	// Deletes ALL existing entries
	return knex( 'reference' ).del()

	// Inserts seed entries
	.then( () => knex( 'reference' ).insert([
		{
			id: 1,
			eventId: 2,
			service: 'user-hub',
			object: 'user',
			objectId: 3
		}
	]) );
};
