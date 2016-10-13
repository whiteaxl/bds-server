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

var g_countAds = 0;
var g_countDup = 0;


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
	'Tên liên lạc' : "name",
	'Địa chỉ'      : "diaChi",
	'Điện thoại'   : "dienThoai",
	'Di động'      : "phone",
	'Email'        : "email",
};


function convertGia(priceRaw, dienTich) {
	if (gia == 'Thỏa thuận') {
		return undefined;
	}
	
	var spl = priceRaw.split(" ");
	var price_value = spl[0];
	var price_unit = priceRaw.substr(price_value.length).trim();
	
	//console.log("aaa", spl, price_unit, price_value);
	
	var gia = null;
	
	if (!price_unit) {
		return gia;
	}

	if (price_unit==='tỷ' || price_unit==='Tỷ') {
		gia =price_value*1000;
		return gia;
	}
	
	if (~price_unit.indexOf('n/m2/t') || ~price_unit.indexOf('n/m²/t')) {//nghìn/m2/tháng
		gia = price_value * dienTich / 1000;
		return gia;
	}

	if (~price_unit.indexOf('m nghìn/m')) { //Trăm nghìn/m²
		gia = price_value * dienTich / 10;
		return gia;
	}
	
	if (~price_unit.indexOf('nghìn/m')) { //nghìn/m²
		gia = price_value * dienTich / 1000;
		return gia;
	}

	if (~price_unit.indexOf('u/m')) { //tram nghin/m2
		gia = price_value * dienTich;
		return gia;
	}
	
	
	gia = price_value*1;
	
	return gia;
}


var parseEmail = function(encEmail) {
	let idx1 = encEmail.indexOf('mailto:');
	if (~idx1) {
		var idx2 = encEmail.indexOf('\'', idx1);
		if (~idx2) {
			var onlyEncEmail = encEmail.substring(idx1+7, idx2);

			return entities.decodeHTML(onlyEncEmail);
		}
	}

	return '';
};


var URLCache = {};

