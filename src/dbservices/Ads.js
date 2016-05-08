'use strict';

var couchbase = require('couchbase');
var util = require("../lib/utils");
var N1qlQuery = require('couchbase').N1qlQuery;
var ViewQuery = couchbase.ViewQuery;
var cluster = new couchbase.Cluster('couchbase://localhost:8091');
var bucket = cluster.openBucket('default');
bucket.enableN1ql(['127.0.0.1:8093']);

bucket.operationTimeout = 60 * 1000;

class AdsModel {
    constructor(myBucket) {
        this.myBucket = myBucket;
    }

    upsert(adsDto) {
        bucket.upsert(adsDto.adsID, adsDto, function (err, res) {
            if (err) {
                console.log("ERROR:" + err);
            }
        })
    }

    queryAll(callBack) {
        let query = ViewQuery.from('ads', 'all_ads').limit(3);

        this.myBucket.query(query, function (err, all) {
            console.log("number of ads:" + all.length);
            console.log("Error:" + err);
            if (!all)
                all = [];

            callBack(all);
        });
    }

    uncentDiaChinh(){
        let query = ViewQuery.from('ads', 'all_ads');
        var that = this;
        bucket.query(query, function (err, all) {
            console.log("number of ads:" + all.length);
            if (!all)
                all = [];

            for (var i = 0; i < all.length; i++)
            {
                var ads = all[i].value;
                if (ads.place.diaChinh.tinh)
                ads.place.diaChinh.tinhKhongDau =util.locDau(ads.place.diaChinh.tinh);
                if (ads.place.diaChinh.huyen)
                ads.place.diaChinh.huyenKhongDau =util.locDau(ads.place.diaChinh.huyen);
                if (ads.place.diaChinh.xa)
                ads.place.diaChinh.xaKhongDau =util.locDau(ads.place.diaChinh.xa);
                that.upsert(ads);
            }
            console.log("Finish");
        });


    }


    countAllAds(onSuccess) {
        var sql = "select count(*) cnt from default where type = 'Ads'";
        var query = N1qlQuery.fromString(sql);

        bucket.query(query, function (err, res) {
            if (err) {
                console.log('query failed'.red, err);
                return;
            }
            console.log('success!', res);

            onSuccess(res[0].cnt);
        });
    }

    getAds(adsID, callback) {
        this.initBucket();
        bucket.get(adsID, callback);
    }

