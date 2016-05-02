// Load modules
var MyHandlers = require('./handlers');

var internals = {};
// API Server Endpoints
internals.endpoints = [
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
,{ 
	method: 'GET',
	path: '/web/index.html', 
	handler: function(requet,reply){
		reply.view('index.html');
	}
}
,{ 
	method: 'GET',
	path: '/web/index_content.html', 
	handler: function(requet,reply){
		reply.view('index_content.html');
	}
}
,{ 
	method: 'GET',
	path: '/web/search/{p*}', 
	handler: function(requet,reply){
		reply.view('index.html');
	}
}
,{ 
	method: 'GET',
	path: '/web/list', 
	handler: function(requet,reply){
		reply.view('index.html', { page: 'list' });
	}
}
];

module.exports = internals;