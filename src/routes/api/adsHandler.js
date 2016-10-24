'use strict'

var logUtil = require("../../lib/logUtil");
var constant = require("../../lib/constant");
var AdsModel = require('../../dbservices/Ads');
var adsModel = new AdsModel();

var internals = {};

internals.postAds = function(req, reply){
    logUtil.info("Upload Ads", req.payload);
    
    //TODO: check user exist or not ?

    adsModel.uploadAds( req.payload, function(err, res){
        if (err != null){
            logUtil.error("Error when upload Ads, userId: " + res.userId, err);
            reply({
                status: constant.STS.FAILURE,
                error: err
            });
        } else {
            logUtil.info("Upload Ads sucessfully, id: ", res.id);
            reply({
                status: constant.STS.SUCCESS,
                adsId: res.id
            });
        }
    });
}

module.exports = internals;

