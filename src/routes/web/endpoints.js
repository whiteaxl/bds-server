// Load modules
var MyHandlers = require('./handlers');

var internals = {};
// API Server Endpoints
internals.endpoints = [
{
	method: 'GET', 
	path: '/home/{somthingss*}', 
	handler: {
		directory: {
			path: '../../web/index.html',
			index: true
		}
	}
}, 
{
	method: 'GET', 
	path: '/api/houses/find', 
	handler: MyHandlers.findHouse, 
	config : {
		description: 'Get the default/home template.',
		notes: 'Renders the /docs/home.md file as HTML.',
		tags: ['api']
	}
}

//{ method: 'GET', path: '/api/houses/find', config: house.findHouse},
//{ method: 'POST', path: '/api/houses/create', config: house.createHouse},
//{ method: 'GET', path: '/{somethingss*}', config: Static.get }
];

module.exports = internals;