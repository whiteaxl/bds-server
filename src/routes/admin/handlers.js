
var Boom = require('boom');
//var Ads = require('../../database/models/Ads');

var couchbase = require('couchbase');
var ViewQuery = couchbase.ViewQuery;
var myBucket = require('../../database/mydb')

var Extract = require('../../lib/extract')

var internals = {};

internals.index = function(req, reply) {
	reply.view('admin/index')
};


internals.bdsCom = function(req, reply) {
	console.log(req.query);
	

	var countInsert  = 0;
	var countExisted  = 0;
	var duration = 0;

	if (!req.query.pageFrom || !req.query.pageTo) {
		reply.view('admin/extract_bds_com', {
			duration: duration,
			count: countInsert + countExisted,
			countInsert: countInsert
		});

		return;
	}

	//when having parameter

	var start = new Date();
	var headers = {};

	Extract.extractBDS(req.query,(from, adsDto) => {
		//from header, just store it
		if (from===1) {
			headers[adsDto.title] = adsDto;
			return;
		}

		adsDto._type = "Ads"
		//get cover from header obj (merge)
		adsDto.cover = headers[adsDto.title].cover;

		countInsert++;

		myBucket.operationTimeout = 120000;//2 minutes


		myBucket.upsert(adsDto.title, adsDto, function(err, res) {
			if (err) {
				console.log("ERROR:" + err);
			};
		})
	}
	,() => { //done all handle
		duration = new Date() - start;
		reply.view('admin/extract_bds_com', {
			duration: duration,
			count: countInsert + countExisted,
			countInsert: countInsert
		});
	});
};


internals.test = function(req, reply) {
	reply.view('admin/a');
}

internals.viewall = function(req, reply) {
	var query = ViewQuery.from('ads', 'all_ads');
	myBucket.query(query, function(err, allAds) {
		if (!allAds)
			allAds = [];
		console.log("Number of ads: " + allAds.length);

	  	reply.view('admin/viewall', {allAds:allAds}).header('content-type','text/html; charset=utf-8');
	});

}

internals.deleteall = function(req, reply) {
	var query = ViewQuery.from('ads', 'all_ads');
	myBucket.query(query, function(err, allAds) {
		console.log("Number of ads: " + allAds.length);
		if (!allAds)
			allAds = [];

		console.log("Found " + allAds.length + " documents to delete");
	    for(i in allAds) {
	    	console.log("Deleting " + allAds[i].id);

	        myBucket.remove(allAds[i].id, function(error, result) {
	            console.log("Deleting " + allAds[i].title);
	        });
	    }

	    reply({result:'Done', Count: allAds.length})
	});

}

internals.api_usage = function(req, reply) {
	reply.view('admin/api', {allAds:allAds}).header('content-type','text/html; charset=utf-8');
}




module.exports = internals;