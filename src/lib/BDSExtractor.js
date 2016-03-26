'use strict'

//extract data from bds.com

var osmosis = require('osmosis');
//html entity coding
var entities = require("entities");

var DSLoaiNhaDat = require("./LoaiNhaDat");

var BDS_NAME_MAP = {
	'Thuộc dự án' :'duAn', 
	'Địa chỉ' : 'diaChi', 
	'Mã số' : 'maSo', 
	'Loại tin rao' : 'loaiTinRao',  
	'Ngày đăng tin' : 'ngayDangTin', 
	'Ngày hết hạn': 'ngayHetHan', 
	'Số phòng ngủ': 'soPhongNgu_full', 
	'Số tầng': 'soTang_full', 
	//custInfo
	'Điện thoại' : 'cust_phone', 
	'Mobile' : 'cust_mobile', 
	'Đăng bởi' : 'cust_dangBoi', 
	'Email'		: 'cust_email',
	'Tên liên lạc' : 'tenLienLac'
}

//(x,y), x is Ban/Thue, y is loaiNhaDat
var LOAI_BDS_NAME_MAP = {
	'Bán căn hộ chung cư' :'0,1', 
	'Bán nhà biệt thự, liền kề' : '0,4',
	'Bán nhà biệt thự, liền kề (nhà trong dự án quy hoạch)' : '0,4',
	'Bán nhà riêng' : '0,2',
	'Bán nhà mặt phố' : '0,3',
	'Bán đất nền dự án' : '0,5',
	'Bán đất nền dự án (đất trong dự án quy hoạch)' :'0,5',
	'Bán trang trại, khu nghỉ dưỡng' : '0,99',
	'Bán kho, nhà xưởng' : '0,99',
	'Bán loại bất động sản khác' : '0,99',
	'Bán đất' : '0,5',
	//thue
	'Cho thuê căn hộ chung cư' : '1,1',
	'Cho thuê nhà riêng' : '1,2', 
	'Cho thuê nhà mặt phố' : "2,3", 
	'Cho thuê nhà trọ, phòng trọ' : '1,99',
	'Cho thuê văn phòng' : '1,4',
	'Cho thuê cửa hàng - ki ốt' : '1,5',
	'Cho thuê kho, nhà xưởng, đất' : '1,99',
	'Cho thuê loại bất động sản khác' : '1,99'
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
}

function _convertLoaiTinGiao(ads) {
	if (ads.loaiTinRao) {

		var mapped = LOAI_BDS_NAME_MAP[ads.loaiTinRao];
		if (!mapped) {
			console.log("WARN can't find ads.loaiTinRao:" + ads.loaiTinRao)
			return;
		}
		

		var spl = mapped.split(",");
		if (spl.length = 2) {
			ads.loaiTin = Number(spl[0]);
			ads.loaiNhaDat = Number(spl[1]);
			if (ads.loaiTin === 0) {
				ads.ten_loaiTin = "Bán";
				ads.ten_loaiNhaDat = DSLoaiNhaDat.ban[ads.loaiNhaDat];
			}

			if (ads.loaiTin === 1) {
				ads.ten_loaiTin = "Cho Thuê";
				ads.ten_loaiNhaDat = DSLoaiNhaDat.thue[ads.loaiNhaDat];
			}
		}
	}
}


function convertGia(ads) {
	if (ads.price_unit==='tỷ') {
    	ads.gia = ads.price_value*1000;
    	return;
    } 

	if (~ads.price_unit.indexOf('u/m')) { //trieu/m2
		ads.gia = ads.price_value * ads.dienTich;
		return;
	}

	if (~ads.price_unit.indexOf('nghìn/m2/tháng')) { 
		ads.gia = ads.price_value * ads.dienTich / 1000;
		return;
	}

    
	ads.gia = ads.price_value*1;
}


class BDSExtractor {
	constructor() {
	}

