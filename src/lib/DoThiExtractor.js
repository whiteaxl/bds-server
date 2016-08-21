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




class DoThiExtractor {
	constructor() {
	}

	static convertDataLoaiNhaDat(loaiNhaDat){

	if(loaiNhaDat == ('Bán nhà biệt thự, liền kề').toUpperCase())
		return 0,4;
	if(loaiNhaDat == ('Bán nhà biệt thự, liền kề (nhà trong dự án quy hoạch)').toUpperCase())
		return 0,4;
	if(loaiNhaDat == ('Bán căn hộ chung cư').toUpperCase())
		return 0,1;
	if(loaiNhaDat == ('Bán nhà riêng').toUpperCase())
		return 0,2;
	if(loaiNhaDat == ('Bán nhà mặt phố').toUpperCase())
		return 0,3;
	if(loaiNhaDat == ('Bán đất nền dự án').toUpperCase())
		return 0,5;
	if(loaiNhaDat == ('Bán đất nền dự án (đất trong dự án quy hoạch)').toUpperCase())
		return 0,5;
	if(loaiNhaDat == ('Bán trang trại, khu nghỉ dưỡng').toUpperCase())
		return 0,99;
	if(loaiNhaDat == ('Bán kho, nhà xưởng').toUpperCase())
		return 0,99;
	if(loaiNhaDat == ('Bán loại bất động sản khác').toUpperCase())
		return 0,99;
	if(loaiNhaDat == ('Bán đất').toUpperCase())
		return 0,5;
	if(loaiNhaDat == ('Cho thuê căn hộ chung cư').toUpperCase())
		return 1,1;
	if(loaiNhaDat == ('Cho thuê nhà riêng').toUpperCase())
		return 1,2;
	if(loaiNhaDat == ('Cho thuê nhà mặt phố').toUpperCase())
		return 2,3;
	if(loaiNhaDat == ('Cho thuê nhà trọ, phòng trọ').toUpperCase())
		return 1,99;
	if(loaiNhaDat == ('Cho thuê văn phòng').toUpperCase())
		return 1,4;
	if(loaiNhaDat == ('Cho thuê cửa hàng - ki ốt').toUpperCase())
		return 1,5;
	if(loaiNhaDat == ('Cho thuê kho, nhà xưởng, đất').toUpperCase())
		return 1,99;
	if(loaiNhaDat == ('Cho thuê loại bất động sản khác').toUpperCase())
		return 1,99;
}

	static convertDataHuongNha(huongNha){
		for (var i = 0; i < 9; i++ ) {
			if(huongNha == (danhMuc.HuongNha[i]).toUpperCase())
				return i;

		}
		return 0 // 0 la huong Bat ky
	}

	//rootURL = http://batdongsan.com.vn/cao-oc-van-phong
	extractWithLimit(rootURL, start, end,ngayDangTin) {
		console.log("Enter extractWithLimit .... " + start + ", " + end);
		var startDate = new Date();
		var count = start-1;
		console.log("Call me0");
		var _done = () => {
			console.log("Call me4");
			count++;
		};

		console.log("Call me1");

		var i = start;
		for (i=start; i<=end; i++) {
			let fullUrl = rootURL + '/p'+i+'.htm';
			console.log("Extracting for page: " + fullUrl);
			this.extractOnePage(fullUrl, _done,ngayDangTin);
		}

		console.log("Call me2");

		var myInterval = setInterval(function(){
			console.log("Call me3");
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
			'thongTinLienHeLabel'       :['.pd-contact > table > tr > td[1]'],
			'thongTinLienHeValue'       :['.pd-contact > table  > tr > td[2]'],
			'images'		:['#myGallery > li > img@src'],
			'price'			:'.spanprice',
			'area'			:'#ContentPlaceHolder1_ProductDetail1_divprice > span[2] ',
			'chiTiet'	    :['.pd-desc > div'],
			'name'			:'.product-detail > h1',
			'diachi'		:'.pd-location > a',
			'diachinhraw'	:'.pd-location :source',
			'hdLat'		    :'.divmaps input[id="hddLatitude"]@value',
			'hdLong'	    :'.divmaps input[id="hddLongtitude"]@value',
			'adsID'		    :'#tbl1 > tbody > tr[1] > td[2]',
			'ngayDangTin'	:['.pd-dacdiem > table > tbody > tr[3] > td[2]'],
			'dangBoiName'	:['.pd-contact > table  > tr[1] > td[2]'],
			'dangBoiPhone'	:['.pd-contact > table  > tr[3] > td[2]'],
			'dangBoiDiDong'	:['.pd-contact > table  > tr[4] > td[2]']
		})
		.data(function(dothiBds) {
			console.log("dacDiemLabel=", dothiBds.dacDiemLabel);
			console.log("dacDiemValue=", dothiBds.dacDiemValue);
			console.log("thongTinLienHeLabel=", dothiBds.thongTinLienHeLabel);
			console.log("thongTinLienHeValue=", dothiBds.thongTinLienHeValue);


			let addothiBds = {
				name:  dothiBds.name,
				nameKhongDau:  util.locDau(dothiBds.name),
				title:  	dothiBds.title,
				loaiTin:  	dothiBds.loaiTin,
				image:{
					cover:      dothiBds.images[0],
					images:  	dothiBds.images
				},
				gia:  		dothiBds.price,
				dienTich:  	dothiBds.area,
				chiTiet:  	dothiBds.chiTiet[0],
				adsID:  	dothiBds.adsID,
				ngayDangTin:  	dothiBds.ngayDangTin,
				dangBoi:{
					name: dothiBds.dangBoiName[0],
					phone: dothiBds.dangBoiPhone[0]||dothiBds.dangBoiDiDong[0]
				},
				place:{
					diaChi: 	dothiBds.diachi,
					diaChinh:{
						huyen: util.getDiaChinhFromDoThi(dothiBds.diachinhraw,dothiBds.diachi,"HUYEN"),
						tinh: util.getDiaChinhFromDoThi(dothiBds.diachinhraw,dothiBds.diachi,"TINH")
					},
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



			addothiBds.adsID = "Ads_dothi_" + addothiBds.maSo;
			addothiBds.type = "Ads";
			addothiBds.source = "DOTHI.NET";

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
			}

			if(addothiBds.ngayHetHan){
				var ngayHetHan = addothiBds.ngayHetHan;
				addothiBds.ngayHetHan = util.convertFormatDatetoYYYYMMDD(ngayHetHan);
			}

			 if(addothiBds.ngayDangTin){
			 	var ngayDang = addothiBds.ngayDangTin;
				 addothiBds.ngayDangTin = util.convertFormatDatetoYYYYMMDD(ngayDang);

			 	if(!ngayDangTin || addothiBds.ngayDangTin == ngayDangTin){
			 		console.log("Lay dung ngay dang tin");
					console.log("11--Do THi -bds");
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

