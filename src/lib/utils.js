'use strict';

var striptags = require('striptags');
var moment = require('moment');
var constant = require("../lib/constant");
var util = {};


util.locDau = function(str) {
    var a1 = locDauInt(str);
    var a2 = locDauInt(a1);

    return a2;
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

util.getPriceDisplay = function(val, loaiTin) {
    if (!val) {
        return "Thỏa thuận";
    }

    if (loaiTin===0) { //ban
        if (val < 1000) {
            return val + " TRIỆU";
        }

        return (val/1000).toFixed(2) + " TỶ";
    } else {
        return val.toFixed(2) + " TRIỆU/THÁNG";
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
    let bdsComDateFormat = 'DD-MM-YYYY';
    if (moment(ngayDangTin, bdsComDateFormat).isValid()) {
        let ngayDangTinDate = moment(ngayDangTin, bdsComDateFormat);
        return  moment(ngayDangTinDate).format(constant.FORMAT.DATE_IN_DB);
    }

};

util.isEmail = function(str) {
  return str && (str.indexOf('@') > -1);
};

module.exports = util;

if (typeof(window) !== 'undefined')
    window.RewayUtil = util;