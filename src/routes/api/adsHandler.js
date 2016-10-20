'use strict'

var Boom = require('boom');
var logUtil = require("../../lib/logUtil");
var util = require("../../lib/utils");

var AdsModel = require('../../dbservices/Ads');
var adsModel = new AdsModel();

var services = require("../../lib/services");
var constant = require("../../lib/constant");
var moment = require("moment");
var geoUtil = require("../../lib/geoUtil");

var internals = {};

internals.upload = function(req, reply){
    logUtil.info("Upload Ads", req.payload);
    
    //TODO: check user exist or not ?

    adsModel.uploadAds( req.payload, function(err, res){
        if (err != null){
            logUtil.error("Error when upload Ads, userId: " + res.userId, err);
            reply(Boom.badImplementation("Error when upload Ads, userId: " + res.userId));
        } else {
            logUtil.info("Upload Ads sucessfully, id: ", res.id);
            let result = {
                status: constant.STS.SUCCESS,
                adsId: res.id
            }
            reply(result);
        }
    });
}

module.exports = internals;