function handle(dothiBds) {
	// customer information : thong tin lien lac
	var dangBoi = {};
	for (var i = 1; i <= 5; i++) {
		//transform first:
		let row = dothiBds['custInfo0'+i];
		let val = row[1];
		
		if (row[0]=='Email') {
			val = parseEmail(row[1]);
		}
		dangBoi[THONGTINLIENHE_MAP[row[0]]] = val;
	}

	let addothiBds = {
		title:  	dothiBds.title,
		loaiTin:  	dothiBds.loaiTin,
		image:{
			cover:      dothiBds.images[0],
			images:  	dothiBds.images
		},
		
		area_raw:  	dothiBds.area_raw,
		chiTiet:  	dothiBds.chiTiet[0],
		ngayDangTin:  	dothiBds.ngayDangTin,
		dangBoi:dangBoi,
		
		price_raw : dothiBds.price_raw,


	};

	//Extract dacDiem
	for (var i = 0; i < dothiBds.dacDiemLabel.length; i++ ) {
		if (DACDIEM_MAP[dothiBds.dacDiemLabel[i]]) {
			addothiBds[DACDIEM_MAP[dothiBds.dacDiemLabel[i]]] = dothiBds.dacDiemValue[i];
		} else {
			logUtil.warn("Khong co feature:" + dothiBds.dacDiemLabel[i]);
		}
	}
	addothiBds.url = URLCache[addothiBds.maSo];
	if (!URLCache[addothiBds.maSo]) {
		logUtil.warn("Seem duplicate:", addothiBds.maSo);
		g_countDup++;
	}
	URLCache[addothiBds.maSo] = null;
	
	//Convert diaChi, diaChinh
	if (!dothiBds.diaChi) {
		logUtil.error("Khong co' thong tin diaChi");
	} else {
		var dc = dothiBds.diaChi.replace(/.* tại /, "");
		var dcObj = null;
		
		var spl = dc.split("-");
		if (spl.length < 2) {
			logUtil.error("DiaChi khong dung:", dc, dothiBds.url);
			return;
		} else {
			dcObj = {
				huyen : spl[spl.length-2].trim().replace("Quận ", "").replace("Huyện ", ""),
				tinh : spl[spl.length-1].trim()
			};

			dcObj.l3 = null;

			if (spl.length > 2) {
				for (var j = 0; j <= spl.length-3; j++) {
					if (!dcObj.l3) {
						dcObj.l3 = spl[j].trim()
					} else {
						dcObj.l3 += "-" + spl[j].trim();
					}
				}
			}

			if (!dcObj.l3) {
				logUtil.warn("DiaChi khong co thong tin L3:", dc, dothiBds.url);
			}

		}

		if (dcObj.l3) {
			if (dothiBds.extMaProject && dothiBds.extMaProject != "-1" && dothiBds.extMaProject != "0") {
				dcObj.duAn = dcObj.l3.replace("Khu đô thị ", "").replace("KĐT ", "");
				dcObj.duAnKhongDau = util.locDau(dcObj.l3);
			} else if (dothiBds.extMaWard && dothiBds.extMaWard != "0" && dcObj.l3.indexOf("Đường")!=0) {
				let ten = dcObj.l3.replace("Thị trấn ", "").replace("Xã ", "").replace("Phường ", "");
				dcObj.xa = ten;
				dcObj.xaKhongDau = util.locDau(ten);
			} else if (dothiBds.extMaStreet && dothiBds.extMaStreet != "0") {
				dcObj.duong = dcObj.l3;
				dcObj.duongKhongDau = util.locDau(dcObj.l3);
			}
		}

		addothiBds.place = {
			diaChi: dc,
			diaChinh:dcObj,
			geo:{
				lat: Number(dothiBds.hdLat),
				lon: Number(dothiBds.hdLong)
			},
		}
	}
	
	addothiBds.dienTich = addothiBds.area_raw && Number(addothiBds.area_raw.substr(0, addothiBds.area_raw.length-2));
	
	addothiBds.gia = convertGia(addothiBds.price_raw, addothiBds.dienTich),


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
		addothiBds.loaiNhaDat = DoThiExtractor.convertDataLoaiNhaDat(loaiNhaDat)[1];
		addothiBds.extLoaiNhaDat = loaiNhaDat;
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
		addothiBds.ngayHetHan = util.convertFormatDatetoYYYYMMDD(ngayHetHan);
	} else {
		addothiBds.ngayHetHan = undefined;
	}

	addothiBds.extMaCity = dothiBds.extMaCity;
	addothiBds.extMaDist = dothiBds.extMaDist;
	addothiBds.extMaWard = dothiBds.extMaWard;
	addothiBds.extMaStreet = dothiBds.extMaStreet;
	addothiBds.extMaDirection = dothiBds.extMaDirection;
	addothiBds.extMaStreet = dothiBds.extMaStreet;
	addothiBds.extMaProject = dothiBds.extMaProject;
	addothiBds.extMaRoom = dothiBds.extMaRoom;
	addothiBds.extDiaDiem = dothiBds.extDiaDiem;

	addothiBds.type = "Ads_Raw";
	addothiBds.adsID = "Ads_Raw_DoThi_" + addothiBds.maSo;
	if(addothiBds.ngayDangTin){
	 	var ngayDang = addothiBds.ngayDangTin;
		addothiBds.ngayDangTin = util.convertFormatDatetoYYYYMMDD(ngayDang);
	}

	adsModel.upsert(addothiBds);
}

class DoThiExtractor {
	constructor() {
	}

