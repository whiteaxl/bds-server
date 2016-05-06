'use strict';

var couchbase = require('couchbase');
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
    queryAllData(onSuccess, onFailure, loaiTin, loaiNhaDat, gia, soPhongNgu, soPhongTam, dienTich, orderByField, orderByType, limit) {

        // enable n1ql as per documentation (http://docs.couchbase.com/developer/node-2.0/n1ql-queries.html) - I also tried :8091, same result

        var sql = "SELECT adsID,loaiTin,image,gia,dienTich,loaiNhaDat,soPhongNgu,soPhongTam,soTang FROM `default`  where 1=1 and type = 'Ads'";

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

        var callback1 = function (err, res) {
            if (err) {
                onFailure();
            }
            else {
                onSuccess();
            }
        };
        bucket.query(query, callback1);

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
