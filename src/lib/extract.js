'use strict'

var internals = {};

var BDSExtractor = require ('./BDSExtractor');

var bds = new BDSExtractor();

internals.extractBDS = function(cridential,handleData, handleDone) {
	bds.extract(cridential, handleData, handleDone);
}

module.exports = internals;