    initBucket() {
        bucket = cluster.openBucket('default');
        bucket.enableN1ql(['127.0.0.1:8093']);
        bucket.operationTimeout = 60 * 1000;
    }

//?loaiTin=0&loaiNhaDat=0&giaBETWEEN=1000,2000&soPhongNguGREATER=2
// &spPhongTamGREATER=1&dienTichBETWEEN=50,200
// &orderBy=giaASC,dienTichDESC,soPhongNguASC
    queryAllData(reply, loaiTin, loaiNhaDat, gia, soPhongNgu, soPhongTam, dienTich, orderByField, orderByType, limit) {

        // enable n1ql as per documentation (http://docs.couchbase.com/developer/node-2.0/n1ql-queries.html) - I also tried :8091, same result

        var sql = "SELECT adsID,loaiTin,image,gia,dienTich,loaiNhaDat,soPhongNgu,soPhongTam,soTang FROM `default`  where 1=1 ";

        sql = sql + (loaiTin ? " and loaiTin=" + loaiTin : "");

        sql = sql + (loaiNhaDat ? " and loaiNhaDat=" + loaiNhaDat : "");

        sql = sql + (gia ? " and  gia BETWEEN " + gia[0] + " AND " + gia[1] : "");

        sql = sql + (soPhongNgu ? " and soPhongNgu  >= " + soPhongNgu : "");

        sql = sql + (soPhongTam ? " and soPhongTam  >= " + soPhongTam : "");

        sql = sql + (dienTich ? " and dienTich BETWEEN " + dienTich[0] + " AND " + dienTich[1] : "");

        if (orderByField) {
            sql = sql + " order by " + orderByField + "  " + orderByType;
        }
        if (limit) {
            sql = sql + " limit  " + limit;
        }
        else {
            sql = sql + " limit 100 ";
        }
        var query = N1qlQuery.fromString(sql);

        // var callback1 = function (err, res) {
        //     if (err) {
        //         onFailure();
        //     }
        //     else {
        //         onSuccess();
        //     }
        // };
        // bucket.query(query, callback1);
        bucket.query(query, function(err, all) {
            console.log("number of ads:" + all.length);
            console.log("Error:" + err);
            if (!all)
                all = [];

            reply({
                length: all.length,
                list: all
            });
        });

    }
    // query by Tinh, Huyen, Xa.
    queryByDiaChinh(reply, tinh,huyen,xa,limit) {

        // enable n1ql as per documentation (http://docs.couchbase.com/developer/node-2.0/n1ql-queries.html) - I also tried :8091, same result

        var sql = "SELECT t.* FROM `default` t  where 1=1 ";

       //SELECT * FROM `default`  where 1=1  and place.diaChi like '%Nam%'

        if (tinh) {
            sql = sql + " and place.diaChinh.tinhKhongDau = '" + tinh + "'";
        }

        if (huyen) {
            sql = sql + " and place.diaChinh.huyenKhongDau = '" + huyen + "'";
        }

        if (xa) {
            sql = sql + " and place.diaChinh.xaKhongDau = '" + xa + "'";
        }

        if (limit) {
            sql = sql + " limit  " + limit;
        }
        else {
            sql = sql + " limit 100 ";
        }
        var query = N1qlQuery.fromString(sql);
        return query;
        /*
        bucket.query(query, function(err, all) {
            console.log("number of ads:" + all.length);
            console.log("Error:" + err);
            if (!all)
                all = [];

            reply({
                length: all.length,
                list: all
            });
        });
        */
    }
        //nhannc
    queryRecentAds(reply, ngayDangTin,orderByField, orderByType, limit) {

        // enable n1ql as per documentation (http://docs.couchbase.com/developer/node-2.0/n1ql-queries.html) - I also tried :8091, same result

        //var sql = "SELECT adsID,loaiTin,image,gia,dienTich,loaiNhaDat,soPhongNgu,soPhongTam,soTang FROM `default`  where 1=1 and type = 'Ads'";
        var sql = "SELECT * FROM `default`  where 1=1 and type = 'Ads'";

        sql = sql + (ngayDangTin ? (" and ngayDangTin>'" + ngayDangTin + "'") : "");
        if (orderByField) {

            sql = sql + " order by " + orderByField + "  " + orderByType;
        }

        if (limit) {
            sql = sql + " limit  " + limit;
        }
        else {
            sql = sql + " limit 4 ";
        }
        var query = N1qlQuery.fromString(sql);

        console.log("queryRecentAds: " + sql);

        bucket.query(query, function(err, all) {
            console.log("number of ads:" + all.length);
            console.log("Error:" + err);
            if (!all)
                all = [];

            reply({
                length: all.length,
                list: all
            });
        });

    }
    queryBelowPriceAds(reply, gia, orderByField, orderByType, limit) {

        // enable n1ql as per documentation (http://docs.couchbase.com/developer/node-2.0/n1ql-queries.html) - I also tried :8091, same result

        //var sql = "SELECT adsID,loaiTin,image,gia,dienTich,loaiNhaDat,soPhongNgu,soPhongTam,soTang FROM `default`  where 1=1 and type = 'Ads'";
        var sql = "SELECT * FROM `default`  where 1=1 and type = 'Ads'";

        sql = sql + (gia ? (" and gia <" + gia) : "");
        if (orderByField) {

            sql = sql + " order by " + orderByField + "  " + orderByType;
        }

        if (limit) {
            sql = sql + " limit  " + limit;
        }
        else {
            sql = sql + " limit 4 ";
        }
        var query = N1qlQuery.fromString(sql);

        console.log("queryBelowPriceAds: " + sql);

        bucket.query(query, function(err, all) {
            console.log("number of ads:" + all.length);
            console.log("Error:" + err);
            if (!all)
                all = [];

            reply({
                length: all.length,
                list: all
            });
        });

    }
    //End nhannc
}

    module.exports = AdsModel;
