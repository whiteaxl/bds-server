var Handlers = require('./handlers');

var internals = {};

internals.endpoints = [
{
	method: 'GET', 
	path: '/api/findGET', 
	handler: Handlers.findGET, 
	config : {
		description: 'Get the default/home template.',
		notes: 'Renders the /docs/home.md file as HTML.',
		tags: ['api']
	}
},
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
	path: '/api/findPlace',
	handler: Handlers.findPlace,
	config : {
		description: 'Get the default/home template.',
		notes: 'Renders the /docs/home.md file as HTML.',
		tags: ['api']
	}
},
{
	method: 'GET', 
	path: '/api/ads/getAllAds', 
	handler: Handlers.getAllAds, 
	config : {
		description: 'Get all Ads.',
		notes: 'just for test',
		tags: ['api']
	}
}


];

module.exports = internals;