'use strict'

//extract data from bds.com

var osmosis = require('osmosis');
//html entity coding
var entities = require("entities");

var DSLoaiNhaDat = require("./LoaiNhaDat");
var logUtil = require("./logUtil");
var placeUtil = require('./placeUtil');
var util = require("./utils");
var AdsModel = require("../dbservices/Ads");
var adsModel = new AdsModel();

var headerCache = {};

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
	'Bán nhà biệt thự, liền kề (nhà trong dự án quy hoạch)' : '0,3',
	'Bán căn hộ chung cư' :'0,1',
	'Bán nhà riêng' : '0,2',
	'Bán nhà mặt phố' : '0,4',
	'Bán đất nền dự án' : '0,5',
	'Bán đất nền dự án (đất trong dự án quy hoạch)' :'0,5',
	'Bán trang trại, khu nghỉ dưỡng' : '0,7',
	'Bán kho, nhà xưởng' : '0,8',
	'Bán loại bất động sản khác' : '0,99',
	'Bán đất' : '0,6',
  'Bán nhà mặt phố (nhà mặt tiền trên các tuyến phố)' : '0,4',
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
		var idx2 = encEmail.indexOf('\'', idx1);
		if (~idx2) {
			var onlyEncEmail = encEmail.substring(idx1+7, idx2);

			return entities.decodeHTML(onlyEncEmail);
		}
	}

	return '';
};

function _convertLoaiTinGiao(ads) {
	if (ads.loaiTinRao) {

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

var setHuongNha = function (ads, url) {
	for (var i=1; i<=8; i++) {
		if (url.indexOf("/-1/-1/-1/"+i) > -1) {
			ads.huongNha = i;
		}
	}
};

function _saveData(adsDto) {
  let adsObj = {};

  adsObj.type = "Ads";
  let coverSmall = headerCache[adsDto.title] ? headerCache[adsDto.title].cover : null;
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
  adsObj.adsUrl = headerCache[adsDto.title].adsUrl;

  if (adsObj.gia && adsObj.dienTich) {
    adsObj.giaM2 = Number((adsObj.gia/adsObj.dienTich).toFixed(3));
  }

  adsObj.adsID = "Ads_bds_" + adsObj.maSo;
  adsObj.id = adsObj.adsID;
  adsObj.source = adsDto.source;
  adsObj.duAnID = adsDto.duAnID;


  adsModel.upsert(adsObj);
}

class RealEstateExtractor {
  //rootURL = http://batdongsan.com.vn/nha-dat-ban ; nha-dat-cho-thue
	extractRealEstateWithLimit(rootURL,start, end,ngayDangTin) {
		console.log("Enter extractWithLimit .... " + start + ", " + end);
		var startDate = new Date();

		var count = start;

    var _done = () => {
      count++;
      if (count>end) {
        return;
      }

      this.extractOnePage(rootURL + '/p'+count, _done,ngayDangTin);
    };

    this.extractOnePage(rootURL + '/p'+count, _done,ngayDangTin);

    /*
		var i = start;
		for (i=start; i<=end; i++) {
			console.log("Extracting for page: " + rootURL + '/p'+i);
      this.extractOnePage(rootURL + '/p'+x, _done,ngayDangTin);
		}

		*/
	}

	extractOnePage(url, handleDone,ngayDangTin) {
		osmosis
			.get(url)
			.find('.search-productItem')
			.set({
				'adsUrl' : '.p-title > a@href',
        'title' : '.p-title a',
				'cover' : '.p-main > div > a > img@src',
			})
      .data((dto) => {
        headerCache[dto.title] = dto;
      })
			.follow('.p-title > a@href')
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
				'duAnID'      :'#product-detail .inproject > a@href'
			})
			.data(function(listing) {
				//console.log("listing:", listing);
        let price = listing.prices[0];
        let dienTich = listing.prices[1];
				let ads = {
					title: listing.title[0],
					images_small: listing.images,
					price_raw: listing.price,
					price_value: price && price.split(' ')[0],
					price_unit: price && price.split(' ')[1],
					dienTich: dienTich && Number(dienTich.substr(0, dienTich.length-2)),
					area_raw: dienTich,
					loc: listing.loc && listing.loc.length > 9 ? listing.loc.substring(9): '',
					chiTiet: util.replaceBrToDowntoLine(listing.chiTiet),
					hdLat : Number(listing.hdLat),
					hdLong : Number(listing.hdLong),
					duAnID  : listing.duAnID
				};

				//var {detailLefts, detailRights, custLefts, custRights} = listing;

				// detail
				for (var i = 0; i < listing.detailLefts.length; i++) {
					ads[REALESTATE_NAME_MAP[listing.detailLefts[i]]] = listing.detailRights[i];
				}

				// customer information : thong tin lien lac
				for (var i = 0; i < listing.custLefts.length; i++) {
					//transform first:
					var val = listing.custRights[i];
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
					ads.duAnID  = "DA_" + (ads.duAnID).replace("/","");
				}

        ads.ngayDangTin = ads.ngayDangTin && util.convertFormatDate(ads.ngayDangTin);

        if (ngayDangTin) {
          if(ads.ngayDangTin == ngayDangTin){
            console.log("Lay dung ngay dang tin");
            _saveData(ads);
          }
        } else {
          _saveData(ads);
        }
			})

			.log(console.log)
			.error(console.log)
			.done(() => {
				console.log("Done all!");
				handleDone();
			})
	}
}

module.exports = RealEstateExtractor;

