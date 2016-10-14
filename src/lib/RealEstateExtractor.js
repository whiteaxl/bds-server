'use strict'

//extract data from bds.com

var osmosis = require('osmosis');
//html entity coding
var entities = require("entities");

var logUtil = require("./logUtil");
var placeUtil = require('./placeUtil');
var util = require("./utils");
var AdsModel = require("../dbservices/Ads");
var adsModel = new AdsModel();

var URLCache = {};
var g_countAds = 0;
var g_countDup = 0;


var REALESTATE_NAME_MAP = {
	'Thuộc dự án' :'duAn',
	'Địa chỉ' : 'diaChi',
	'Mã số' : 'maSo',
	'Loại tin rao' : 'loaiTinRao',
	'Ngày đăng tin' : 'ngayDangTin',
	'Ngày hết hạn': 'ngayHetHan',
	'Số phòng ngủ': 'soPhongNgu_full',
	'Số tầng': 'soTang_full',
	'Số toilet': 'soPhongTam_full',
	'Nội thất': 'noiThat',
	//custInfo
	'cust Điện thoại' : 'cust_phone',
	'cust Mobile' : 'cust_mobile',
	'cust Đăng bởi' : 'cust_dangBoi',
	'cust Email'		: 'cust_email',
	'cust Tên liên lạc' : 'tenLienLac',
	'cust Địa chỉ' : 'cust_diaChi'
}

//(x,y), x is Ban/Thue, y is loaiNhaDat
var REALESTATE_TYPE_NAME_MAP = {
	'Bán nhà biệt thự, liền kề' : '0,3',
	'Bán căn hộ chung cư' :'0,1',
	'Bán nhà riêng' : '0,2',
	'Bán nhà mặt phố' : '0,4',
	'Bán đất nền dự án' : '0,5',
	'Bán trang trại, khu nghỉ dưỡng' : '0,7',
	'Bán kho, nhà xưởng' : '0,8',
	'Bán loại bất động sản khác' : '0,99',
	'Bán đất' : '0,6',
	//thue
	'Cho thuê căn hộ chung cư' : '1,1',
	'Cho thuê nhà riêng' : '1,2',
	'Cho thuê nhà mặt phố' : "1,3",
	'Cho thuê nhà trọ, phòng trọ' : '1,4',
	'Cho thuê văn phòng' : '1,5',
	'Cho thuê cửa hàng - ki ốt' : '1,6',
	'Cho thuê kho, nhà xưởng, đất' : '1,7',
	'Cho thuê loại bất động sản khác' : '1,99',
  'Cho thuê cửa hàng, ki ốt' :  '1,6'
};


var parseEmail = function(encEmail) {
	let idx1 = encEmail.indexOf('mailto:');
	if (~idx1) {
		let idx2 = encEmail.indexOf('\'', idx1);
		if (~idx2) {
			var onlyEncEmail = encEmail.substring(idx1+7, idx2);

			return entities.decodeHTML(onlyEncEmail);
		}
	}

	return '';
};

function _convertLoaiTinGiao(ads) {
	if (ads.loaiTinRao) {
    for (let key in REALESTATE_TYPE_NAME_MAP) {
      if (ads.loaiTinRao.indexOf(key) != -1) {
        let val = REALESTATE_TYPE_NAME_MAP[key];

        let spl = val.split(",");
        ads.loaiTin = Number(spl[0]);
        ads.loaiNhaDat = Number(spl[1]);
      }
    }

    /*
		var mapped = REALESTATE_TYPE_NAME_MAP[ads.loaiTinRao];
		if (!mapped) {
			console.log("WARN can't find ads.loaiTinRao:" + ads.loaiTinRao);
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
		*/
	}
}

