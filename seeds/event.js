
exports.seed = ( knex, Promise ) => {

	// Deletes ALL existing entries
	return knex( 'event' ).del()

	// Inserts seed entries
	.then( () => knex( 'event' ).insert([
		{
			id: 1,
			userId: 1,
			service: 'audit-v1',
			message: 'Ephraim Gregor (US2012020038) viewed the audit system',
			occurredAt: '2016-12-19 12:00:00'
		},
		{
			id: 2,
			userId: 2,
			officeId: 1,
			service: 'user-hub-v1',
			message: 'Bob deleted Steve',
			occurredAt: '2016-12-19 11:00:00'
		}
	]) );
};
