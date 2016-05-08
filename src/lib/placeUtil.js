'use strict';

var _ = require("lodash");
var util = require("../lib/utils");

var placeUtil = {};


placeUtil.getDuAnFullName = function(place) {
    if (!place.duAn) {
        return null;
    }

    let ret = "";
    let _appendIfHave = function(ret, value) {
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
            tinh = this.chuanHoa(addr.long_name);
        }

        if (addr.types[0] == placeUtil.type.HUYEN){
            huyen = this.chuanHoa(addr.long_name);
        }

        if (addr.types[0] == placeUtil.type.XA || addr.types[0] == placeUtil.type.XA2){
            xa = this.chuanHoa(addr.long_name);
        }
    }

    let diaChinh = {
        tinh: tinh,
        huyen: huyen,
        xa: xa
    };

    return diaChinh;
};

placeUtil.getDiaChinh = function(diaChi) {
    let spl = diaChi.split(",");
    let diaChinh = {};

    let i = spl.length;
    diaChinh.tinh = spl[--i].trim();
    let rawHuyen = spl[--i];
    if (rawHuyen) {
        diaChinh.huyen = rawHuyen.trim();
    } else {
        console.log("WARN -- no HUYEN information " + diaChi);
    }

    if (i>0) {
        let v = spl[--i].trim();
        if (!v.startsWith("Dự án")) {
            diaChinh.xa = v;
        } else {
            return diaChinh;
        }
    }

    if (i>0) {
        let v = spl[--i].trim();
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
placeUtil.chuanHoa = function(string) {

    var result = util.locDau(string);

    const COMMON_WORDS = {
        '-district': '',
        '-vietnam':'',
        'hanoi' : 'ha-noi'
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


placeUtil.isHuyen = function(place) {
    let placeTypes=place.types;

    if (_.indexOf(placeTypes, placeUtil.type.HUYEN) > -1) {
        return true;
    }

    if (_.indexOf(placeTypes, 'locality') > -1
        && _.indexOf(placeTypes, 'political') > -1
        && ( place.description.indexOf("tp.") > -1 || place.description.indexOf("tx.") > -1)
    ) {
        return true;
    }
};

placeUtil.getTypeName = function(place) {
    let placeTypes = place.types;

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

    if (_.indexOf(placeTypes, placeUtil.type.DUONG) > -1) {
        return placeUtil.typeName.DUONG;
    }

    return placeUtil.typeName.DIA_DIEM;
};


placeUtil.isOnePoint = function(place) {
    let name = placeUtil.relandTypeName || placeUtil.getTypeName(place);
    return  name === placeUtil.typeName.DIA_DIEM || name === placeUtil.typeName.DUONG;
};

module.exports  = placeUtil;

if (typeof window !== 'undefined')
   window.RewayPlaceUtil = placeUtil;
