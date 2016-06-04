'use strict'

//extract data from bds.com

var osmosis = require('osmosis');
//html entity coding
var entities = require("entities");
var logUtil = require("./logUtil");
var placeUtil = require('./placeUtil');
var util = require("./utils");
var DuAn = require("../dbservices/DuAn");
var duAn = new DuAn();

class DuAnExtractor {
	constructor() {
	}

	//rootURL = http://batdongsan.com.vn/cao-oc-van-phong
	extractWithLimit(rootURL, start, end) {
		console.log("Enter extractWithLimit .... " + start + ", " + end);
		var startDate = new Date();
		var count = start-1;
		var _done = () => {
			count++;
		};

		var i = start;
		for (i=start; i<=end; i++) {
			console.log("Extracting for page: " + i);
			this.extractOnePage(rootURL + '/p'+i, _done);
		}

		var myInterval = setInterval(function(){ 
			 if (count==end) {
			 	console.log('=================> DONE in ' + (new Date() - startDate) + 'ms');
			 	clearInterval(myInterval);
			 	//handleDone();
			 }
		}, 1000);
	}


	extractOnePage(url, handleDone) {
		osmosis
		.get(url)
		.find('.list2item2')
		.follow('.largefont a@href')
		.set({
		    'name'			:'.prjinfo > h1',
		    'diachi'		:'.prjinfo > div[1]',
			'hdLat'		:'.container-default input[id="hdLat"]@value',
			'hdLong'	:'.container-default input[id="hdLong"]@value'
		})
		.data(function(duan) {
			let adduan = {
				name:  duan.name,
				nameKhongDau:  util.locDau(duan.name),
				diachi: util.removeAllHtmlTagAndReplaceOneString(duan.diachi,"Địa chỉ:"),
				geo:{
					lat: Number(duan.hdLat),
					lon: Number(duan.hdLong)
				},

			}

			adduan.id = "DA_" + adduan.nameKhongDau;
			adduan.type = "DuAn";

			console.log("1111111");
			console.log(adduan);
			duAn.upsert(adduan);

			console.log("2222222");

		})
		
		.log(console.log)
		.error(console.log)
		.debug(console.log)
		.done(() => {
			console.log("Done all!");
			handleDone();
		})
	}

	
}

module.exports = DuAnExtractor;

