'use strict';

var _ = require("lodash");

var internals = {};


internals.getDuAnFullName = function(place) {
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

internals.getDiaChinh = function(diaChi) {
    let spl = diaChi.split(",");
    let diaChinh = {};

    let i = spl.length;
    diaChinh.tinh = spl[--i].trim();
    diaChinh.huyen = spl[--i].trim();
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

internals.fullName = function(place) {
    //todo: other types
    if (place.placeType === "Quan" || place.placeType  === "Huyen") {
        return place.placeName + ", " + place.parentName;
    }

    return place.placeName;
};




internals.type = {
    TINH : "administrative_area_level_1",
    HUYEN : "administrative_area_level_2",
    XA : "administrative_area_level_3",
    XA2 : "sublocality_level_1"
};

internals.typeName = {
    TINH : "Tinh",
    HUYEN : "Huyen",
    XA : "Xa",
    DUONG : "Duong",
    DIA_DIEM: "Dia diem"

};

internals.isHuyen = function(place) {
    let placeTypes=place.types;

    if (_.indexOf(placeTypes, internals.type.HUYEN) > -1) {
        return true;
    }

    if (_.indexOf(placeTypes, 'locality') > -1
        && _.indexOf(placeTypes, 'political') > -1
        && place.description&&place.description.indexOf("tp.") > -1
    ) {
        return true;
    }
};

internals.getTypeName = function(place) {
    let placeTypes = place.types;

    if (_.indexOf(placeTypes, internals.type.TINH) > -1) {
        return internals.typeName.TINH;
    }
    if (internals.isHuyen(place)) {
        return internals.typeName.HUYEN;
    }

    if (_.indexOf(placeTypes, internals.type.XA) > -1) {
        return internals.typeName.XA;
    }

    if (_.indexOf(placeTypes, internals.type.XA2) > -1) {
        return internals.typeName.XA;
    }

    return internals.typeName.DIA_DIEM;
};


internals.isOnePoint = function(place) {
    let name = internals.relandTypeName || internals.getTypeName(place);
    return  name === internals.typeName.DIA_DIEM || name === internals.typeName.DUONG;
};


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
    module.exports  = internals;
    //if(window)
    //    window.RewayPlaceUtil = internals;
} 

if (typeof window !== 'undefined')
   window.RewayPlaceUtil = internals;




