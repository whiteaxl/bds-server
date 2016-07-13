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
var striptags = require('striptags');
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
				'hdLong'	:'.container-default input[id="hdLong"]@value',
				'duAnID'    :'#form1 :source',
				'image'    :'.prjava > img@src',
				'bigImage'    :'#detail .a1  img@src'
			})
			.data(function(duan) {
				let adduan = {
					ten:  duan.name,
					tenKhongDau:  util.locDau(duan.name),
					diaChi: util.removeAllHtmlTagAndReplaceOneString(duan.diachi,"Địa chỉ:"),
					geo:{
						lat: Number(duan.hdLat),
						lon: Number(duan.hdLong)
					},
					duAnID : duan.duAnID,
					image :  duan.image,
					bigImage :  duan.bigImage
				}


				if(adduan.duAnID){
					var idx = (adduan.duAnID).indexOf("form1");
					adduan.duAnID =  (adduan.duAnID).substring(1,idx-4);
					var idx2 = (adduan.duAnID).lastIndexOf("/");
					adduan.duAnID =  (adduan.duAnID).substring(idx2+1);
					adduan.duAnID =  (adduan.duAnID).trim();
					var idx3 = (adduan.duAnID).length;
					adduan.duAnID =  (adduan.duAnID).substring(0,idx3-1);
					adduan.duAnID =  "DA_"+ (adduan.duAnID);

				}
				else{
					adduan.duAnID = "DA_" + adduan.tenKhongDau;
				}

				if(adduan.diaChi){
					adduan.diaChinh = placeUtil.getDiaChinh(adduan.diaChi);
				}
				// if(adduan.image){
				// 	adduan.bigImage = (adduan.image).replace("resize/200x150/", "");
				// }
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

