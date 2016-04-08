
var Boom = require('boom');
var couchbase = require('couchbase');
var ViewQuery = couchbase.ViewQuery;
var myBucket = require('../../database/mydb');
var QueryOps = require('../../lib/QueryOps');

var internals = {};

internals.all = function(req, reply) {
	
};

internals.findHouse = function(req, reply) {
	var query = ViewQuery.from('ads', 'all_ads');
	myBucket.query(query, function(err, allAds) {
		console.log("Number of ads: " + allAds.length);

		if (!allAds)
			allAds = [];
		for (i = 0; i < allAds.length; i++) { 
    		var ads = allAds[i];
    		if(allAds[i].value.place){
    			if(allAds[i].value.place.geo){
	    			allAds[i].map={
	    				center: {
							latitude: 	allAds[i].value.place.geo.lat,
							longitude: 	allAds[i].value.place.geo.lon
						},
	    				marker: {
							id: i,
							coords: {
								latitude: 	allAds[i].value.place.geo.lat,
								longitude: 	allAds[i].value.place.geo.lon
							},
							data: 'test'
						},
						options:{
							scrollwheel: false
						},
						zoom: 14	
	    			}
	    					
				}
    		}
    		
		}


		//var ads =  allAds[0];
		
		reply([allAds[0]]);
	  	//reply.view('admin/viewall', {allAds:allAds}).header('content-type','text/html; charset=utf-8');
	});
};

module.exports = internals;