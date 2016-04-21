var MyHandlers = require('./handlers');

var internals = {};

internals.endpoints = [
	{
		method: 'GET', 
		path: '/web/admin', 
		handler: MyHandlers.index, 
		config : {
			description: 'Get the default/home template.',
	      	notes: 'Renders the /docs/home.md file as HTML.',
	      	tags: ['api']
		}
	}, 

	{
		method: 'GET', 
		path: '/web/admin/extract/bds_com', 
		handler: MyHandlers.bdsCom, 
		config : {
			description: 'Get the default/home template.',
	      	notes: 'Renders the /docs/home.md file as HTML.',
	      	tags: ['api']
		}
	}, 
	
	{
		method: 'GET', 
		path: '/web/admin/viewall', 
		handler: MyHandlers.viewall, 
		config : {
			description: 'Get the default/home template.',
	      	notes: 'Renders the /docs/home.md file as HTML.',
	      	tags: ['api']
		}
	}
	, 
	{
		method: 'GET', 
		path: '/web/admin/deleteall', 
		handler: MyHandlers.deleteall, 
		config : {
			description: 'Get the default/home template.',
	      	notes: 'Renders the /docs/home.md file as HTML.',
	      	tags: ['api']
		}
	}
];
	

module.exports = internals;