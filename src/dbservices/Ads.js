'use strict';

var couchbase = require('couchbase');
var N1qlQuery = require('couchbase').N1qlQuery;
var ViewQuery = couchbase.ViewQuery;
var cluster = new couchbase.Cluster('couchbase://localhost:8091');
var bucket = cluster.openBucket('default');

class AdsModel {
	constructor(myBucket) {
		this.myBucket = myBucket;
	}

	upsert(adsDto) {
		this.myBucket.upsert(adsDto.adsID, adsDto, function(err, res) {
			if (err) {
				console.log("ERROR:" + err);
			}
		})
	}

	queryAll(callBack) {
        let query = ViewQuery.from('ads', 'all_ads').limit(3);

        this.myBucket.query(query, function(err, all) {
            console.log("number of ads:" + all.length);
            console.log("Error:" + err);
            if (!all)
                all = [];

            callBack(all);
        });
    }

//?loaiTin=0&loaiNhaDat=0&giaBETWEEN=1000,2000&soPhongNguGREATER=2
// &spPhongTamGREATER=1&dienTichBETWEEN=50,200
// &orderBy=giaASC,dienTichDESC,soPhongNguASC
queryAllData(loaiTin,loaiNhaDat,gia,soPhongNgu,soPhongTam,dienTich,orderByField,orderByType,limit){

    bucket.enableN1ql(['127.0.0.1:8093']); // enable n1ql as per documentation (http://docs.couchbase.com/developer/node-2.0/n1ql-queries.html) - I also tried :8091, same result

    var  sql = "SELECT adsID,loaiTin,image,gia,dienTich,loaiNhaDat,soPhongNgu,soPhongTam,soTang FROM `default`  where 1=1 and _type = 'Ads'";

    sql = sql + " and loaiTin=" + loaiTin;

    sql = sql +   (loaiNhaDat?" and loaiNhaDat=" + loaiNhaDat:"");

    sql = sql + (gia?" and  gia BETWEEN " +gia[0] +  " AND " + gia[1]:"");

    sql = sql + (soPhongNgu?" and soPhongNgu  >= " + soPhongNgu:"");

    sql = sql + (soPhongTam?" and soPhongTam  >= " + soPhongTam:"");

    sql = sql + (dienTich?" and dienTich BETWEEN " +dienTich[0] +  " AND " + dienTich[1]:"");

    sql = sql + (orderByField?" order by " + orderByField + " " + orderByType:"");

    sql = sql +   (limit?" limit  " + limit:" limit 100 ");


    var query = N1qlQuery.fromString(sql);

    setTimeout(function() {
        bucket.query(query, function(err, res) {
            if (err) {
                console.log('query failed'.red, err);
                return;
            }
            console.log('success!', res);
        });
    }, 2000); // just in case connecting takes a second or something?

}
}

module.exports = AdsModel;