	extract(cridential, handleData, handleDone) {
		console.log("Starting extraction .... ");
		this.extractWithLimit(handleData, handleDone
			, Number(cridential.pageFrom), Number(cridential.pageTo)
			, cridential.rootURL);
	}

	//rootURL = http://batdongsan.com.vn/nha-dat-ban ; nha-dat-cho-thue
	extractWithLimit(handleData, handleDone, start, end, rootURL) {
		console.log("Enter extractWithLimit .... " + start + ", " + end);
		var startDate = new Date();

		var count = start-1;

		var _done = () => {
			count++;
		}


		var i = start;
		for (i=start; i<=end; i++) {
			console.log("Extracting for page: " + i);
			this.extractOnePage(rootURL + '/p'+i, handleData, _done);
		}

		var myInterval = setInterval(function(){ 
			 if (count==end) {
			 	console.log('=================> DONE in ' + (new Date() - startDate) + 'ms');
			 	clearInterval(myInterval);
			 	//handleDone();
			 }
		}, 1000);


		handleDone();

	}


	extractOnePage(url, handleData, handleDone) {
		osmosis
		.get(url)
		.find('.search-productItem')
		.set({
			'title' : '.p-title a', 
			'cover' : '.p-main > div > a > img@src'
		})
		.data(function(list) {
			
			handleData(1, list);
		})
		.follow('.p-title a@href')
		//.find('#product-detail')
		.set({
		    'title'			:'#product-detail .pm-title > h1',
		    'images'		:['#product-detail .list-img > ul > li > img@src'],
		    'price'			:'#product-detail .gia-title[1] > strong ',
		    'area'			:'#product-detail .gia-title[2] > strong ',
		    'loc'			:'#product-detail .diadiem-title', 
		    'detailLefts' 		:['#product-detail .left-detail .left'],
		    'detailRights' 		:['#product-detail .left-detail .right'], 
		    'custLefts'		:['#divCustomerInfo .left'], 
		    'custRights'	:['#divCustomerInfo .right'],
		    'hdLat'		:'.container-default input[id="hdLat"]@value',
		    'hdLong'	:'.container-default input[id="hdLong"]@value',
		    //'all' : '#product-detail '
		})
		.data(function(listing) {
			//console.log(listing.all);

		    
		    // do something with listing data
		    let ads = {
		    	title: listing.title, 
		    	images_small: listing.images, 
		    	price_value: listing.price.split(' ')[0],
		    	price_unit: listing.price.split(' ')[1], 
		    	dienTich: Number(listing.area.substr(0, listing.area.length-2)), 
		    	area_full: listing.area, 
		    	loc: listing.loc.length > 9 ? listing.loc.substring(9): '',
		    	hdLat : Number(listing.hdLat), 
		    	hdLong : Number(listing.hdLong),
		    }

		    //var {detailLefts, detailRights, custLefts, custRights} = listing;
		    // detail
		    for (var i = 0; i < listing.detailLefts.length; i++) {
		    	ads[BDS_NAME_MAP[listing.detailLefts[i]]] = listing.detailRights[i];
		    }
		    
		    // customer information : thong tin lien lac
		    for (var i = 0; i < listing.custLefts.length; i++) {
		    	//transform first:
		    	var val = listing.custRights[i];
		    	if (listing.custLefts[i]=='Email') {
		    		val = parseEmail(listing.custRights[i]);
		    	}
		    	ads[BDS_NAME_MAP[listing.custLefts[i]]] = val;	
		    }
		    //convert loai tin giao
		    _convertLoaiTinGiao(ads);
		
			//convert so phong ngu
		    if (ads.soPhongNgu_full) {
		    	ads.soPhongNgu = Number(ads.soPhongNgu_full.substr(0, 1));
		    }
		    //convert so tang
		    if (ads.soTang_full) {
		    	ads.soTang = Number(ads.soTang_full.substr(0, 1));
		    }

		     //convert gia'
		    
		    

			convertGia(ads);

		    handleData(2, ads);
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

module.exports = BDSExtractor;

