'use strict';

//extract data from bds.com

var osmosis = require('osmosis');
//html entity coding
var entities = require("entities");
var logUtil = require("./logUtil");
var placeUtil = require('./placeUtil');
var util = require("./utils");
var AdsModel = require("../dbservices/Ads");
var adsModel = new AdsModel();

var DACDIEM_MAP = {
	'Mã số' : "maSo",
	'Loại tin rao' : "loaiNhaDat",
	'Ngày đăng tin' : "ngayDangTin",
	'Ngày hết hạn' : "ngayHetHan",
	'Hướng nhà' : "huongNha",
	'Hướng ban công':"huongBanCong",
	'Số phòng':"soPhong",
	'Đường vào':"duongVao",
	'Mặt tiền':"matTien",
	'Số tầng':"soTang",
	'Số toilet':"soPhongTam",
	'Nội thất': "noiThat"
};


class DoThiExtractor {
	constructor() {
	}

	//rootURL = http://batdongsan.com.vn/cao-oc-van-phong
	extractWithLimit(rootURL, start, end,ngayDangTin) {
		console.log("Enter extractWithLimit .... " + start + ", " + end);
		var startDate = new Date();
		var count = start-1;
		var _done = () => {
			count++;
		};

		var i = start;
		for (i=start; i<=end; i++) {
			console.log("Extracting for page: " + i);
			this.extractOnePage(rootURL + '/p'+i, _done,ngayDangTin);
		}

		var myInterval = setInterval(function(){ 
			 if (count==end) {
			 	console.log('=================> DONE in ' + (new Date() - startDate) + 'ms');
			 	clearInterval(myInterval);
			 	//handleDone();
			 }
		}, 1000);
	}


	extractOnePage(url, handleDone,ngayDangTin) {
		osmosis
		.get(url)
		.find('.for-user')
		.follow('ul > li > a@href')
		.set({
			'title'			   :'.product-detail > h1',
			'dacDiemLabel'       :['.pd-dacdiem > table > tbody > tr > td[1]'],
			'dacDiemValue'       :['.pd-dacdiem > table > tbody > tr > td[2]'],
			'images'		:['#myGallery > ul > img@src'],
			'price'			:'.spanprice',
			'area'			:'#ContentPlaceHolder1_ProductDetail1_divprice > span[2] ',
			'chiTiet'	    :'#pd-desc-content',
			'name'			:'.product-detail > h1',
			'diachi'		:'.pd-location > a',
			'hdLat'		    :'.divmaps input[id="hddLatitude"]@value',
			'hdLong'	    :'.divmaps input[id="hddLongtitude"]@value',
			'adsID'		    :'#tbl1 > tbody > tr[1] > td[2]',
			'ngayDangTin'	:'.pd-dacdiem > table > tbody > tr[3] > td[2]',
			'dangBoiName'	:'.pd-contact > table > tbody > tr[1] > td[2]',
			'dangBoiPhone'	:'.pd-contact > table > tbody > tr[3] > td[2]'
		})
		.data(function(dothiBds) {
			console.log("dacDiemLabel=", dothiBds.dacDiemLabel);
			console.log("dacDiemValue=", dothiBds.dacDiemValue);



			let addothiBds = {
				name:  dothiBds.name,
				nameKhongDau:  util.locDau(dothiBds.name),
				title:  	dothiBds.title,
				loaiTin:  	dothiBds.loaiTin,
				images:  	dothiBds.images,
				price:  	dothiBds.price,
				area_raw:  	dothiBds.area,
				chiTiet:  	dothiBds.chiTiet,
				adsID:  	dothiBds.adsID,
				ngayDangTin:  	dothiBds.ngayDangTin,
				dangBoi:{
					name: dothiBds.dangBoiName,
					phone: dothiBds.dangBoiPhone
				},
				place:{
					diachi: 	dothiBds.diachi,
					geo:{
						lat: Number(dothiBds.hdLat),
						lon: Number(dothiBds.hdLong)
					},
				},

			}
			//Extract dacDiem
			for (var i = 0; i < dothiBds.dacDiemLabel.length; i++ ) {
				addothiBds[DACDIEM_MAP[dothiBds.dacDiemLabel[i]]] = dothiBds.dacDiemValue[i];
			}

			addothiBds.adsID = "Ads_" + addothiBds.adsID;
			addothiBds.type = "Ads-DT";



			if(addothiBds.ngayHetHan){
				var ngayHetHan = addothiBds.ngayHetHan;
				addothiBds.ngayHetHan = util.convertFormatDatetoYYYYMMDD(ngayHetHan);
			}

				console.log("11--Do THi -bds");

			 if(addothiBds.ngayDangTin){
			 	var ngayDang = addothiBds.ngayDangTin;
				 addothiBds.ngayDangTin = util.convertFormatDatetoYYYYMMDD(ngayDang);

			 	if(addothiBds.ngayDangTin == ngayDangTin){
			 		console.log("Lay dung ngay dang tin");
			 		console.log(addothiBds);
					adsModel.upsert(addothiBds);
			 	}
			 }
			console.log("22--Do THi -bds");

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

module.exports = DoThiExtractor;

