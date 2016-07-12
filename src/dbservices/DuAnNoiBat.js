'use strict';

var couchbase = require('couchbase');
var N1qlQuery = require('couchbase').N1qlQuery;
var ViewQuery = couchbase.ViewQuery;
var cluster = new couchbase.Cluster('couchbase://localhost:8091');
var bucket = cluster.openBucket('default');
bucket.enableN1ql(['127.0.0.1:8093']);

bucket.operationTimeout = 120 * 1000;

/**
id,duAnNoiBatID,
diaChinh{
    tinhKhongDau,
    huyenKhongDau
},
duAnID,
tenDuAN,
anhDuAn,
gioiThieuDuAn
level: 1=search page,2= detail page
status: 1=active,2=inactive 
*/

/*INSERT INTO default (KEY, VALUE) VALUES ("DuAnNoiBat_1", 
      {"level": 1, "gioiThieuDuAn": "Nơi cuộc sống thăng hoa", "anhDuAn":"http://file1.batdongsan.com.vn/thumb200x150.363849.jpg","tenDuAn":"Bảo Anh Building","id": "DuAnNoiBat_1", "duAnNoiBatID": "DuAnNoiBat_1", "type": "DuAnNoiBat", "status":1, "duAnID": "DA_bao-anh-building-pj1421","diaChinh": {"tinhKhongDau": 'ha-noi', "huyenKhongDau": 'cau-giay'}}) RETURNING * 
      
INSERT INTO default (KEY, VALUE) VALUES ("DuAnNoiBat_2", 
      {"level": 2,"gioiThieuDuAn": "Sang trọng và tiện nghi","anhDuAn": "http://file1.batdongsan.com.vn/thumb200x150.365519.jpg", "tenDuAn": "2T Corporation", "id": "DuAnNoiBat_2", "duAnNoiBatID": "DuAnNoiBat_2", "type": "DuAnNoiBat", "status":1, "duAnID": "DA_2t-corporation-pj1435","diaChinh": {"tinhKhongDau": 'ha-noi', "huyenKhongDau": 'cau-giay'}}) RETURNING *     

INSERT INTO default (KEY, VALUE) VALUES ("DuAnNoiBat_3", 
      {"level": 2,"gioiThieuDuAn": "Không gian quyến rũ","anhDuAn": "http://file1.batdongsan.com.vn/thumb200x150.363934.jpg", "tenDuAn": "AC Building", "id": "DuAnNoiBat_2", "duAnNoiBatID": "DuAnNoiBat_2", "type": "DuAnNoiBat", "status":1, "duAnID": "DA_ac-building-pj1422","diaChinh": {"tinhKhongDau": 'ha-noi', "huyenKhongDau": 'cau-giay'}}) RETURNING *     



      
*/
class DuAnNoiBatModel {


	initBucket() {
		bucket.enableN1ql(['127.0.0.1:8093']);
		bucket.operationTimeout = 60 * 1000;
		bucket = cluster.openBucket('default');
	}

	upsert(duAnNoiBatDto) {
		this.initBucket();

		duAnNoiBatDto.id = duAnNoiBatDto.duAnNoiBatID;

		bucket.upsert(duAnNoiBatDto.id, duAnNoiBatDto, function(err, res) {
			if (err) {
				console.log("ERROR:" + err);
			}
		})
	}

	findDuAnNoiBat(q,callback){
		var sql = "SELECT t.* FROM `default` t  where t.type='DuAnNoiBat' ";

        if(q.tinhKhongDau) {
        	sql = sql + " and t.diaChinh.tinhKhongDau='" + q.tinhKhongDau + "'";
        }
        if(q.huyenKhongDau) {
            sql = sql + " and t.diaChinh.huyenKhongDau='" + q.huyenKhongDau + "'";
        }
        if(q.level)
            sql = sql + " and t.level=" + q.level;

        if (q.limit) {
            sql = sql + " limit  " + q.limit;
        }
        else {
            sql = sql + " limit 2 ";
        }

        console.log("sql:" + sql );
        var query = N1qlQuery.fromString(sql);
        bucket.query(query, function(err, all) {
            
            if (!all)
                all = [];
            console.log("number of duAnNoiBat: " + all.length);
            console.log("Error:" + err);
            callback(err,all);            
        });

	}

}

module.exports = DuAnNoiBatModel;