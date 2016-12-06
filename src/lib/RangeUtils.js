'use strict';

var danhMuc = require("../lib/DanhMuc");


var BIG = danhMuc.BIG;

var rangeUtils = {};

class IncRange {
	constructor(stepsVal, getDisplay, getUnitText, getUnitValue) {
		this.stepsVal = stepsVal;
		this.getDisplay = getDisplay;
		this.getUnitText = getUnitText;
		this.getUnitValue = getUnitValue;
		//calc display
		this.stepsDisplay = stepsVal.map(getDisplay);
		this._map = {};
		for (var i = 0; i < stepsVal.length; i ++) {
			this._map[this.stepsDisplay[i]] = stepsVal[i];
		}

		//default
		this.firstStep =  danhMuc.BAT_KY;
		this.lastStep = danhMuc.BAT_KY;
	}

	getPickerData() {
		var arr = this.stepsDisplay;

		var ret = {};
		for (var i = 0; i < arr.length ; i++) {
			ret[arr[i]] = [danhMuc.BAT_KY].concat(arr.slice(i+1));
		}

		return ret;
	}

	getVal(display) {

		return this._map[display];
	}

	getAllRangeVal() {
		var ret = [];
		var len = this.stepsVal.length;
		for (var i=0; i<len; i++) {
			var val = this.stepsVal[i];
			if (val == -1 || val == 0) {
				ret.push([val, val]);
			} else {
				ret.push([this.stepsVal[i-1], val]);
			}
		}
		ret.push([this.stepsVal[len-1], BIG]);
		return ret;
	}

	toValRange(displayArr) {
		let fromVal = displayArr[0] == -1 ? -1 : (displayArr[0] == 0 ? 0 :
			(this._map[displayArr[0]] != undefined ? this._map[displayArr[0]] : displayArr[0]));
		let toVal = displayArr[1] == -1 ? -1 : (displayArr[1] == 0 ? 0 :
			(this._map[displayArr[1]] != undefined ? this._map[displayArr[1]] : displayArr[1]));
		fromVal = String(fromVal);
		if (fromVal && fromVal.indexOf(" ") != -1) {
			let unitVal = this.getUnitValue ? this.getUnitValue(fromVal.substring(fromVal.indexOf(" ")+1)) : 1;
			fromVal = Number(fromVal.substring(0, fromVal.indexOf(" ")))*unitVal;
		} else {
			fromVal = Number(fromVal);
		}
		toVal = String(toVal);
		if (toVal && toVal.indexOf(" ") != -1) {
			let unitVal = this.getUnitValue ? this.getUnitValue(toVal.substring(toVal.indexOf(" ")+1)) : 1;
			toVal = Number(toVal.substring(0, toVal.indexOf(" ")))*unitVal;
		} else {
			toVal = Number(toVal);
		}
		toVal = toVal == -1 ? BIG : toVal;

		return [fromVal, toVal];
	}

	rangeVal2Display(rangeVal) {
		// console.log("rangeVal=", rangeVal);
		let fromDisplay = this.getDisplay(rangeVal[0]);
		let toDisplay = this.getDisplay(rangeVal[1]);

		return [fromDisplay, toDisplay];
	}
}

rangeUtils.sellPriceRange = new IncRange(danhMuc.sellStepValues, getPriceStepsDisplay, getGiaUnitText, getGiaUnitValue);
rangeUtils.rentPriceRange = new IncRange(danhMuc.rentStepValues, getPriceStepsDisplay, getGiaUnitText, getGiaUnitValue);
rangeUtils.dienTichRange = new IncRange(danhMuc.dienTichStepValues, getDienTichStepsDisplay, getDienTichUnitText);
rangeUtils.BAT_KY_RANGE =[danhMuc.BAT_KY, danhMuc.BAT_KY];
rangeUtils.BAT_KY = danhMuc.BAT_KY;

function getPriceStepsDisplay(val) {
	if (val == -1 || val == BIG) {
		return danhMuc.BAT_KY;
	}
	if (val == 0) {
		return danhMuc.THOA_THUAN;
	}

	if (val < 1000) {
		return val + " triệu";
	}

	return val/1000 + " tỷ";	
}

function getDienTichStepsDisplay(val) {
	if (val == -1 || val == BIG) {
		return danhMuc.BAT_KY;
	}
	if (val == 0) {
		return danhMuc.CHUA_XAC_DINH;
	}

	return val + " m²";
}

function getDienTichUnitText() {
	return "m²";
}

function getGiaUnitText() {
	return "triệu";
}

function getGiaUnitValue(unit) {
	return unit == "tỷ" ? 1000 : 1;
}

rangeUtils.getFromToDisplay = function(values, unitText) {
		let fromVal = values[0];
	    let toVal  = values[1];
		let unitTextStr = unitText ? unitText : 'm²';
		if ((fromVal == danhMuc.BAT_KY || fromVal == danhMuc.CHUA_XAC_DINH || fromVal == danhMuc.THOA_THUAN) && toVal == danhMuc.BAT_KY) {
			return danhMuc.BAT_KY;
		}
	    if (fromVal == danhMuc.BAT_KY && (toVal == danhMuc.BAT_KY || toVal == danhMuc.CHUA_XAC_DINH || toVal == danhMuc.THOA_THUAN)) {
	        return danhMuc.BAT_KY;
	    }
		if ((fromVal == danhMuc.BAT_KY || fromVal == danhMuc.CHUA_XAC_DINH) && toVal == danhMuc.CHUA_XAC_DINH ) {
			return danhMuc.CHUA_XAC_DINH;
		}
		if ((fromVal == danhMuc.BAT_KY || fromVal == danhMuc.THOA_THUAN) && toVal == danhMuc.THOA_THUAN ) {
			return danhMuc.THOA_THUAN;
		}
		if (fromVal == danhMuc.THOA_THUAN && toVal == danhMuc.THOA_THUAN ) {
			return danhMuc.THOA_THUAN;
		}
		if (fromVal == danhMuc.BAT_KY || fromVal == danhMuc.CHUA_XAC_DINH || fromVal == danhMuc.THOA_THUAN) {
			fromVal = '0 ' + unitTextStr;
		}
		if (toVal == danhMuc.CHUA_XAC_DINH) {
			toVal = '0 ' + unitTextStr;
		}

	    return fromVal + " - " + toVal;
};

if (typeof(window) !== 'undefined')
	window.RangeUtils = rangeUtils;

module.exports  = rangeUtils;