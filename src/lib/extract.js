'use strict'

var internals = {};

var BDSExtractor = require ('./BDSExtractor');

var bds = new BDSExtractor();

internals.extractBDS = function(handleData, handleDone) {
	bds.extract(handleData, handleDone);
}

module.exports = internals;