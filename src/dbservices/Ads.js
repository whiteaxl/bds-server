'use strict';

/*
 adsID: string (
     bds: Ads_bds_<maso>
     dothi: Ads_dothi_<maso>
     reland: Ads_reland_<UserID>_<createdTimeFrom1970>
 )
 dangBoi: {email, name, phone, userID}
 ngayDangTin: string (format: YYYYMMDD)
 gia: number
 dienTich: number
 place : {
     duAnID : string
     duAn : string (ten cua du an),
     duAnFullName (ten + dia chi),
     diaChi,
     diaChiFullName,
     diaChinh:{tinh, huyen, xa, tinhKhongDau, huyenKongDau, xaKhongDau},
     geo:{lat, lon}
 }
 soPhongNgu: number
 soPhongTam: number
 soTang: number
 loaiTin: number (ban=0, thue=1)
 loaiNhaDat: number (1,2,..)
 image: {cover, cover_small, images:[], images_small:[]}
 chiTiet: string
 comments: [{timeStamp, content, userID}]
 giaM2: number
 huongNha: number
 chinhChu: true/false/null
 nhaMoiXay: true/false/null
 otoDoCua: true/false/null
 source : string (vi du: bds.com, dothi.net, reland)
 timeModified : number (ms)
 status : Number (0 = approved, 1 = Pending }
 goiViTri : {
   level: Number (1: Dac biet, 2: Cao cap, 3: Tieu chuan)
   startDateTime : Number (from 1970)
   length : Number (7 ngày, 14 ngày, 30 ngày...)
 }
 goiTrangChu : {tuong tu goiViTri}
 goiLogo : {tuong tu goiViTri}

 */

var couchbase = require('couchbase');
var util = require("../lib/utils");
var constant = require("../lib/constant");

var N1qlQuery = require('couchbase').N1qlQuery;

var ViewQuery = couchbase.ViewQuery;
var cluster = new couchbase.Cluster('couchbase://localhost:8091');
var bucket = cluster.openBucket('default');
bucket.enableN1ql(['127.0.0.1:8093']);

bucket.operationTimeout = 120 * 1000;

var moment = require('moment');


var DEFAULT_LIMIT = 1000;


/**
id,adsID,
....

*/

class AdsModel {
    constructor(myBucket) {
        this.myBucket = myBucket;
    }

