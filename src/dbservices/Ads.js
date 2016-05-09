'use strict';

var couchbase = require('couchbase');
var util = require("../lib/utils");
var N1qlQuery = require('couchbase').N1qlQuery;
var ViewQuery = couchbase.ViewQuery;
var cluster = new couchbase.Cluster('couchbase://localhost:8091');
var bucket = cluster.openBucket('default');
bucket.enableN1ql(['127.0.0.1:8093']);

bucket.operationTimeout = 60 * 1000;


var DEFAULT_LIMIT = 1000;


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

    //loaiTin is mandatory
    queryAllData(
        callback
        , geoBox
        , diaChinh //tinh, huyen, xa
        , loaiTin
        , loaiNhaDat
        , gia //arrays from,to
        , dienTich //arrays from,to
        , soPhongNguGREATER
        , soPhongTamGREATER
        , ngayDangTinFrom
        , huongNha
        , orderBy//orderByField, orderByType
        , limit
    ) {
        var sql = `SELECT t.* FROM default t  WHERE loaiTin = ${loaiTin}`;

        sql = sql + (loaiNhaDat ? " AND loaiNhaDat=" + loaiNhaDat : "");

        if (geoBox) {
            sql = sql + " AND (place.geo.lat BETWEEN " + geoBox[0] + " AND " + geoBox[2] + ")";
            sql = sql + " AND (place.geo.lon BETWEEN " + geoBox[1] + " AND " + geoBox[3] + ")";
        }

        if (diaChinh) {
            if (diaChinh.tinh) {
                sql = `${sql} AND place.diaChinh.tinhKhongDau='${diaChinh.tinh}'`;
            }

            if (diaChinh.huyen) {
                sql = `${sql} AND place.diaChinh.huyenKhongDau='${diaChinh.huyen}'`;
            }

            if (diaChinh.xa) {
                sql = `${sql} AND place.diaChinh.xaKhongDau='${diaChinh.xa}'`;
            }
        }

        if (ngayDangTinFrom) { //ngayDangTinFrom: 20-04-2016
            sql = `${sql} and ngayDangTin > '${ngayDangTinFrom}'`;
        }

        if (gia && (gia[0] > 1 || gia[1] < 9999999)) {
            sql = `${sql} AND (gia BETWEEN ${gia[0]} AND ${gia[1]})`;
        }

        sql = sql + (soPhongNguGREATER ? " AND soPhongNgu  >= " + soPhongNguGREATER : "");

        sql = sql + (soPhongTamGREATER ? " AND soPhongTam  >= " + soPhongTamGREATER : "");

        if ((dienTich) && (dienTich[0] > 1 || dienTich[1] < 9999999)) {
            sql = `${sql} AND (dienTich BETWEEN  ${dienTich[0]} AND ${dienTich[1]})`;
        }

        sql = sql + (huongNha ? " AND huongNha=" + huongNha : "");

        //orderBy
        if (orderBy) {
            sql = sql + " ORDER BY " + orderBy.orderByField + "  " + orderBy.orderByType;
        }

        limit = limit || DEFAULT_LIMIT;
        sql = sql + " LIMIT  " + limit;

        console.log(sql);
        /*
        var query = N1qlQuery.fromString('select count(*) from default');
        bucket.query(query, function(err, all) {
            console.log("err=", err, all);
        });
        */

        var bucket = cluster.openBucket('default');
        bucket.enableN1ql(['127.0.0.1:8093']);
        bucket.operationTimeout = 60 * 1000;

        var query = N1qlQuery.fromString(sql);

        bucket.query(query, function(err, all) {
            console.log("err=", err);
            console.log("number of ads:" + all.length);
            if (!all)
                all = [];
            callback(err, all);
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
