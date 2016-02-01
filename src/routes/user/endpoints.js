var UserHandlers = require('./handlers');

var internals = {};

internals.endpoints = [
	{
		method: 'GET', 
		path: '/users', 
		handler: UserHandlers.all, 
		config : {
			description: 'Get the default/home template.',
	      	notes: 'Renders the /docs/home.md file as HTML.',
	      	tags: ['api']
		}
	}

];

module.exports = internals;