'use strict';

var Boom = require('boom');
//var Ads = require('../../database/models/Ads');

var couchbase = require('couchbase');
var ViewQuery = couchbase.ViewQuery;
var myBucket = require('../../database/mydb');
myBucket.operationTimeout = 120000;//2 minutes


var Extract = require('../../lib/extract');


var PlacesModel = require('../../dbservices/Place');


var internals = {};

internals.index = function(req, reply) {
	reply.view('admin/index')
};


internals.bdsCom = function(req, reply) {
	console.log(req.query);

    var isSync = req.query.isSync;
	

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
		//from ads header, just store it
		if (from===1) {
			headers[adsDto.title] = adsDto;
			return;
		}

		let adsObj = {};

		adsObj._type = "Ads";
		let coverSmall = headers[adsDto.title] ? headers[adsDto.title].cover : null;
		/*
        let images = [];
		if (adsDto.images_small) {
			for (var i in adsDto.images_small) {
				images[i] = adsDto.images_small[i].replace("80x60", "745x510");
			}
		}
		*/

		adsObj.image = {
			//cover: coverSmall.replace("120x90", "745x510"),
            cover: coverSmall,
			//cover_small : coverSmall,
			//images_small : adsDto.images_small,
			images : adsDto.images_small
		};

        adsObj.title = adsDto.title;


		adsObj.dangBoi = {
			userID : adsDto.cust_email,
			email: adsDto.cust_email,
			name: adsDto.cust_dangBoi,
			phone: adsDto.cust_phone || adsDto.cust_mobile
		};
		adsObj.ngayDangTin = adsDto.ngayDangTin;
		adsObj.gia = adsDto.gia;
		adsObj.price_raw = adsDto.price_raw;
		adsObj.dienTich = adsDto.dienTich;
		adsObj.area_raw = adsDto.area_raw;
		adsObj.place = adsDto.place;
		adsObj.place.diaChinhFullName = adsDto.diaChi;
		adsObj.soPhongNgu = adsDto.soPhongNgu;
		adsObj.soPhongTam = adsDto.soPhongTam;
		adsObj.soTang = adsDto.soTang;
		adsObj.loaiTin = adsDto.loaiTin;
		adsObj.loaiNhaDat = adsDto.loaiNhaDat;
		adsObj.ten_loaiTin = adsDto.ten_loaiTin;
		adsObj.ten_loaiNhaDat = adsDto.ten_loaiNhaDat;
		adsObj.chiTiet = adsDto.chiTiet;
		adsObj.huongNha = adsDto.huongNha;
		adsObj.maSo = Number(adsDto.maSo);

		if (adsObj.gia && adsObj.dienTich) {
			adsObj.giaM2 = Number((adsObj.gia/adsObj.dienTich).toFixed(3));
		}

        adsObj.adsID = "Ads_bds_" + adsObj.maSo;

		countInsert++;

		myBucket.upsert(adsObj.adsID, adsObj, function(err, res) {
			if (err) {
				console.log("ERROR:" + err);
			}
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

internals.viewall = function(req, reply) {
	var query = ViewQuery.from('ads', 'all_ads');
	myBucket.query(query, function(err, allAds) {
		if (!allAds)
			allAds = [];
		console.log("Number of ads: " + allAds.length);

	  	reply.view('admin/viewall', {allAds:allAds}).header('content-type','text/html; charset=utf-8');
	});

};

internals.deleteall = function(req, reply) {
	var query = ViewQuery.from('ads', 'all_ads');
	myBucket.query(query, function(err, allAds) {
		console.log("Number of ads: " + allAds.length);
		if (!allAds)
			allAds = [];

		console.log("Found " + allAds.length + " documents to delete");
	    for(var i in allAds) {
	    	console.log("Deleting " + allAds[i].id);

	        myBucket.remove(allAds[i].id, function(error, result) {
	            console.log("Deleting " + allAds[i].title);
	        });
	    }

	    reply({result:'Done', Count: allAds.length})
	});

};

module.exports = internals;