    upsert(adsDto) {
        adsDto.id = adsDto.adsID;
        adsDto.timeModified = new Date().getTime();

        bucket.upsert(adsDto.id, adsDto, function (err, res) {
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

    //may be for testing only
    patchDataInDB(){
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

                //ngayDangTin
                let bdsComDateFormat = 'DD-MM-YYYY';
                if (moment(ads.ngayDangTin, bdsComDateFormat).isValid()) {
                    let ngayDangTinDate = moment(ads.ngayDangTin, bdsComDateFormat);
                    let ngayDangTinYMD = moment(ngayDangTinDate).format(constant.FORMAT.DATE_IN_DB);
                    ads.ngayDangTin = ngayDangTinYMD;
                }

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

    buildWhereForAllData(geoBox, diaChinh, loaiTin, loaiNhaDat, gia, dienTich, soPhongNguGREATER, soPhongTamGREATER, ngayDangTinFrom, huongNha, orderBy, limit, pageNo) {
        var sql = ` WHERE loaiTin = ${loaiTin}`;

        
        if(loaiNhaDat){
            if(loaiNhaDat.constructor === Array && loaiNhaDat.length>0){
                var condition = " and loaiNhaDat in [";
                for(var i = 0; i<loaiNhaDat.length;i++){
                    if(i==loaiNhaDat.length-1){
                        condition = condition + loaiNhaDat[i] + "]";
                    }else{
                        condition = condition + loaiNhaDat[i] + ",";
                    }
                    if(loaiNhaDat[i] == 0){
                        condition = "";
                        break;
                    }
                }
                sql = sql + condition;
            }else{
                sql = sql + ((loaiNhaDat && loaiNhaDat>0) ? " AND loaiNhaDat=" + loaiNhaDat : "");        
            }
        }
        

        if (geoBox) {
            sql = sql + " AND (place.geo.lat BETWEEN " + geoBox[0] + " AND " + geoBox[2] + ")";
            sql = sql + " AND (place.geo.lon BETWEEN " + geoBox[1] + " AND " + geoBox[3] + ")";
        }

        if (diaChinh) {
            if (diaChinh.tinh) {
                sql = `${sql} AND place.diaChinh.tinhKhongDau='${diaChinh.tinh}'`;
            }

            //todo: need remove "Quan" "Huyen" in prefix
            if (diaChinh.huyen) {
              if (diaChinh.huyen=='tu-liem') {
                sql = sql + " and (place.diaChinh.huyenKhongDau = 'nam-tu-liem' or place.diaChinh.huyenKhongDau = 'bac-tu-liem')";
              } else {
                sql = `${sql} AND place.diaChinh.huyenKhongDau='${diaChinh.huyen}'`;
              }
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

        soPhongNguGREATER = Number(soPhongNguGREATER);
        soPhongTamGREATER = Number(soPhongTamGREATER);

        sql = sql + (soPhongNguGREATER ? " AND soPhongNgu  >= " + soPhongNguGREATER : "");

        sql = sql + (soPhongTamGREATER ? " AND soPhongTam  >= " + soPhongTamGREATER : "");

        if ((dienTich) && (dienTich[0] > 1 || dienTich[1] < 9999999)) {
            sql = `${sql} AND (dienTich BETWEEN  ${dienTich[0]} AND ${dienTich[1]})`;
        }

        if(huongNha){
            if(huongNha.constructor === Array && huongNha.length>0){
                var condition = " and huongNha in [";
                for(var i = 0; i<huongNha.length;i++){
                    if(i==huongNha.length-1){
                        condition = condition + huongNha[i] + "]";
                    }else{
                        condition = condition + huongNha[i] + ",";
                    }
                    if(huongNha[i] == 0){
                        condition = "";
                        break;
                    }
                }
                sql = sql + condition;
            }else{
                sql = sql + ((huongNha && huongNha>0) ? " AND huongNha=" + huongNha : "");        
            }
        }

        //sql = sql + ((huongNha && huongNha>0)  ? " AND huongNha=" + huongNha : "");

        if (orderBy) {
            sql = sql + " ORDER BY " + orderBy.orderByField + "  " + orderBy.orderByType;
        }

        if(limit)
            sql = sql + " LIMIT  " + limit;
        if(pageNo) 
            sql = sql + " OFFSET  " + ((pageNo-1)*limit);    

        return sql;
    }

    countForAllData(
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
    ){
        var sql ="SELECT count(*) FROM default t" + this.buildWhereForAllData(geoBox
            , diaChinh 
            , loaiTin
            , loaiNhaDat
            , gia 
            , dienTich 
            , soPhongNguGREATER
            , soPhongTamGREATER
            , ngayDangTinFrom
            , huongNha
        );

        console.log(sql);
        var query = N1qlQuery.fromString(sql);
        bucket.query(query, function(err, all) {
            //console.log("err=", err, all);
            console.log("count " + all[0].$1);
            callback(err,all[0].$1);
        });
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
        , pageNo

    ) {

        if (isNaN(limit)) {
            console.log("WARN", "limit is not a number:" , limit);
            limit = DEFAULT_LIMIT;
        }

        var sql ="SELECT t.* FROM default t" + this.buildWhereForAllData(geoBox
            , diaChinh 
            , loaiTin
            , loaiNhaDat
            , gia 
            , dienTich 
            , soPhongNguGREATER
            , soPhongTamGREATER
            , ngayDangTinFrom
            , huongNha
            , orderBy
            , limit
            , pageNo?pageNo:1
        );
        
        console.log(sql);
        /*
        var query = N1qlQuery.fromString('select count(*) from default');
        bucket.query(query, function(err, all) {
            console.log("err=", err, all);
        });
        */

        //@todo: really need reopen like this ?
        var bucket = cluster.openBucket('default');
        bucket.enableN1ql(['127.0.0.1:8093']);
        bucket.operationTimeout = 60 * 1000;

        var query = N1qlQuery.fromString(sql);

        bucket.query(query, function(err, all) {
            //console.log("err=", err);
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
          //todo: exceptional case for Tu-Liem:
          if (huyen=='tu-liem') {
            sql = sql + " and (place.diaChinh.huyenKhongDau = 'nam-tu-liem' or place.diaChinh.huyenKhongDau = 'bac-tu-liem')";
          } else {
            sql = sql + " and place.diaChinh.huyenKhongDau = '" + huyen + "'";
          }
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
        console.log("sql:" + sql );
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
            
            if (!all)
                all = [];
            console.log("number of ads:" + all.length);
            console.log("Error:" + err);
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
            
            if (!all)
                all = [];
            console.log("number of ads:" + all.length);
            console.log("Error:" + err);
            reply({
                length: all.length,
                list: all
            });
        });

    }
    //End nhannc

    likeAds(payload,reply){
        var adsID = req.payload.adsID;
        var userID = req.payload.userID;
        
    
    }
}

    module.exports = AdsModel;
