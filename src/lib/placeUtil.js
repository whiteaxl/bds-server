'use strict'

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

module.exports  = internals;



