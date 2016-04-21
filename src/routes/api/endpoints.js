var Handlers = require('./handlers');

var internals = {};

internals.endpoints = [
{
	method: 'POST', 
	path: '/api/find', 
	handler: Handlers.findPOST, 
	config : {
		description: 'Get the default/home template.',
		notes: 'Renders the /docs/home.md file as HTML.',
		tags: ['api']
	}
},
{
	method: 'POST', 
	path: '/api/findGooglePlaceById', 
	handler: Handlers.findGooglePlaceById, 
	config : {
		description: 'Get google place detail by id.',
		notes: 'api',
		tags: ['api']
	}
}

];

module.exports = internals;