	static convertDataLoaiNhaDat(loaiNhaDat){

	if(loaiNhaDat.indexOf(('Bán nhà biệt thự, liền kề').toUpperCase()) != -1)
		return [0,3];
	if(loaiNhaDat.indexOf(('Bán căn hộ chung cư').toUpperCase()) != -1)
		return [0,1];
	if(loaiNhaDat.indexOf(('Bán nhà riêng').toUpperCase()) > -1)
		return [0,2];
	if(loaiNhaDat.indexOf(('Bán nhà mặt phố').toUpperCase()) > -1)
		return [0,4];
	if(loaiNhaDat.indexOf(('Bán đất nền dự án').toUpperCase()) > -1)
		return [0,5];
	if(loaiNhaDat.indexOf(('Bán trang trại, khu nghỉ dưỡng').toUpperCase()) > -1)
		return [0,7];
	if(loaiNhaDat.indexOf(('Bán kho, nhà xưởng').toUpperCase()) > -1)
		return [0,8];
	if(loaiNhaDat.indexOf(('Bán loại bất động sản khác').toUpperCase())> -1)
		return [0,99];
	if(loaiNhaDat.indexOf(('Bán đất').toUpperCase())>-1)
		return [0,6];

	if(loaiNhaDat.indexOf(('Cho thuê căn hộ chung cư').toUpperCase()) > -1)
		return [1,1];
	if(loaiNhaDat.indexOf(('Cho thuê nhà riêng').toUpperCase()) > -1)
		return [1,2];
	if(loaiNhaDat.indexOf(('Cho thuê nhà mặt phố').toUpperCase()) > -1)
		return [2,3];
	if(loaiNhaDat.indexOf(('Cho thuê nhà trọ, phòng trọ').toUpperCase()) > -1)
		return [1,4];
	if(loaiNhaDat.indexOf(('Cho thuê văn phòng').toUpperCase()) > -1)
		return [1,5];
	if(loaiNhaDat.indexOf(('Cho thuê cửa hàng, ki ốt').toUpperCase()) > -1)
		return [1,6];
	if(loaiNhaDat.indexOf(('Cho thuê kho, nhà xưởng, đất').toUpperCase()) > -1)
		return [1,7];
	if(loaiNhaDat.indexOf(('Cho thuê loại bất động sản khác').toUpperCase()) > -1)
		return [1,99];

	return [undefined, undefined];
}

	static convertDataHuongNha(huongNha){
		for (var i = 0; i < 9; i++ ) {
			if(huongNha == (danhMuc.HuongNha[i]).toUpperCase())
				return i;

		}
		return undefined; // 0 la huong Bat ky ?
	}

	//rootURL = http://batdongsan.com.vn/cao-oc-van-phong
	extractWithLimit(rootURL, depth) {
		
		var startDate = new Date();
		var _done = () => {
			console.log('=================> DONE in ' + (new Date() - startDate) + 'ms' + ', countAds:' + g_countAds + ", countDup=" + g_countDup );
		};

		this.extractOnePage(rootURL, _done, depth);
	}


//depth: diaChinh level, 0 mean no dive into into any level, 3 mean dive into XA
	extractOnePage(url, handleDone, depth) {
		let osmosisRoot  = 	osmosis.get(url);
		depth = depth || 0;
		
		for (var i=0; i < depth; i++) {
			console.log("Will dive into one more level");
			osmosisRoot = osmosisRoot.follow('#ulProductCount > li > h4 > a@href');
		}
		
		osmosisRoot
		.paginate(".pager_controls a[title!='P1']:has(.style-pager-button-next-first-last)[1]", 100)
		
		.set({
			'urls'	:['.for-user ul > li > a@href']
		})
		.data((dat => {
			//console.log("NNNNNNN:", dat.nexts, dat.nextsLabel);
			
			dat.urls.forEach((url) => {
				let idx = url.lastIndexOf("-");
				let tail = url.substr(idx+3);
				let code = tail.substr(0, tail.length-4);
				
				URLCache[code] = url;
			})
		}))
		
		.follow('.for-user ul > li > a@href')
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
			'diaChi'		  :'.pd-location',
			'hdLat'		    :'.divmaps input[id="hddLatitude"]@value',
			'hdLong'	    :'.divmaps input[id="hddLongtitude"]@value',
			'ngayDangTin'	:['.pd-dacdiem > table > tbody > tr[3] > td[2]'],
			'custInfo01'	:['.pd-contact > table  > tr[1] > td'],
			'custInfo02'	:['.pd-contact > table  > tr[3] > td'],
			'custInfo03'	:['.pd-contact > table  > tr[4] > td'],
			'custInfo04'	:['.pd-contact > table  > tr[2] > td'],
			'custInfo05'	:['.pd-contact > table  > tr[5] > td'],
			'extMaCity'        :'#hddcboCity@value',
			'extMaDist'        :'#hddcboDist@value',
			'extMaWard'        :'#hddcboWard@value',
			'extMaStreet'      :'#hddcboStreet@value',
			'extMaDirection'   :'#hddcboDirection@value',
			'extMaRoom'        :'#hddcboRoom@value',
			'extMaProject'     :'#hddcboProject@value',
			'extDiaDiem'       :'#hddDiadiem@value',

		})
		.data(function(dothiBds) {
			try {
				g_countAds++;

				handle(dothiBds);
			} catch(e) {
				logUtil.error("CANT EXTRACT",e, dothiBds);
				logUtil.error("CANT EXTRACT STACK",e.stack);
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

