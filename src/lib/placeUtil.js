'use strict';

var _ = require("lodash");

var util = require("../lib/utils");

var placeUtil = {};


placeUtil.getDuAnFullName = function(place) {
    if (!place.duAn) {
        return null;
    }

    var ret = "";
    var _appendIfHave = function(ret, value) {
        if (ret)
            ret =  ret + ", " + value;
        else
            ret =  value;

        return ret;
    };

    ret = _appendIfHave(ret, place.duAn);

    ret = _appendIfHave(ret, place.diaChinh.huyen);

    ret = _appendIfHave(ret, place.diaChinh.tinh);

    return ret;
};

placeUtil.getDiaChinhFromGooglePlace = function(place) {
    var tinh ="";
    var huyen ="";
    var xa ="";

    for (var i = 0; i < place.address_components.length; i++)
    {
        var addr = place.address_components[i];

        if (addr.types[0] == placeUtil.type.TINH){
            tinh = addr.long_name;
        }

        if (addr.types[0] == placeUtil.type.HUYEN){
            huyen = addr.long_name;
        }

        if (addr.types[0] == placeUtil.type.XA || addr.types[0] == placeUtil.type.XA2){
            xa = addr.long_name;
        }
    }

    //todo: Name tu liem ? harded code for now
    if (huyen == "Từ Liêm") {
        huyen = "Nam Từ Liêm";
    }

    var diaChinh = {
        tinh: this.chuanHoa(tinh),
        huyen: this.chuanHoa(huyen),
        xa: this.chuanHoa(xa),
        tinhCoDau : tinh,
        huyenCoDau : huyen,
        xaCoDau : xa
    };

    return diaChinh;
};

placeUtil.getDiaChinh = function(diaChi, needRemovePrefix) {
    var spl = diaChi.split(",");
    if (!spl || spl.length == 0) {
        spl = diaChi.split("-");
    }

    var diaChinh = {};

    var i = spl.length;
    diaChinh.tinh = spl[--i].trim();
    if(diaChinh.tinh)
        diaChinh.tinhKhongDau =util.locDau(diaChinh.tinh);

    var rawHuyen = spl[--i];
    if (rawHuyen) {
        if (needRemovePrefix) {
            diaChinh.huyen = rawHuyen.trim().replace("Quận ", "").replace("Huyện ", "");
        } else {
            diaChinh.huyen = rawHuyen.trim();
        }
        
        if(diaChinh.huyen)
            diaChinh.huyenKhongDau =util.locDau(diaChinh.huyen);
    } else {
        console.log("WARN -- no HUYEN information " + diaChi);
    }

    if (i>0) {
        var v = spl[--i].trim();
        if (!v.startsWith("Dự án")) {
            diaChinh.xa = v;
            if(diaChinh.xa)
                diaChinh.xaKhongDau =util.locDau(diaChinh.xa);
        } else {
            return diaChinh;
        }
    }

    if (i>0) {
        var v = spl[--i].trim();
        if (!v.startsWith("Dự án")) {
            diaChinh.duong = v;
        } else {
            return diaChinh;
        }
    }


    return diaChinh;
};

placeUtil.fullName = function(place) {
    //todo: other types
    if (place.placeType === "Quan" || place.placeType  === "Huyen") {
        return place.placeName + ", " + place.parentName;
    }

    return place.placeName;
};
// return Quoc Gia form Place.Place is type of Google api
placeUtil.getQuocGia = function(place) {

    var getCountry ="";

    for (var i = 0; i < place.address_components.length; i++)
    {
        var addr = place.address_components[i];

        if (addr.types[0] == 'country'){
            getCountry = addr.long_name;
        }

    }
    return getCountry;
};

// return Tinh form Place.Place is type of Google api
placeUtil.getTinh = function(place) {

    var Tinh ="";

    for (var i = 0; i < place.address_components.length; i++)
    {
        var addr = place.address_components[i];

        if (addr.types[0] == placeUtil.type.TINH){
            Tinh = addr.long_name;
        }

    }
    return Tinh;
};

// return Huyen form Place.Place is type of Google api
placeUtil.getHuyen = function(place) {

    var Huyen ="";

    for (var i = 0; i < place.address_components.length; i++)
    {
        var addr = place.address_components[i];

        if (addr.types[0] == placeUtil.type.HUYEN){
            Huyen = addr.long_name;
        }

    }
    return Huyen;
};

// return Xa form Place.Place is type of Google api
placeUtil.getXa = function(place) {

    var Xa ="";

    for (var i = 0; i < place.address_components.length; i++)
    {
        var addr = place.address_components[i];

        if ((addr.types[0] == placeUtil.type.XA) || (addr.types[0] == placeUtil.type.XA2))
        {
            Xa = addr.long_name;
        }

    }
    return Xa;
};

