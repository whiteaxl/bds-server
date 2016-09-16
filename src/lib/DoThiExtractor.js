'use strict';

//extract data from bds.com
var striptags = require('striptags');
var osmosis = require('osmosis');
//html entity coding
var entities = require("entities");
var logUtil = require("./logUtil");
var placeUtil = require('./placeUtil');
var util = require("./utils");
var danhMuc = require("./DanhMuc.js");
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

var THONGTINLIENHE_MAP = {
	'Tên liên lạc' : "tenLienLacTTLH",
	'Địa chỉ'      : "diaChiTTLH",
	'Điện thoại'   : "dienThoaiTTLH",
	'Di động'      : "diDongTTLH",
};


function convertGia(priceRaw, dienTich) {
	if (gia == 'Thỏa thuận') {
		return undefined;
	}
	
	var spl = priceRaw.split(" ");
	var price_value = spl[0];
	var price_unit = spl[1];
	
	var gia = null;
	
	if (!price_unit) {
		return gia;
	}

	if (price_unit==='tỷ' || price_unit==='Tỷ') {
		gia =price_value*1000;
		return gia;
	}

	if (~price_unit.indexOf('u/m')) { //trieu/m2
		gia = price_value * dienTich;
		return gia;
	}

	if (~price_unit.indexOf('n/m2/t') || ~price_unit.indexOf('n/m²/t')) {//nghìn/m2/tháng
		gia = price_value * dienTich / 1000;
		return gia;
	}

	gia = price_value*1;
	
	return gia;
}

var URLCache = {};

class DoThiExtractor {
	constructor() {
	}

	static convertDataLoaiNhaDat(loaiNhaDat){

	if(loaiNhaDat == ('Bán nhà biệt thự, liền kề').toUpperCase())
		return 0,3;
	if(loaiNhaDat == ('Bán nhà biệt thự, liền kề (nhà trong dự án quy hoạch)').toUpperCase())
		return 0,3;
	if(loaiNhaDat == ('Bán căn hộ chung cư').toUpperCase())
		return 0,1;
	if(loaiNhaDat == ('Bán nhà riêng').toUpperCase())
		return 0,2;
	if(loaiNhaDat == ('Bán nhà mặt phố').toUpperCase())
		return 0,4;
	if(loaiNhaDat == ('Bán đất nền dự án').toUpperCase())
		return 0,5;
	if(loaiNhaDat == ('Bán đất nền dự án (đất trong dự án quy hoạch)').toUpperCase())
		return 0,5;
	if(loaiNhaDat == ('Bán trang trại, khu nghỉ dưỡng').toUpperCase())
		return 0,7;
	if(loaiNhaDat == ('Bán kho, nhà xưởng').toUpperCase())
		return 0,8;
	if(loaiNhaDat == ('Bán loại bất động sản khác').toUpperCase())
		return 0,99;
	if(loaiNhaDat == ('Bán đất').toUpperCase())
		return 0,6;
	if(loaiNhaDat == ('Cho thuê căn hộ chung cư').toUpperCase())
		return 1,1;
	if(loaiNhaDat == ('Cho thuê nhà riêng').toUpperCase())
		return 1,2;
	if(loaiNhaDat == ('Cho thuê nhà mặt phố').toUpperCase())
		return 2,3;
	if(loaiNhaDat == ('Cho thuê nhà trọ, phòng trọ').toUpperCase())
		return 1,4;
	if(loaiNhaDat == ('Cho thuê văn phòng').toUpperCase())
		return 1,5;
	if(loaiNhaDat == ('Cho thuê cửa hàng - ki ốt').toUpperCase())
		return 1,6;
	if(loaiNhaDat == ('Cho thuê kho, nhà xưởng, đất').toUpperCase())
		return 1,7;
	if(loaiNhaDat == ('Cho thuê loại bất động sản khác').toUpperCase())
		return 1,99;
}

	static convertDataHuongNha(huongNha){
		for (var i = 0; i < 9; i++ ) {
			if(huongNha == (danhMuc.HuongNha[i]).toUpperCase())
				return i;

		}
		return undefined; // 0 la huong Bat ky ?
	}