function buildPlace(adsDto) {
	adsDto.place = {};

	adsDto.place.duAn = adsDto.duAn;
	adsDto.place.geo = {
		lat: adsDto.hdLat,
		lon: adsDto.hdLong
	};
	adsDto.place.diaChi = adsDto.diaChi;
	if (!adsDto.diaChi) {
		logUtil.warn("Dont' have diaChi", adsDto.maSo, adsDto.title);
		return;
	}
	adsDto.place.diaChinh = placeUtil.getDiaChinh(adsDto.place.diaChi, true);

	//for convenience
	adsDto.place.duAnFullName = placeUtil.getDuAnFullName(adsDto.place);

	//not now, demo3

	//adsDto.duAn = undefined; //to remove this field
	//adsDto.hdLat = undefined; //to remove this field
	//adsDto.hdLong = undefined; //to remove this field
}

function convertGia(ads) {
	if (!ads.price_unit) {
		return;
	}

	if (ads.price_unit==='tỷ') {
		ads.gia = ads.price_value*1000;
		return;
	}
	
	
	if (~ads.price_unit.indexOf('nghìn/m2/tháng')) {
		ads.gia = ads.price_value * ads.dienTich / 1000;
		return;
	}

	if (~ads.price_unit.indexOf('m nghìn/m')) { //Trăm nghìn/m²
		ads.gia = ads.price_value * ads.dienTich / 10;
		return;
	}

	if (~ads.price_unit.indexOf('u/m')) { //trieu/m2
		ads.gia = ads.price_value * ads.dienTich;
		return;
	}


	ads.gia = ads.price_value*1;
}

var parseEmailRegisterLink = function(ads, link) {
	let queryString = link.substring(link.indexOf('?')+1);
	let spl = queryString.split("&");
	let oneSpl;
	spl.forEach(e => {
		oneSpl = e.split("=");
		ads["emailRegister_"+oneSpl[0]] = oneSpl[1];
	});
};

var setHuongNha = function (ads, url) {
	for (let i=1; i<=8; i++) {
		if (url.indexOf("/-1/-1/-1/"+i) > -1) {
			ads.huongNha = i;
		}
	}
};

function _saveData(adsDto) {
	let maSo = adsDto.maSo;
	if (!URLCache[maSo]) {
		logUtil.error("Error, duplicate or not exist:", maSo);
		g_countDup++;
		return
	}

  let adsObj = {};

  adsObj.type = "Ads_Raw";
  let coverSmall = URLCache[maSo] ? URLCache[maSo].cover : null;
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
    userID : undefined,
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


  adsObj.url = URLCache[maSo].myUrl;
	//cleanup
	URLCache[maSo] = null;

  if (adsObj.gia && adsObj.dienTich) {
    adsObj.giaM2 = Number((adsObj.gia/adsObj.dienTich).toFixed(3));
  }

  adsObj.adsID = "Ads_bds_" + adsObj.maSo;
  adsObj.id = "Ads_raw_bds_" + adsObj.maSo;
  adsObj.source = adsDto.source;
  adsObj.duAnID = adsDto.duAnID;

  adsObj.extLoaiNhaDat = adsDto.loaiTinRao;

	//get detail ads features
	parseEmailRegisterLink(adsObj, adsDto.emailRegisterLink);

	adsModel.upsert(adsObj);
}

class RealEstateExtractor {
  extractWithLimit(rootURL, depth) {
    let startDate = new Date();
    var _done = () => {
      console.log('=================> DONE in ' + (new Date() - startDate) + 'ms' + ', countAds:' + g_countAds + ', countDup:' + g_countDup);
    };

    this.extractOnePage(rootURL, _done, depth);
	}