// chuan hoa va bo dau 1 string
placeUtil.chuanHoaAndLocDau = function(str) {
    if (!str) {
        return null;
    }

    var result = str;

    /* No need this
    var COMMON_WORDS = [
        'Quận ','Huyện ',
        'Tỉnh ', 'Thành phố ','TP.' ,'Tp.' ,'tp.','tp ' ,'TP ',
        'Phường ' ,'Xã ', 'Thị trấn '
    ];

    COMMON_WORDS.forEach((e) => {
      if (result.startsWith(e)) {
        result = result.substring(e.length)
      }
    });
    */

    result = util.locDau(result);

    return result;
};

// chuan hoa va bo dau 1 string: tu google
placeUtil.chuanHoa = function(string) {

    if (!string) {
        return null;
    }

    var result = util.locDau(string);

    var COMMON_WORDS = {
        '-district': '',
        '-vietnam':'',
        '-province':'',
        'hanoi' : 'ha-noi',
    };
    for (var f in COMMON_WORDS) {
        result = result.replace(f,COMMON_WORDS[f]);
    }

    return result;
};

placeUtil.type = {
    TINH : "administrative_area_level_1",
    HUYEN : "administrative_area_level_2",
    XA : "administrative_area_level_3",
    XA2 : "sublocality_level_1",
    DUONG : "route"
};

placeUtil.typeName = {
    TINH : "Tỉnh",
    HUYEN : "Huyện",
    XA : "Xã",
    DUONG : "Đường",
    DIA_DIEM: "Địa điểm"

};

placeUtil.chuanHoaDiaChinh = function(diaChinh) {
    if (diaChinh) {
        diaChinh.tinhKhongDau = this.chuanHoa(diaChinh.tinhKhongDau);
    }
};

placeUtil.isHuyen = function(place) {
    var placeTypes=place.types;

    if (_.indexOf(placeTypes, placeUtil.type.HUYEN) > -1) {
        return true;
    }

    if (_.indexOf(placeTypes, 'political') > -1 && _.indexOf(placeTypes, 'locality') > -1
       && (place.address_components.length == 3 || place.formatted_address.split(",").length == 3)) {
        return true;
    }

    /*
    if (_.indexOf(placeTypes, 'political') > -1
        && _.indexOf(placeTypes, 'sublocality') > -1
      && _.indexOf(placeTypes, 'sublocality_level_1') > -1

        && ( place.formatted_address.indexOf("District") > -1 )
    ) {
        return true;
    }
    */

    return false;
};

placeUtil.getTypeName = function(place) {
    var placeTypes = place.types;

    if (_.indexOf(placeTypes, placeUtil.type.TINH) > -1) {
        return placeUtil.typeName.TINH;
    }
    if (placeUtil.isHuyen(place)) {
        return placeUtil.typeName.HUYEN;
    }

    if (_.indexOf(placeTypes, placeUtil.type.XA) > -1) {
        return placeUtil.typeName.XA;
    }

    if (_.indexOf(placeTypes, placeUtil.type.XA2) > -1) {
        return placeUtil.typeName.XA;
    }

    if (_.indexOf(placeTypes, 'political') > -1
      && (_.indexOf(placeTypes, 'locality') > -1
            || _.indexOf(placeTypes, 'sublocality_level_1') > -1
            || _.indexOf(placeTypes, 'neighborhood') > -1
      )
      && (place.address_components.length == 4 || place.formatted_address.split(",").length == 4)) {
        return placeUtil.typeName.XA;
    }

    if (_.indexOf(placeTypes, placeUtil.type.DUONG) > -1) {
        return placeUtil.typeName.DUONG;
    }

    return placeUtil.typeName.DIA_DIEM;
};

placeUtil.getShortName = function(fullName) {
    if (!fullName) {
        return null;
    }

    var result = fullName;

    var COMMON_WORDS = [
        {val1 : ', Huyện ', val2 :', '},
        {val1 : ', Tỉnh ', val2 :', '},
        {val1 : ', Thành phố ', val2 :', '},
        {val1 : ', Quận ', val2 :', Q. '},
      {val1 : 'Thị trấn ', val2 :'TT. '},
      {val1 : 'Phường ', val2 :'P. '},
        {val1 : 'Thị xã ', val2 :'Tx. '},
    ];

    COMMON_WORDS.forEach((e) => {
        result = result.replace(e.val1, e.val2)
    });

    return result;
};

placeUtil.isOnePoint = function(place) {
    var name = placeUtil.relandTypeName || placeUtil.getTypeName(place);
    return  name === placeUtil.typeName.DIA_DIEM || name === placeUtil.typeName.DUONG;
};

module.exports  = placeUtil;

if (typeof(window) !== 'undefined')
   window.RewayPlaceUtil = placeUtil;
