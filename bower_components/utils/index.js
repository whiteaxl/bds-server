'use strict';

var striptags = require('striptags');
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


util.popField = function (obj, field){
    var a = obj[field];
    delete obj[field];

    return a;
};


module.exports = util;

if (typeof window !== 'undefined')
   window.RewayUtil = util;