	extractOnePage(url, handleDone, depth) {
		let osmosisRoot  = 	osmosis.get(url);
		depth = depth || 0;

		for (let i=0; i < depth; i++) {
			console.log("Will dive into one more level");
			osmosisRoot = osmosisRoot.follow('#RightMainContent__productCountByContext_bodyContainer ul > li > a@href');
		}

		osmosisRoot
			.paginate(".background-pager-right-controls a:skip-last:last:contains('...')", 100)
			.set({
				'urls' : ['.search-productItem .p-title > a@href'],
				'titles' : ['.search-productItem .p-title > a@title'],
				'covers'  : ['.search-productItem .p-main > div > a > img@src'],
        //'nexts' : [".background-pager-right-controls a:skip-last:last@href"],
				//'nexts3' : ".background-pager-right-controls a:skip-last:last:contains('...')@href",
				//'nexts1' : [".background-pager-right-controls a:skip-last@href"],
				//'nexts2' : [".background-pager-right-controls a:contains('...')@href"]
			})
      .data((dto) => {
				let myUrl, idx, tail, code, cover;

				for (let i = 0; i < dto.urls.length; i++) {
					myUrl = dto.urls[i];
					cover = dto.covers[i];

					idx = myUrl.lastIndexOf("-");
					tail = myUrl.substr(idx+3);
					code = tail;

					URLCache[code] = {myUrl, cover};
				}

        //console.log("AAAAAA", dto.nexts);
      })
			.follow('.search-productItem .p-title > a@href')
			.set({
				'title'			:'#product-detail .pm-title > h1',
				'images'		:['#product-detail .list-img > ul > li > img@src'],
				'prices'			:['#product-detail .gia-title > strong'],
				'area'			:'#product-detail .gia-title[2] > strong ',
				'loc'			:'#product-detail .diadiem-title',
				'custRights'	:['#divCustomerInfo .right'],
				'custLefts'		:['#divCustomerInfo .left'],
				'detailRights' 		:['#product-detail .left-detail .right'],
				'detailLefts' 		:['#product-detail .left-detail .left'],
				'chiTiet'	:'#product-detail .pm-content:source',
				'hdLat'		:'.container-default input[id="hdLat"]@value',
				'hdLong'	:'.container-default input[id="hdLong"]@value',
				'duAnID'      :'#product-detail .inproject > a@href',
				'emailRegisterLink' : '#emailregister@href'
			})
			.data(function(listing) {
				//console.log("Processing listing:", listing.title, URLCache);
				g_countAds++;

        let price = listing.prices[0];
        let dienTich = listing.prices[1];
				let chiTiet;
				try {
					chiTiet = util.replaceBrToDowntoLine(listing.chiTiet);
				} catch (e) {
					logUtil.warn("Error when replaceBrToDowntoLine", listing.chiTiet)
				}

				let ads = {
					title: listing.title,
					images_small: listing.images,
					price_raw: price,
					price_value: price && price.split(' ')[0],
					price_unit: price && price.split(' ')[1],
					dienTich: dienTich && Number(dienTich.substr(0, dienTich.length-2)),
					area_raw: dienTich,
					loc: listing.loc && listing.loc.length > 9 ? listing.loc.substring(9): '',
					chiTiet: chiTiet,
					hdLat : Number(listing.hdLat),
					hdLong : Number(listing.hdLong),
					duAnID  : listing.duAnID,
					emailRegisterLink : listing.emailRegisterLink
				};

				//var {detailLefts, detailRights, custLefts, custRights} = listing;

				// detail
				for (let i = 0; i < listing.detailLefts.length; i++) {
					ads[REALESTATE_NAME_MAP[listing.detailLefts[i]]] = listing.detailRights[i];
				}

				// customer information : thong tin lien lac
				for (let i = 0; i < listing.custLefts.length; i++) {
					//transform first:
					let val = listing.custRights[i];
					if (listing.custLefts[i]=='Email') {
						val = parseEmail(listing.custRights[i]);
					}
					ads[REALESTATE_NAME_MAP['cust ' + listing.custLefts[i]]] = val;
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

				//convert so tang
				if (ads.soPhongTam_full) {
					ads.soPhongTam = Number(ads.soPhongTam_full.substr(0, 1));
				}
				//convert gia'
				convertGia(ads);

				buildPlace(ads);

				setHuongNha(ads, url); //base on url

				ads.source = "BATDONGSAN.COM.VN";

				if(ads.duAnID){
					ads.duAnID  = ads.duAnID.replace("/","");
				}

        ads.ngayDangTin = ads.ngayDangTin && util.convertFormatDate(ads.ngayDangTin);

				_saveData(ads);
			})

			.log(console.log)
			.error(console.log)
			.done(() => {
				logUtil.info("Done all!", new Date());
				handleDone();
			})
	}
}

module.exports = RealEstateExtractor;

