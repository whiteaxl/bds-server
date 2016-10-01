'use strict';

var striptags = require('striptags');
var moment = require('moment');
var constant = require("../lib/constant");
var DanhMuc = require("../lib/DanhMuc");
var cfg = require('../config');
var _ = require('lodash');


var util = {};


util.locDau = function(str) {
    var a1 = locDauInt(str);
    var a2 = locDauInt(a1);

    return a2;
};

util.locHtml = function(str) {
    if(!str) {
        return str
    }
    str= str.replace(/&lt;|&LT|&#x0003C;|&#60;/g,"<");
    str= str.replace(/&nbsp;|&#160;/g," ");
    str= str.replace(/&quot;|&QUOT;|&#x00022;|&#34;/g,"\"");
    str= str.replace(/&gt;|&GT;|&#x0003E;|&#62;/g,">");
    str= str.replace(/&amp;|&AMP;|&#x00026;|&#38;/g,"&");
    return str;
};

var locDauInt = function(str) {
    if(!str) {
        return str
    }
    //var str = (document.getElementById("title").value);
    str= str.toLowerCase();
    str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|à/g,"a");
    str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
    str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
    str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ộ|ớ|ợ|ở|ỡ|ọ/g,"o");
    str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
    str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
    str= str.replace(/đ/g,"d");
    str= str.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|~/g,"-");
    str= str.replace(/-+-/g,"-"); //thay thế 2- thành 1-
    str= str.replace(/^\-+|\-+$/g,"");//cắt bỏ ký tự - ở đầu và cuối chuỗi
    return str;
};

util.roundToTwo = function(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

util.getPriceDisplay = function(val, loaiTin,forWeb) {
    try {
        if (!val) {
            return "Thỏa thuận";
        }

        val = Number(val);

        if (loaiTin===0) { //ban
            if (val < 1000) {
                return util.roundToTwo(val) + " triệu";
            }

            return util.roundToTwo(val/1000) + " tỷ";
        } else {
            return util.roundToTwo(val) +  (forWeb?"triệu":"triệu");
        }
    } catch(ex) {
        console.log("Error when getPriceDisplay of " + val, ex)
    }

};

util.getDienTichDisplay = function(val) {
    if (!val) {
        return "Không rõ";
    }

    return val + "m²";
};

util.replaceBrHtml = function(string_to_replace) {
    return string_to_replace.replace(/&nbsp;/g, ' ').replace(/<br\s*\/?>/mg,"\n\r");
    if (!val) {
        return "Không rõ";
    }

};


util.replaceBrToDowntoLine = function(inputString) {
    var kq = "";
    var Timkiem = 'Tìm kiếm theo từ khóa';

    var kqReplace = util.replaceBrHtml(inputString);
    var kqReplaceA = striptags(kqReplace);

    if (inputString ) {
        var idx = kqReplaceA.indexOf(Timkiem);
        if(idx >0)
            kq = kqReplaceA.substring(0,idx);
        else
            kq = kqReplaceA;
    }
    return kq;
};

util.removeAllHtmlTagAndReplaceOneString = function(inputString, replaceString) {
    var kqRemove = striptags(inputString);
    return (kqRemove.replace(replaceString,"")).trim();
};


util.popField = function (obj, field){
    var a = obj[field];
    delete obj[field];

    return a;
};
// Input string is 25-05-2015 to Date type
util.parseDate = function(dateStr) {
    var parts = dateStr.split("-");
    return new Date(parts[2], parts[1] - 1, parts[0]);
};

util.equalDate = function(date1Str,date2Str) {
    var date1= this.parseDate(date1Str);
    var date2= this.parseDate(date2Str);
    if ((date1 <date2) ||(date1 >date2))
        return false;
    else
        return true;

};

util.parseDate = function(dateStr) {
    var parts = dateStr.split("-");
    return new Date(parts[2], parts[1] - 1, parts[0]);
};


util.convertFormatDate= function(ngayDangTin) {
    var bdsComDateFormat = 'DD-MM-YYYY';
    if (moment(ngayDangTin, bdsComDateFormat).isValid()) {
        var ngayDangTinDate = moment(ngayDangTin, bdsComDateFormat);
        return  moment(ngayDangTinDate).format(constant.FORMAT.DATE_IN_DB);
    }

};

util.convertFormatDatetoYYYYMMDD= function(ngayDangTin) {
    var bdsComDateFormat = 'DD/MM/YYYY';
    if (moment(ngayDangTin, bdsComDateFormat).isValid()) {
        var ngayDangTinDate = moment(ngayDangTin, bdsComDateFormat);
        return  moment(ngayDangTinDate).format(constant.FORMAT.DATE_IN_DB);
    }

};


util.isEmail = function(str) {
    return str && (str.indexOf('@') > -1);
};


//comments out sicne seems not used
// //giaDESC, dienTichASC, ngayDangTinASC, giaM2DESC, soPhongNguDESC, soPhongTamDESC
// util.toOrderBy = function(orderByPam) {
//     var orderByField;
//     var orderByType;
//     var ret = null;

//     if (orderByPam){
//         var arr = orderByPam.split(",");
//         var firstElement = arr[0];
//         var len =   firstElement.length;

//         if(firstElement.endsWith("DESC")){
//             orderByField = firstElement.substring(0,len - 4);
//             orderByType =  "DESC";
//         } else {
//             if (firstElement.endsWith("ASC"))
//                 orderByField = firstElement.substring(0,len - 3);
//             else
//                 orderByField = firstElement;

//             orderByType =  "ASC";
//         }

//         ret = {orderByField, orderByType};
//     }

//     return ret;
// };

util.toNumber = function(val) {
    if (isNaN(val)) {
        console.log("Not a number, will return null:" + val);
        return null;
    }

    return Number(val);
};


util.convertQuery2String = function(query) {
    let toStrRange = (range) => {
      if (range && range[0] == 0 && range[1] == DanhMuc.BIG) {
        return undefined;
      }
      return range;
    };

    // let {loaiTin, loaiNhaDat, giaBETWEEN, soPhongNguGREATER, dienTichBETWEEN,
    //   orderBy, limit, huongNha, ngayDangTinGREATER, polygon, pageNo, soPhongTamGREATER,
    //   diaChinh, circle, viewport, isIncludeCountInResponse
    // } = query;

    let tmp = {
      'tin' : query.loaiTin,
      'nhà đất' : query.loaiNhaDat == 0 ? undefined : query.loaiNhaDat,
      'giá' : toStrRange(query.giaBETWEEN),
      'ngủ' : query.soPhongNguGREATER == 0 ? undefined : query.soPhongNguGREATER,
      'tắm' : query.soPhongTamGREATER == 0 ? undefined : query.soPhongTamGREATER,
      'dt' : toStrRange(query.dienTichBETWEEN),
      'orderBy' : query.orderBy ,
      'diaChinh': query.diaChinh ,
      'viewport' : query.viewport,
      'circle' : query.circle,
      'limit' : query.limit || 250 || undefined,
      'hướng' : query.huongNha || undefined,
      'ngày' : query.ngayDangTinGREATER || undefined,
      'polygon' : query.polygon || undefined,
      'pageNo' : query.pageNo || undefined,
      'isIncludeCountInResponse' : query.isIncludeCountInResponse || undefined
    };

    return JSON.stringify(tmp);
};

const defaultItemInCollection = {
  adsID: "EMPTY",
  giaFmt: " ",
  khuVuc: " ",
  soPhongNguFmt: " ",
  soPhongTamFmt: " ",
  dienTichFmt: " ",
  cover: "http://203.162.13.177:5000/web/asset/img/reland_house_large.jpg"
};

util.appDefault = function(collection) {
  for (var i = collection.data.length; i < 5; i++) {
    collection.data.push(defaultItemInCollection);
  }

  return collection;
};

util.convertListResult = function(list) {
  let result = list.map((e) => {
    let cover = e.image.cover || cfg.noCoverUrl;
    if (cover == '/web/asset/img/reland_house_large.jpg') {
      cover = cfg.noCoverUrl
    }

    return {
      adsID: e.adsID,
      loaiTin: e.loaiTin,
      loaiNhaDat: e.loaiNhaDat,
      giaFmt: e.giaFmt || undefined,
      dienTichFmt: e.dienTichFmt || undefined,
      khuVuc: e.place.diaChinh.huyen ?   e.place.diaChinh.huyen + ", " + e.place.diaChinh.tinh : e.place.diaChinh.tinh,
      soPhongNguFmt: e.soPhongNguFmt || undefined,
      soPhongTamFmt: e.soPhongTamFmt || undefined,
      cover: cover
    }
  });
  return result;
};

util.formatHomeBst = function(title1, title2, query, res){
    if (!res.list || res.list.length == 0) {
      return {
          title1: title1,
          title2: title2,
          data: [],
          query: query
        }
    }
    let collection = {
      title1: title1,
      title2: title2,
      data: convertListResult(res.list),
      query: query
    };
    return collection;
}

util.generateHomeSearchSeries = function(query,currentLocation, searcher, searcherCallback){    
    console.log("homeData4App V2 " + JSON.stringify(query));    
    query.limit = 5;
    query.pageNo = 1;
    query.loaiTin = query.loaiTin ? query.loaiTin : 0;
    let ngayDangTinBegin = moment().subtract(365, 'days').format('YYYYMMDD');
    query.isIncludeCountInResponse = false; //no need count
    query.ngayDangTinGREATER = ngayDangTinBegin;
    //todo: order ?
    var lastQuery = undefined;
    if(query){
        lastQuery = {};
        Object.assign(lastQuery, query);
    }
    let searchDiaChinh = query.diaChinh;
    // services.getDiaChinhKhongDauByGeocode(currentLocation.lat, currentLocation.lon)
    function formatBst(title1, title2, query, res){
        if (!res.list || res.list.length == 0) {
          return {
              title1: title1,
              title2: title2,
              data: [],
              query: query
            }
        }
        let collection = {
          title1: title1,
          title2: title2,
          data: convertListResult(res.list),
          query: query
        };
        return collection;
    }
    function appDefault(collection) {
      for (var i = collection.data.length; i < 5; i++) {
        collection.data.push(defaultItemInCollection);
      }

      return collection;
    };

    function convertListResult(list) {
      let result = list.map((e) => {
        let cover = e.image.cover || cfg.noCoverUrl;
        if (cover == '/web/asset/img/reland_house_large.jpg') {
          cover = cfg.noCoverUrl
        }

        return {
          adsID: e.adsID,
          loaiTin: e.loaiTin,
          loaiNhaDat: e.loaiNhaDat,
          giaFmt: e.giaFmt || undefined,
          dienTichFmt: e.dienTichFmt || undefined,
          khuVuc: e.place.diaChinh.huyen ?   e.place.diaChinh.huyen + ", " + e.place.diaChinh.tinh : e.place.diaChinh.tinh,
          soPhongNguFmt: e.soPhongNguFmt || undefined,
          soPhongTamFmt: e.soPhongTamFmt || undefined,
          cover: cover
        }
      });
      return result;
    };

    function generateSearchNgangGiaFn(query,diaChinh){
      let results = [];
      let loaiNhaDat = [];
      let loaiTin = query.loaiTin;
      if(!diaChinh)
        diaChinh = {};
      if(loaiTin ==0){
        loaiNhaDat = [1,2,3,4,7,5];
      }else if(loaiTin==1){
        loaiNhaDat = [1,2,3,4];
      }
      
      _(loaiNhaDat).forEach(function(value) {
        // console.log("tim log loaiNhaDat" + value);
        results.push(function(callback){
          let queryNgangGia = {}; Object.assign(queryNgangGia, query);
          let loaiNhaDatName = DanhMuc.getLoaiNhaDatForDisplayNew(loaiTin,value);
          let giaDisplay = " ngang giá";
          if(!queryNgangGia.giaBETWEEN || (queryNgangGia.giaBETWEEN[0]==0 && queryNgangGia.giaBETWEEN[1]> 99999)){
            queryNgangGia.giaBETWEEN = [];
            queryNgangGia.giaBETWEEN[0] = 0;
            queryNgangGia.giaBETWEEN[1] = 5000;
            if(loaiTin==0){
              if(value == 1 || value ==2 || value ==5 || value ==7){
                loaiNhaDatName = loaiNhaDatName + " dưới 5 tỷ";
              }else{
                loaiNhaDatName = loaiNhaDatName + " dưới 20 tỷ";    
              }
            }else if(loaiTin == 1){
              if(value == 4){
                loaiNhaDatName = loaiNhaDatName + " dưới 5 triệu";
              }else{
                loaiNhaDatName = loaiNhaDatName + " dưới 20 triệu";    
              }
            }
            
          }else{
            loaiNhaDatName = loaiNhaDatName + " ngang giá";
          }
          // queryNgangGia.ngayDangTinGREATER = 700;  
          queryNgangGia.orderBy = {name:"ngayDangTin", type: "DESC"};
          queryNgangGia.loaiNhaDat = [value];
          // searchAds(loaiNhaDatName   ,diaChinh?diaChinh.fullName:"",queryNgangGia,callback);
          searcher(queryNgangGia).then(function(res){            
            res.data.list =  formatBst(loaiNhaDatName   ,diaChinh?diaChinh.fullName:"",queryNgangGia,res.data);
            searcherCallback(res);
            callback(null,res.data.list);
          });  

        });
        // console.log("tim log " + results[0]);
      });
      
      return results;

    }
    if(currentLocation){
        var fl = [];
        query.diaChinh = currentLocation;

        fl.push(function (callback) {
          let queryNearBy = {};
          Object.assign(queryNearBy, query);
          queryNearBy.diaChinh.xaKhongDau = query.diaChinh.xa || undefined;
          searcher(queryNearBy).then(function(res){            
            res.data.list =  formatBst("Nhà Gần Vị Trí Bạn", query.diaChinh.fullName, queryNearBy,res.data);
            searcherCallback(res);
            callback(null,res.data.list);
          });              
        });        
    }
    if(lastQuery){
        fl.push(
            function (callback) {
              let queryMoiDang = {};
              Object.assign(queryMoiDang, query);
              queryMoiDang.orderBy = {
                name: "ngayDangTin",
                type: "DESC"
              };
              // searchAds("Nhà Mới Đăng", query.diaChinh?(query.diaChinh.fullName):query.fullName, queryMoiDang, callback);
              searcher(queryMoiDang).then(function(res){            
                res.data.list =  formatBst("Nhà Mới Đăng", query.diaChinh?(query.diaChinh.fullName):query.fullName, queryMoiDang,res.data);
                searcherCallback(res);
                callback(null,res.data.list);
              });   
            }
          );
        if(lastQuery.giaBETWEEN && !(lastQuery.giaBETWEEN[0] ==0 && lastQuery.giaBETWEEN[1] > 999999)){
        
        }
        let ngangGiaFl = generateSearchNgangGiaFn(lastQuery,query.diaChinh); 
        fl = _.concat(fl,ngangGiaFl);
      // console.log("tim log bc " + ngangGiaFl[1]);
    }else{
        console.log("tim log not have last query");
        fl.push(
          function (callback) {
            let queryMoiDang = {};
            Object.assign(queryMoiDang, query);
            queryMoiDang.orderBy = {
              name: "ngayDangTin",
              type: "DESC"
            };

            //searchAds("Nhà Mới Đăng", query.diaChinh?(query.diaChinh.fullName):query.fullName, queryMoiDang, callback);
            searcher(queryMoiDang).then(function(res){            
                res.data.list =  formatBst("Nhà Mới Đăng", query.diaChinh?(query.diaChinh.fullName):query.fullName, queryMoiDang,res.data);
                searcherCallback(res);
                callback(null,res.data.list);
            }); 
          }
        );
    }
    
    return fl;
}

module.exports = util;

if (typeof(window) !== 'undefined')
    window.RewayUtil = util;