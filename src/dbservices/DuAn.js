'use strict';

var couchbase = require('couchbase');
var N1qlQuery = require('couchbase').N1qlQuery;
var ViewQuery = couchbase.ViewQuery;
var cluster = new couchbase.Cluster('couchbase://localhost:8091');
var bucket = cluster.openBucket('default');
bucket.enableN1ql(['127.0.0.1:8093']);

bucket.operationTimeout = 120 * 1000;
/**
{
  "diaChi": "9 Phạm Văn Đồng, Phường Mai Dịch, Cầu Giấy, Hà Nội",
  "diaChinh": {
    "duong": "9 Phạm Văn Đồng",
    "huyen": "Cầu Giấy",
    "huyenKhongDau": "cau-giay",
    "tinh": "Hà Nội",
    "tinhKhongDau": "ha-noi",
    "xa": "Phường Mai Dịch",
    "xaKhongDau": "phuong-mai-dich"
  },
  "duAnID": "DA_2t-corporation-pj1435",
  "geo": {
    "lat": 21.0385150909424,
    "lon": 105.780174255371
  },
  "id": "DA_2t-corporation-pj1435",
  "image": "http://file1.batdongsan.com.vn/thumb200x150.365519.jpg",
  "ten": "2T Corporation",
  "tenKhongDau": "2t-corporation",
  "soTinDang": 100
  "type": "DuAn"
}
*/

class DuAnModel {


	initBucket() {
        cluster = new couchbase.Cluster('couchbase://localhost:8091');
		bucket.enableN1ql(['127.0.0.1:8093']);
		// bucket.operationTimeout = 60 * 1000;
    bucket.operationTimeout = 120 * 1000;
		bucket = cluster.openBucket('default');
	}

	upsert(duAnDto) {
		this.initBucket();

		duAnDto.id = duAnDto.duAnID;

		bucket.upsert(duAnDto.id, duAnDto, function(err, res) {
			if (err) {
				console.log("ERROR:" + err);
			}
		})
	}

	findDuAn(q,callback){
		var sql = "SELECT t.* FROM `default` t  where t.type='DuAn' ";

        if (q.hot) {
            sql = sql + " and t.hot=" + q.hot;
        }
        if(q.tinhKhongDau) {
        	sql = sql + " and t.diaChinh.tinhKhongDau='" + q.tinhKhongDau + "'";
        }
        if (q.orderBy) {
            sql = sql + " ORDER BY " + q.orderBy.orderByField + "  " + q.orderBy.orderByType;
        }
        if (q.limit) {
            sql = sql + " limit  " + q.limit;
        }
        else {
            sql = sql + " limit 4 ";
        }

        console.log("sql:" + sql );
        var query = N1qlQuery.fromString(sql);
        bucket.query(query, function(err, all) {
            
            if (!all)
                all = [];
            console.log("number of ads:" + all.length);
            console.log("Error:" + err);
            callback(err,all);            
        });

	}

}

module.exports = DuAnModel;