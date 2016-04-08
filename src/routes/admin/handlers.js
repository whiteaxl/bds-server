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
		let coverSmall = headers[adsDto.title].cover;
		let images = [];
		if (adsDto.images_small) {
			for (var i in adsDto.images_small) {
				images[i] = adsDto.images_small[i].replace("80x60", "745x510");
			}
		}

		adsObj.image = {
			cover: coverSmall.replace("120x90", "745x510"),
			cover_small : coverSmall,
			images_small : adsDto.images_small,
			images : images
		};
		adsObj.adsID = adsDto.title;
		adsObj.dangBoi = {
			userID : adsDto.cust_email,
			email: adsDto.cust_email,
			name: adsDto.cust_dangBoi,
			phone: adsDto.cust_phone || adsDto.cust_mobile,
		};
		adsObj.ngayDangTin = adsDto.ngayDangTin;
		adsObj.gia = adsDto.gia;
		adsObj.dienTich = adsDto.dienTich;
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


internals.test = function(req, reply) {
	reply.view('admin/a');
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

internals.api_usage = function(req, reply) {
	reply.view('admin/api_usage.md').header('content-type','text/html; charset=utf-8');
};

internals.loadData = function(req, reply) {
	let jsonFileName = req.query.jsonFileName;
	let jsonFileNameQuan = req.query.jsonFileNameQuan;

	if (jsonFileName) {
		let myPlacesModel = new PlacesModel(myBucket);

		var data = require('../../../test/data/' + jsonFileName + ".json");
		
		for (var i in data.tinh) {
			console.log("i=" + i);
			data.tinh[i].fullName = data.tinh[i].placeName;

			myPlacesModel.upsert(data.tinh[i]);	
		}
	}

    if (jsonFileNameQuan) {
        let myPlacesModel = new PlacesModel(myBucket);

        var data = require('../../../test/data/' + jsonFileNameQuan + ".json");

        for (var i in data.quan) {
            console.log("i=" + i);
			data.quan[i].fullName = data.quan[i].placeName + ", " + data.quan[i].parentName;

            myPlacesModel.upsert(data.quan[i]);
        }
    }


    reply.view('admin/loadData');
}





module.exports = internals;