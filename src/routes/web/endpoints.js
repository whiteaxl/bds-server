// Load modules
var MyHandlers = require('./handlers');
var MobileDetect = require('mobile-detect');
    

var internals = {};
function convertMobilePath(request){
	 var path = request.url.path;
	 var mobilePath = "/web/mobile" + path.replace("/web","");
	 console.log("mobile path1 " + mobilePath);
	 // console.log("tim log " + JSON.stringify(request.connection.info));
	 return mobilePath;
}
function convertDesktopPath(request){
	 var path = request.url.path;
	 // var mobilePath = "/web/mobile" + path.replace("/web","");
	 // console.log("mobile path1 " + mobilePath);
	 // // console.log("tim log " + JSON.stringify(request.connection.info));
	 return path.replace("/mobile/","/");
}
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
		var md = new MobileDetect(requet.headers['user-agent']);
		if(md.mobile()){
			// reply.view('./mobile/index.html');
			reply.redirect("/web/mobile/index.html");
		}else{
			reply.view('index.html');
		}
		
	}
}
,{ 
	method: 'GET',
	path: '/web/mobile/index.html', 
	handler: function(requet,reply){
		var md = new MobileDetect(requet.headers['user-agent']);
		if(md.mobile()){
			reply.view('./mobile/index.html');
		}else{
			reply.redirect("/web/index.html");
		}
		
	}
}
// ,{ 
// 	method: 'GET',
// 	path: '/web/index_content.html', 
// 	handler: function(requet,reply){
// 		reply.view('index_content.html');
// 	}
// }
,{ 
	method: 'GET',
	path: '/web/search/{p*}', 
	handler: function(requet,reply){
		var md = new MobileDetect(requet.headers['user-agent']);
		if(md.mobile()){			
			//reply.view('mobile/index.html');
			reply.redirect(convertMobilePath(requet));
		}else{
			reply.view('index.html');
		}
	}
}
,{ 
	method: 'GET',
	path: '/web/mobile/search/{p*}', 
	handler: function(requet,reply){
		var md = new MobileDetect(requet.headers['user-agent']);
		if(md.mobile()){			
			reply.view('mobile/index.html');
			
		}else{
			// reply.view('index.html');
			reply.redirect(convertDesktopPath(requet));
		}
	}
}
,{ 
	method: 'GET',
	path: '/web/searchdc/{p*}', 
	handler: function(requet,reply){
		var md = new MobileDetect(requet.headers['user-agent']);
		if(md.mobile()){			
			reply.view('mobile/index.html');
			//reply.redirect(convertMobilePath(requet));
		}else{
			reply.view('index.html');
		}
	}
}
,{ 
	method: 'GET',
	path: '/web/list/{p*}', 
	handler: function(requet,reply){	
		

		var md = new MobileDetect(requet.headers['user-agent']);
		if(md.mobile()){			
			//reply.redirect(convertMobilePath(requet));
			reply.view('mobile/index.html');

		}else{
			reply.view('index.html', { page: 'list' });
		}
	}
}
,{ 
	method: 'GET',
	path: '/web/detail/{p*}', 
	handler: function(requet,reply){
		var md = new MobileDetect(requet.headers['user-agent']);
		if(md.mobile()){			
			reply.view('mobile/index.html');
		}else{
			reply.view('index.html');
		}
	}
},
{ 
	method: 'GET',
	path: '/web/resetPassword', 
	handler: function(requet,reply){
		var md = new MobileDetect(requet.headers['user-agent']);
		if(md.mobile()){			
			reply.view('mobile/index.html');
		}else{
			reply.view('index.html');
		}
	},
	config:{
		auth: 'jwt'
	}
	
},
{ 
	method: 'GET',
	path: '/web/dangtin', 
	handler: function(requet,reply){
		var md = new MobileDetect(requet.headers['user-agent']);
		if(md.mobile()){			
			reply.view('mobile/index.html');
		}else{
			reply.view('index.html');
		}
	}
	// ,
	// config:{
	// 	auth: 'jwt'
	// }	
}


];

module.exports = internals;