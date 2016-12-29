const router = require( 'express' ).Router();

// Fake Hub endpoint for unit tests.
router.get( '/dev/office/verify/orgunit/1', ( req, res ) => {
	if ( 'DEV' === req.query.token ) {
		return res.json({ success: true });
	}
	return res.status( 403 ).json({ status: 403, message: 'Token failed auth' });
});

module.exports = router;
