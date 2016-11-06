'use strict'

var logUtil = require("../../lib/logUtil");
var constant = require("../../lib/constant");
var ChatModel = require('../../dbservices/Chat');
var chatModel = new ChatModel();

var internals = {};

/*
params:
{
    userID: string,
    partnerUserID: string,
    adsID: string
}
 */
internals.getAllChatMsg = function(req, reply){
    logUtil.info("Get all chat content", req.payload);

    chatModel.getAllChatMsg( req.payload, function(err, res){
        if (err != null){
            logUtil.error("Error when get Chat content, adsId: " + JSON.stringify(req.payload));
            reply({
                status: constant.STS.FAILURE,
                error: err
            });
        } else {
            logUtil.info("Get Chat content successfully, id: ", JSON.stringify(req.payload));
            reply({
                status: constant.STS.SUCCESS,
                data: res
            });
        }
    });
}

/*
 params:
 {
    userID: string,
    loaiTin: number
 }
 */
internals.getInboxMsg = function(req, reply){
    logUtil.info("Get all chat content", req.payload);

    chatModel.getInboxMsg( req.payload, function(err, res){
        if (err != null){
            logUtil.error("Error when get Chat content, adsId: " + JSON.stringify(req.payload));
            reply({
                status: constant.STS.FAILURE,
                error: err
            });
        } else {
            logUtil.info("Get Chat content successfull, id: ", JSON.stringify(req.payload));
            reply({
                status: constant.STS.SUCCESS,
                data: res
            });
        }
    });
}


module.exports = internals;

