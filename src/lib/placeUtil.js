'use strict';

var _ = require("lodash");

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

placeUtil.getDiaChinh = function(diaChi) {
    let spl = diaChi.split(",");
    let diaChinh = {};

    let i = spl.length;
    diaChinh.tinh = spl[--i].trim();
    let rawHuyen = spl[--i];
    if (rawHuyen) {
        diaChinh.huyen = huyen.trim();
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




placeUtil.type = {
    TINH : "administrative_area_level_1",
    HUYEN : "administrative_area_level_2",
    XA : "administrative_area_level_3",
    XA2 : "sublocality_level_1",
    DUONG : "route"
};

placeUtil.typeName = {
    TINH : "Tinh",
    HUYEN : "Huyen",
    XA : "Xa",
    DUONG : "Duong",
    DIA_DIEM: "Dia diem"

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




