
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
		reply(allAds);
	  	//reply.view('admin/viewall', {allAds:allAds}).header('content-type','text/html; charset=utf-8');
	});
};

module.exports = internals;