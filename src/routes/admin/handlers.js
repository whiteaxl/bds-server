
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
	var countInsert  = 0;
	var countExisted  = 0;
	var start = new Date();

	Extract.extractBDS((adsDto) => {
		adsDto._type = "Ads"

		myBucket.upsert(adsDto.title, adsDto, function(err, res) {
			if (err) throw err;
		})

		/*
		Ads.findOneAndUpdate({title: adsDto.title}, adsDto, {upsert: true}, function(err, one) {
			if (err) throw err;

			countExisted++;
		})
		*/
	}
	,() => { //done all handle
		var duration = new Date() - start;
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
		console.log(allAds);

		if (!allAds)
			allAds = [];

	  	reply.view('admin/viewall', {allAds:allAds}).header('content-type','text/html; charset=utf-8');
	});

}

module.exports = internals;