	//rootURL = http://batdongsan.com.vn/cao-oc-van-phong
	extractWithLimit(rootURL, start, end,ngayDangTin) {
		start = Number(start);
		end = Number(end);
		console.log("Enter extractWithLimit .... " + start + ", " + end);
		var startDate = new Date();
		var count = start-1;
		var _done = () => {
			count++;
		};

		var i = start;
		for (i=start; i<=end; i++) {
			let fullUrl = rootURL + '/p'+i+'.htm';
			console.log("Extracting for page: " + fullUrl);
			this.extractOnePage(fullUrl, _done,ngayDangTin);
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
		.set({
			'url'			   :'ul > li > a@href'
		})
		.follow('ul > li > a@href')
		.set({
			'title'			   :'.product-detail > h1',
			'dacDiemLabel'       :['.pd-dacdiem > table > tbody > tr > td[1]'],
			'dacDiemValue'       :['.pd-dacdiem > table > tbody > tr > td[2]'],
			'thongTinLienHeLabel'       :['.pd-contact > table > tr > td[1]'],
			'thongTinLienHeValue'       :['.pd-contact > table  > tr > td[2]'],
			'images'		:['#myGallery > li > img@src'],
			'price_raw'			:'.spanprice',
			'area_raw'			:'#ContentPlaceHolder1_ProductDetail1_divprice > span[2]',
			'chiTiet'	    :['.pd-desc > div'],
			'diaChi'		:'.pd-location',
			'hdLat'		    :'.divmaps input[id="hddLatitude"]@value',
			'hdLong'	    :'.divmaps input[id="hddLongtitude"]@value',
			'adsID'		    :'#tbl1 > tbody > tr[1] > td[2]',
			'ngayDangTin'	:['.pd-dacdiem > table > tbody > tr[3] > td[2]'],
			'dangBoiName'	:['.pd-contact > table  > tr[1] > td[2]'],
			'dangBoiPhone'	:['.pd-contact > table  > tr[3] > td[2]'],
			'dangBoiDiDong'	:['.pd-contact > table  > tr[4] > td[2]']
		})
		.data(function(dothiBds) {
		
			//console.log("AAAAAAA=", dothiBds.url);
			
			var dc = dothiBds.diaChi.replace(/.* tại /, "");
			var spl = dc.split("-");
			
			if (spl.length < 2) {
				console.log("DiaChi khong dung:", dc, dothiBds.url);
				return;
			}
			
			var huyen = spl[spl.length-2].trim().replace("Quận ", "").replace("Huyện ", "");
			var tinh = spl[spl.length-1].trim();
			
			
			//console.log("AAAAAAA=", dc);

			let addothiBds = {
				title:  	dothiBds.title,
				loaiTin:  	dothiBds.loaiTin,
				image:{
					cover:      dothiBds.images[0],
					images:  	dothiBds.images
				},
				
				area_raw:  	dothiBds.area_raw,
				chiTiet:  	dothiBds.chiTiet[0],
				adsID:  	dothiBds.adsID,
				ngayDangTin:  	dothiBds.ngayDangTin,
				dangBoi:{
					name: dothiBds.dangBoiName[0],
					phone: dothiBds.dangBoiPhone[0]||dothiBds.dangBoiDiDong[0]
				},
				place:{
					diaChi: 	dc,
					diaChinh:{
						huyen: huyen,
						tinh: tinh
					},
					geo:{
						lat: Number(dothiBds.hdLat),
						lon: Number(dothiBds.hdLong)
					},
				},
				url : dothiBds.url,
				price_raw : dothiBds.price_raw,
				

			}
			//Extract dacDiem
			for (var i = 0; i < dothiBds.dacDiemLabel.length; i++ ) {
				addothiBds[DACDIEM_MAP[dothiBds.dacDiemLabel[i]]] = dothiBds.dacDiemValue[i];
			}

			addothiBds.dienTich = addothiBds.area_raw && Number(addothiBds.area_raw.substr(0, addothiBds.area_raw.length-2));
			
			addothiBds.gia = convertGia(addothiBds.price_raw, addothiBds.dienTich),
			addothiBds.adsID = "Ads_dothi_" + addothiBds.maSo;
			addothiBds.type = "Ads";
			addothiBds.source = "DOTHI.NET";
			if (addothiBds.gia && addothiBds.dienTich) {
				addothiBds.giaM2 = Number((addothiBds.gia/addothiBds.dienTich).toFixed(3));
			}
			
			if(addothiBds.place.diaChinh.huyen) {
				addothiBds.place.diaChinh.huyenKhongDau = util.locDau(addothiBds.place.diaChinh.huyen);
			}

			if(addothiBds.place.diaChinh.tinh) {
				addothiBds.place.diaChinh.tinhKhongDau = util.locDau(addothiBds.place.diaChinh.tinh);
			}

			if(addothiBds.loaiNhaDat){
				var loaiNhaDat = (addothiBds.loaiNhaDat).toUpperCase();
				if(loaiNhaDat.indexOf("BÁN") > -1){
					addothiBds.loaiTin = 0;
				}
				if(loaiNhaDat.indexOf("THUÊ") > -1){
					addothiBds.loaiTin = 1;
				}
				addothiBds.loaiNhaDat = DoThiExtractor.convertDataLoaiNhaDat(loaiNhaDat);
			}
			if(addothiBds.huongNha){
				var huongNha = (addothiBds.huongNha).toUpperCase();
				addothiBds.huongNha = DoThiExtractor.convertDataHuongNha(huongNha);
			} else {
				addothiBds.huongNha = undefined;
			}
			
			if (addothiBds.soPhong) {
				addothiBds.soPhongNgu = Number(addothiBds.soPhong);
			}
			addothiBds.soPhong=undefined;
	
			addothiBds.soPhongTam = addothiBds.soPhongTam ? Number(addothiBds.soPhongTam) : undefined;
			addothiBds.soTang = addothiBds.soTang ? Number(addothiBds.soTang) : undefined;

			if(addothiBds.ngayHetHan){
				var ngayHetHan = addothiBds.ngayHetHan;
				addothiBds.ngayHetHan = Number(util.convertFormatDatetoYYYYMMDD(ngayHetHan));
			} else {
				addothiBds.ngayHetHan = undefined;
			}

			if(addothiBds.ngayDangTin){
			 	var ngayDang = addothiBds.ngayDangTin;
				 addothiBds.ngayDangTin = Number(util.convertFormatDatetoYYYYMMDD(ngayDang));

			 	if(!ngayDangTin || addothiBds.ngayDangTin == ngayDangTin){
					adsModel.upsert(addothiBds);
			 	}
			 }

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

