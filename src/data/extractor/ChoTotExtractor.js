'use strict';

//extract data from bds.com
var striptags = require('striptags');
var osmosis = require('osmosis');
//html entity coding
var entities = require("entities");
var logUtil = require("../../lib/logUtil");
var util = require("../../lib/utils");
var AdsModel = require("../../dbservices/Ads");
var adsModel = new AdsModel();

var _ = require("lodash");
var DBCache = require("../../lib/DBCache");

var g_countAds = 0;
var g_countDup = 0;

var URLCache = {};
var AdsCache = {};

var result = {
	cnt_update : 0,
	cnt_insert : 0,
	cnt_err : 0,
	total: 0,
	cnt_wrongUrl :0,
	cnt_noChange : 0
};

var g_nmbrOfAccessedAds = 0;
var g_nmbrOfDoneAds = 0;

class ChoTotExtractor {
	constructor() {
	}

	extractFromTo(url, from, to, handleDone) {
		let cnt = from;
		let that = this;
		for (var i=from; i <= to; i++) {
			let tmp = i;
			setTimeout(() => {
				this.extractOnePage(url + "?o=" + i, () => {
					if (cnt++ == to) {
						handleDone();
					}
				});
			}, tmp * 5000);

		}

		let itv  = setInterval(() => {
			console.log("Done " + g_nmbrOfDoneAds + " out of " + g_nmbrOfAccessedAds);
			if (g_nmbrOfAccessedAds == g_nmbrOfDoneAds && g_nmbrOfDoneAds) {
				clearInterval(itv);

				console.log("error:" + result.cnt_err + ", wrongUrl:" + result.cnt_wrongUrl + ", Inserted : " + result.cnt_insert
					+ ", Updated:" + result.cnt_update + ", noChange:" + result.cnt_noChange +", Total:" + result.total);
				handleDone();
			}
		}, 30*1000);
	}

//depth: diaChinh level, 0 mean no dive into into any level, 3 mean dive into XA
	extractOnePage(url, handleDone) {
		let that = this;

		let osmosisRoot  = 	osmosis.get(url);
		osmosisRoot
			.set({
				'urls'	:['.li_subject .subject_price a@href']
			})
			.data((dat => {
				//console.log("NNNNNNN:", dat.nexts, dat.nextsLabel);

				dat.urls.forEach((url) => {
					let idx = url.lastIndexOf("-");
					let tail = url.substr(idx+1);
					let code = tail.substr(0, tail.length-4);

					URLCache[code] = url;
				})
			}))
			.follow('.li_subject .subject_price a@href')
			.set({
				'header_title'   : 'title',
				'title'			   	:'.item h1',
				'image_url'     : '.item .pimages_wrapper img@src',
				'images_url'       : '.item a.all_img_link@href',
				'dangBoi_dateTime' : '.item .AdHeaderBar span',
				'dangBoi'				: '.item .AdHeaderBar strong',
				'lienHe_tel'    : '.item #phonebtn@href',
				//'lienHe_onclick'   : '.item #phonebtn@onclick',
				'params_label'  : ['.item .mobile_item_param label'],
				'params_value'  : ['.item .mobile_item_param strong'],
				'chiTiet'       : '.item .item_body'
			})
			.data(function(ads) {
				try {
					g_countAds++;
					that.handle(ads);
				} catch(e) {
					logUtil.error("CANT EXTRACT",e, ads);
					logUtil.error("CANT EXTRACT STACK",e.stack);
				}
			})
			.follow('.item a.all_img_link@href')
			.set({
				'header_title_2'   : 'title',
				'image_urls'       : ['.item .pimages_wrapper a img@src']
			})
			.data((adsImages) => {
				//console.log("IMGES:", adsImages);
				let maSo = this._getMaSoFromTitle(adsImages.header_title_2);
				if (!AdsCache[maSo]) {
					console.error("No ADS for maso:", maSo, adsImages.header_title_2);
					result.cnt_wrongUrl++;
					this._doneOne();
				} else {
					AdsCache[maSo].imageUrls =  adsImages.image_urls;
					this._upsert(AdsCache[maSo], this._doneOne);
				}

				//
				//console.log("Ads:", AdsCache[maSo]);
				//this._upsert(AdsCache[maSo], this._doneOne);

			})
			.log(console.log)
			.error(console.log)
			.debug(console.log)
			.done(() => {
				logUtil.info("Done all!", new Date());
			})
	}
	_doneOne() {
		//console.log("Done one");
		g_nmbrOfDoneAds++;
	}

	_getMaSoFromTitle(title) {
		let idx = title.lastIndexOf("-");
		return title.substr(idx+2);
	}

	_upsert(ads, done) {
		ads.id = ads.adsID;
		//ads.timeModified = new Date().getTime();

		result.total++;

		let fromDB = DBCache.adsRawAsMap()[ads.adsID];
		if (fromDB) {
			let cloneAds = JSON.parse(JSON.stringify(ads));
			fromDB.dangBoi_dateTime = cloneAds.dangBoi_dateTime;
			cloneAds.timeModified = fromDB.timeModified;
			cloneAds.meta = null;
			fromDB.meta = null;

			if (!_.isEqual(cloneAds, fromDB)) {
				//ads.phone=ads.lienHe_tel;
				adsModel.upsert(ads, (err, res) => {
					if (err) {
						result.cnt_err++;
					}
					result.cnt_update++;
					done();
				});
			} else {
				console.log("No change!");
				result.cnt_noChange++;
				done();
			}
		} else { //insert
			adsModel.upsert(ads, (err, res) => {
				if (err) {
					result.cnt_err++;
				}
				result.cnt_insert++;
				done();
			});
		}
	}

	handle(ads) {
		g_nmbrOfAccessedAds ++;
		//
		if (!ads.header_title) {
			result.cnt_wrongUrl++;
			return this._doneOne();
		}
		ads.maSo = this._getMaSoFromTitle(ads.header_title);

		ads.type = "Ads_Raw";
		ads.adsID = "Ads_Raw_ChoTot_" + ads.maSo;
		ads.source = "chotot";

		ads.meta = {
			converted : false
		};

		ads.url = URLCache[ads.maSo];

		AdsCache[ads.maSo] = ads;

		ads.urls = undefined;

		if (!ads.images_url) {
			//console.log(ads);
			this._upsert(ads, this._doneOne);
		}
	}
}

module.exports = ChoTotExtractor;

