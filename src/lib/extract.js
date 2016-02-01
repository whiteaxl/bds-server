'use strict'

var internals = {};

var osmosis = require('osmosis');
//html entity coding
var entities = require("entities");

var i = 0;

//extract data from bds.com

var BDS_NAME_MAP = {
	'Thuộc dự án' :'detail_duAn',
	'Địa chỉ' : 'detail_diaChi', 
	'Mã số' : 'detail_maSo', 
	'Loại tin rao' : 'detail_loaiTinRao', 
	'Ngày đăng tin' : 'detail_ngayDangTin', 
	'Ngày hết hạn': 'detail_ngayHetHan', 
	'Số phòng ngủ': 'detail_soPhongNgu', 
	//custInfo
	'Điện thoại' : 'cust_phone', 
	'Mobile' : 'cust_mobile', 
	'Đăng bởi' : 'cust_dangBoi', 
	'Email'		: 'cust_email'
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

internals.extractBDS = function(handleData, handleDone) {
	osmosis
	.get('http://batdongsan.com.vn/nha-dat-ban')
	.find('.p-title a')
	.follow('@href')
	.find('#product-detail')
	.set({
	    'title'			:'.pm-title > h1',
	    'images'		:['.list-img > ul > li > img@src'],
	    'price'			:'.gia-title[1] > strong ',
	    'area'			:'.gia-title[2] > strong ',
	    'loc'			:'.diadiem-title', 
	    'detailLefts' 		:['.left-detail .left'],
	    'detailRights' 		:['.left-detail .right'], 
	    'custLefts'		:['#divCustomerInfo .left'], 
	    'custRights'	:['#divCustomerInfo .right']
	})
	.data(function(listing) {
	    // do something with listing data
	    let ads = {
	    	title: listing.title, 
	    	images_small: listing.images, 
	    	price_value: listing.price.split(' ')[0],
	    	price_unit: listing.price.split(' ')[1], 
	    	area: listing.area.substr(0, listing.area.length-2), 
	    	area_full: listing.area, 
	    	loc: listing.loc.length > 9 ? listing.loc.substring(9): '',
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


	    console.log(ads);

	    handleData(ads);
	})
	
	.log(console.log)
	.error(console.log)
	.debug(console.log)
	.done(() => {
		console.log("Done all!");
		handleDone();

	})
}

module.exports = internals;