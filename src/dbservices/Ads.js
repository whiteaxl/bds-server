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

var util = require("../lib/utils");
var logUtil = require("../lib/logUtil");
var constant = require("../lib/constant");
var geoUtil = require("../lib/geoUtil");

var bucket = require("../database/mydb");
var N1qlQuery = require('couchbase').N1qlQuery;

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
                logUtil.error("ERROR:" + err);
            }
        })
    }

    countAllAds(onSuccess) {
        var sql = "select count(*) cnt from default where type = 'Ads'";
        var query = N1qlQuery.fromString(sql);

        bucket.query(query, function (err, res) {
            if (err) {
                logUtil.info('query failed'.red, err);
                return;
            }
            logUtil.info('success!', res);

            onSuccess(res[0].cnt);
        });
    }

    getAds(adsID, callback) {
       
        bucket.get(adsID, callback);
    }

   
    buildWhereForAllData(geoBox, diaChinh, loaiTin, loaiNhaDat, gia, dienTich, soPhongNguGREATER, soPhongTamGREATER, ngayDangTinFrom, huongNha, duAnID,orderBy, limit, pageNo) {
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
        if(duAnID)
            sql = sql + " and place.duAnID = '" + duAnID + "' ";

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

    countForAllDataByPolygon(
        callback
        , geoBox
        , polygonCoords
        , diaChinh //tinh, huyen, xa
        , loaiTin
        , loaiNhaDat
        , gia //arrays from,to
        , dienTich //arrays from,to
        , soPhongNguGREATER
        , soPhongTamGREATER
        , ngayDangTinFrom
        , huongNha
        , duAnID
    ){
        var sql ="SELECT place FROM default t" + this.buildWhereForAllData(geoBox
                , diaChinh
                , loaiTin
                , loaiNhaDat
                , gia
                , dienTich
                , soPhongNguGREATER
                , soPhongTamGREATER
                , ngayDangTinFrom
                , huongNha
                , duAnID
            );
        var handleDBCountResult = this._handleDBCountResultByPolygon;

        logUtil.info(sql);
        var query = N1qlQuery.fromString(sql);
        bucket.query(query, function(err, all) {
            // logUtil.info("err=", err, all);
            // logUtil.info("count " + all[0].$1);
            // callback(err,all[0].$1);
            handleDBCountResult(err, all, polygonCoords, callback);
        });
    }

    _handleDBCountResultByPolygon(err, allAds, polygonCoords, callback) {
        let count = 0;
        allAds.forEach((e) => {
            let ads = e;
            let place = ads.place;
            if (geoUtil.isPointInside(place.geo,polygonCoords)) {
                count++;
            }
        });
        callback(err,count);
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
        , duAnID
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
            , duAnID
        );

        logUtil.info(sql);
        var query = N1qlQuery.fromString(sql);
        bucket.query(query, function(err, all) {
            //logUtil.info("err=", err, all);
            logUtil.info("count " + all[0].$1);
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
        , duAnID
        , orderBy//orderByField, orderByType
        , limit
        , pageNo

    ) {

        if (isNaN(limit)) {
            logUtil.info("WARN", "limit is not a number:" , limit);
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
            , duAnID
            , orderBy
            , limit
            , pageNo?pageNo:1
        );
        
        logUtil.info(sql);
        /*
        var query = N1qlQuery.fromString('select count(*) from default');
        bucket.query(query, function(err, all) {
            logUtil.info("err=", err, all);
        });
        */


        var query = N1qlQuery.fromString(sql);

        bucket.query(query, function(err, all) {
            //logUtil.info("err=", err);
            if (!all)
                all = [];
            callback(err, all);
        });
    }

    //loaiTin is mandatory
    queryAllDataByPolygon(
        callback
        , geoBox
        , polygonCoords
        , diaChinh //tinh, huyen, xa
        , loaiTin
        , loaiNhaDat
        , gia //arrays from,to
        , dienTich //arrays from,to
        , soPhongNguGREATER
        , soPhongTamGREATER
        , ngayDangTinFrom
        , huongNha
        , duAnID
        , orderBy//orderByField, orderByType
        , limit
        , pageNo

    ) {

        if (isNaN(limit)) {
            logUtil.info("WARN", "limit is not a number:" , limit);
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
                , duAnID
                , orderBy
            );

        logUtil.info(sql);
        /*
         var query = N1qlQuery.fromString('select count(*) from default');
         bucket.query(query, function(err, all) {
         logUtil.info("err=", err, all);
         });
         */

        var query = N1qlQuery.fromString(sql);

        var handleDBFindResult = this._handleDBFindResultByPolygon;

        bucket.query(query, function(err, all) {
            //logUtil.info("err=", err);
            if (!all)
                all = [];
            // callback(err, all);
            handleDBFindResult(err, all, polygonCoords, limit, pageNo, callback);
        });
    }

    _handleDBFindResultByPolygon(err, allAds, polygonCoords, limit, pageNo, callback) {
        let transformeds = [];
        let index = 0;
        let startFromIndex = (pageNo-1)*limit;
        allAds.forEach((e) => {
            if (transformeds.length >= limit) {
                return;
            }
            let ads = e;
            let place = ads.place;
            if (geoUtil.isPointInside(place.geo,polygonCoords)) {
                if (index >= startFromIndex) {
                    transformeds.push(ads);
                }
                index++;
            }
        });
        callback(err, transformeds);
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
        logUtil.info("sql:" + sql );
        var query = N1qlQuery.fromString(sql);
        return query;
        /*
        bucket.query(query, function(err, all) {
            logUtil.info("number of ads:" + all.length);
            logUtil.info("Error:" + err);
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

        logUtil.info("queryRecentAds: " + sql);

        bucket.query(query, function(err, all) {
            
            if (!all)
                all = [];
            logUtil.info("number of ads:" + all.length);
            logUtil.info("Error:" + err);
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

        logUtil.info("queryBelowPriceAds: " + sql);

        bucket.query(query, function(err, all) {
            
            if (!all)
                all = [];
            logUtil.info("number of ads:" + all.length);
            logUtil.info("Error:" + err);
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

    buildWhereForFilter(filter){

        var sql = ` WHERE loaiTin = ${filter.loaiTin}`;
        
        if(filter.loaiNhaDat){
            if(filter.loaiNhaDat.constructor === Array && filter.loaiNhaDat.length>0){
                var condition = " and loaiNhaDat in [";
                for(var i = 0; i<filter.loaiNhaDat.length;i++){
                    if(i==filter.loaiNhaDat.length-1){
                        condition = condition + filter.loaiNhaDat[i] + "]";
                    }else{
                        condition = condition + filter.loaiNhaDat[i] + ",";
                    }
                    if(filter.loaiNhaDat[i] == 0){
                        condition = "";
                        break;
                    }
                }
                sql = sql + condition;
            }else{
                sql = sql + ((filter.loaiNhaDat && filter.loaiNhaDat>0) ? " AND loaiNhaDat=" + filter.loaiNhaDat : "");        
            }
        } 

        if (filter.geoBox) {
            sql = sql + " AND (place.geo.lat BETWEEN " + filter.geoBox[0] + " AND " + filter.geoBox[2] + ")";
            sql = sql + " AND (place.geo.lon BETWEEN " + filter.geoBox[1] + " AND " + filter.geoBox[3] + ")";
        }

        if (filter.diaChinh) {
            if (filter.diaChinh.tinh) {
                sql = `${sql} AND place.diaChinh.tinhKhongDau='${filter.diaChinh.tinh}'`;
            }

            //todo: need remove "Quan" "Huyen" in prefix
            if (filter.diaChinh.huyen) {
              if (filter.diaChinh.huyen=='tu-liem') {
                sql = sql + " and (place.diaChinh.huyenKhongDau = 'nam-tu-liem' or place.diaChinh.huyenKhongDau = 'bac-tu-liem')";
              } else {
                sql = `${sql} AND place.diaChinh.huyenKhongDau='${filter.diaChinh.huyen}'`;
              }
            }

            if (filter.diaChinh.xa) {
                sql = `${sql} AND place.diaChinh.xaKhongDau='${filter.diaChinh.xa}'`;
            }
        }

        if (filter.ngayDangTinFrom) { //ngayDangTinFrom: 20-04-2016
            sql = `${sql} and ngayDangTin > '${filter.ngayDangTinFrom}'`;
        } 

        if (filter.giaBETWEEN && (filter.giaBETWEEN[0] > 1 || filter.giaBETWEEN[1] < 9999999)) {
            sql = `${sql} AND (gia BETWEEN ${filter.giaBETWEEN[0]} AND ${filter.giaBETWEEN[1]})`;
        }

        if(filter.soPhongNguGREATER){
            let soPhongNguGREATER = Number(filter.soPhongNguGREATER);    
            sql = sql + (soPhongNguGREATER ? " AND soPhongNgu  >= " + soPhongNguGREATER : "");
        }
        if(filter.soPhongTamGREATER){
            let soPhongTamGREATER = Number(filter.soPhongTamGREATER);
            sql = sql + (soPhongTamGREATER ? " AND soPhongTam  >= " + soPhongTamGREATER : "");
        }

        if ((filter.dienTichBETWEEN) && (filter.dienTichBETWEEN[0] > 1 || filter.dienTichBETWEEN[1] < 9999999)) {
            sql = `${sql} AND (dienTich BETWEEN  ${filter.dienTichBETWEEN[0]} AND ${filter.dienTichBETWEEN[1]})`;
        }

        if(filter.huongNha){
            if(filter.huongNha.constructor === Array && filter.huongNha.length>0){
                var condition = " and huongNha in [";
                for(var i = 0; i<filter.huongNha.length;i++){
                    if(i==filter.huongNha.length-1){
                        condition = condition + filter.huongNha[i] + "]";
                    }else{
                        condition = condition + filter.huongNha[i] + ",";
                    }
                    if(filter.huongNha[i] == 0){
                        condition = "";
                        break;
                    }
                }
                sql = sql + condition;
            }else{
                sql = sql + ((filter.huongNha && filter.huongNha>0) ? " AND huongNha=" + filter.huongNha : "");        
            }
        }
        if(filter.duAnID)
            sql = sql + " and place.duAnID = '" + filter.duAnID + "' ";

        //sql = sql + ((huongNha && huongNha>0)  ? " AND huongNha=" + huongNha : "");
        if(filter.soPhongNgu){
            let soPhongNgu = Number(filter.soPhongNgu);
            sql = sql + " AND soPhongNgu  = " + soPhongNgu;
        }
        if(filter.soPhongTam){
            let soPhongTam = Number(filter.soPhongTam);
            sql = sql + " AND soPhongTam  = " + soPhongTam;
        }
        if(filter.soTang){
            let soTang = Number(filter.soTang);
            sql = sql + " AND soTang  = " + soTang;
        }
        if (filter.orderBy) {
            sql = sql + " ORDER BY " + filter.orderBy.orderByField + "  " + filter.orderBy.orderByType;
        }

        if(filter.limit)
            sql = sql + " LIMIT  " + filter.limit;
        if(filter.pageNo) 
            sql = sql + " OFFSET  " + ((filter.pageNo-1)*filter.limit);    

        return sql;

    }

    countWithFilter(callback,filter){
        filter.limit = undefined;
        filter.pageNo = undefined;
        filter.orderBy = undefined;        
        var sql ="SELECT count(*) FROM default t " + this.buildWhereForFilter(filter);        
        logUtil.info(sql);
        var query = N1qlQuery.fromString(sql);
        bucket.query(query, function(err, all) {
            //logUtil.info("err=", err, all);
            logUtil.info("count " + all[0].$1);
            callback(err,all[0].$1);
        });
    }

    queryWithFilter(callback,filter){
        var sql ="SELECT t.* FROM default t " + this.buildWhereForFilter(filter);

        logUtil.info(sql);
        var query = N1qlQuery.fromString(sql);
        bucket.query(query, function(err, all) {
            if (!all)
                all = [];
            callback(err, all);
        });
    }

    query(q, callback){
        var sql ="SELECT " +
          " id, gia, loaiTin, dienTich, soPhongNgu, soTang, soPhongTam, " +
          " image, place, giaM2, loaiNhaDat, huongNha, ngayDangTin " +
          " FROM default t "
          + this._buildWhere(q) + this._buildOrderByAndPaging(q);

        logUtil.info(sql);
        var query = N1qlQuery.fromString(sql);
        bucket.query(query, function(err, all) {
            if (!all)
                all = [];
            callback(err, all);
        });
    }

    count(q, callback){
        var sql ="SELECT count(*) cnt FROM default t " + this._buildWhere(q);

        logUtil.info(sql);
        var query = N1qlQuery.fromString(sql);
        bucket.query(query, function(err, res) {
            if (err) {
                logUtil.error("count error:", err);
            } else {
                if (!res[0]) {
                    logUtil.error("count warn, no res[0]");
                } else {
                    callback(err, res[0].cnt);
                }
            }
            
        });
    }



    _buildOrderByAndPaging(q) {
        let sql = " ";
       
        if (q.orderBy) {
            let name = q.orderBy.name;
            
            if (q.orderBy.type == 'DESC') {
                sql = sql + " ORDER BY " + name + "  " + q.orderBy.type;
            } else {
                if (name == 'gia' || name == 'dienTich' || name == 'giaM2') {
                    sql = `${sql} ORDER BY case when ${name} is not null then ${name} else 999999999 end ${q.orderBy.type}`;
                } else {
                    sql = sql + " ORDER BY " + name + "  " + q.orderBy.type;
                } 
            }
            
            //todo: not support DESC order for now, wait couchbase 4.5.1
            //if (q.orderBy.type=='DESC') {
            //    logUtil.warn("TODO:  not support DESC order for now, wait couchbase 4.5.1 | ", q.orderBy);
            //}
            //let name = q.orderBy.name;
            //sql = `${sql} ORDER BY ${name}`;
        } else {
            sql = `${sql} ORDER BY ngayDangTin DESC`;
        }

        if(q.dbLimit)
            sql = sql + " LIMIT  " + q.dbLimit;
        if(q.dbPageNo)
            sql = sql + " OFFSET  " + ((q.dbPageNo-1)*q.dbLimit);

        return sql;
    }

    _buildWhere(q){
        var sql = ` WHERE type='Ads' and loaiTin = ${q.loaiTin}`;

        if(q.loaiNhaDat){
            var condition = " and loaiNhaDat in [";
            for(var i = 0; i<q.loaiNhaDat.length;i++){
                if(i==q.loaiNhaDat.length-1){
                    condition = condition + q.loaiNhaDat[i] + "]";
                }else{
                    condition = condition + q.loaiNhaDat[i] + ",";
                }
                if(q.loaiNhaDat[i] == 0){
                    condition = "";
                    break;
                }
            }
            sql = sql + condition;
        } else {
            //sql = sql + " and loaiNhaDat is not missing "; //always have this
        }

        if (q.viewport) {
            let vp = q.viewport;
            sql = sql + " AND (place.geo.lat BETWEEN " + vp.southwest.lat + " AND " + vp.northeast.lat + ")";
            sql = sql + " AND (place.geo.lon BETWEEN " + vp.southwest.lon + " AND " + vp.northeast.lon + ")";
        }

        if (q.diaChinh) {
            let dc = q.diaChinh;
            if (dc.tinhKhongDau) {
                sql = `${sql} AND place.diaChinh.tinhKhongDau='${dc.tinhKhongDau}'`;
            }

            if (dc.huyenKhongDau) {
                sql = `${sql} AND place.diaChinh.huyenKhongDau='${dc.huyenKhongDau}'`;
            }
            if (dc.xaKhongDau) {
                sql = `${sql} AND place.diaChinh.xaKhongDau='${dc.xaKhongDau}'`;
            }
            if (dc.duAnKhongDau) {
                sql = `${sql} AND place.diaChinh.duAnKhongDau='${dc.duAnKhongDau}'`;
            }
        }

        if (q.ngayDangTinGREATER) { //ngayDangTinFrom: 20-04-2016
            sql = `${sql} and ngayDangTin > '${q.ngayDangTinGREATER}'`;
        }

        if (q.giaBETWEEN && (q.giaBETWEEN[0] > 1 || q.giaBETWEEN[1] < 9999999)) {
            sql = `${sql} AND (gia BETWEEN ${q.giaBETWEEN[0]} AND ${q.giaBETWEEN[1]})`;
        }

        if(q.soPhongNguGREATER){
            let soPhongNguGREATER = Number(q.soPhongNguGREATER);
            sql = sql + (soPhongNguGREATER ? " AND soPhongNgu  >= " + soPhongNguGREATER : "");
        }
        if(q.soPhongTamGREATER){
            let soPhongTamGREATER = Number(q.soPhongTamGREATER);
            sql = sql + (soPhongTamGREATER ? " AND soPhongTam  >= " + soPhongTamGREATER : "");
        }
        if(q.soTangGREATER){
            let soTangGREATER = Number(q.soTangGREATER);
            sql = sql + (soTangGREATER ? " AND soTang  >= " + soTangGREATER : "");
        }

        if ((q.dienTichBETWEEN) && (q.dienTichBETWEEN[0] > 1 || q.dienTichBETWEEN[1] < 9999999)) {
            sql = `${sql} AND (dienTich BETWEEN  ${q.dienTichBETWEEN[0]} AND ${q.dienTichBETWEEN[1]})`;
        }

        if(q.huongNha){
            var condition = " and huongNha in [";
            for(var i = 0; i<q.huongNha.length;i++){
                if(i==q.huongNha.length-1){
                    condition = condition + q.huongNha[i] + "]";
                }else{
                    condition = condition + q.huongNha[i] + ",";
                }
                if(q.huongNha[i] == 0){
                    condition = "";
                    break;
                }
            }
            sql = sql + condition;
        }

        if(q.soPhongNgu){
            let soPhongNgu = Number(q.soPhongNgu);
            sql = sql + " AND soPhongNgu  = " + soPhongNgu;
        }
        if(q.soPhongTam){
            let soPhongTam = Number(q.soPhongTam);
            sql = sql + " AND soPhongTam  = " + soPhongTam;
        }

        if(q.soTang){
            let soTang = Number(q.soTang);
            sql = sql + " AND soTang  = " + soTang;
        }
        
        if (q.gia === -1) {
            sql = sql + " AND gia is missing";
        } else if (q.gia) {
            sql = sql + " AND gia = " + q.gia ;
        }

        if (q.dienTich === -1) {
            sql = sql + " AND dienTich is missing";
        } else if (q.dienTich) {
            sql = sql + " AND dienTich = " + q.dienTich ;
        }

        //need add not missing for order by also
        /*
        if (q.orderBy) {
            let name = q.orderBy.name;
            sql = `${sql} AND ${name} is not missing`;
        } else {
            sql = sql + " AND ngayDangTin is not missing"
        }
        */

        return sql;

    }
}


module.exports = AdsModel;
