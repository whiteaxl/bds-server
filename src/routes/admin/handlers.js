
var Boom = require('boom');
var Ads = require('../../database/models/Ads');

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
		Ads.findOne({title: adsDto.title}, function(err, one) {
			if (err) throw err;

			if (!ads) {
				console.log("Existed " + adsDto.title);
				countExisted++;
				return;	
			}
			
			var ads = new Ads(adsDto)
			ads.save((err, ads) => {
				if (err) {
					throw err;
				}
				//done one
				countInsert++;
			});			
		});
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
	Ads.find({}, function(err, allAds) {
		if (err) throw err;

		reply.view('admin/viewall', {allAds:allAds}).header('content-type','text/html; charset=utf-8');
	})
	
}

module.exports = internals;