'use strict'

var logUtil = require("../../lib/logUtil");
var util = require("../../lib/utils");
var constant = require("../../lib/constant");
var ChatModel = require('../../dbservices/Chat');
var chatModel = new ChatModel();

var User = require("../../dbservices/User");
var userService = new User();

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
 chatID: string
 }
 */
internals.markReadMessage = function(req, reply){
    console.log("-----------------set message was read----------------------");
    logUtil.info("set message was read", req.payload);

    chatModel.markReadMessage( req.payload, function(err, res){
        if (err != null){
            logUtil.error("Error when set message was read, chatID: " + JSON.stringify(req.payload));
            reply({
                status: constant.STS.FAILURE,
                error: err
            });
        } else {
            logUtil.info("set message was read, chatID: ", JSON.stringify(req.payload));
            reply({
                status: constant.STS.SUCCESS,
            });
        }
    });
}
/*
 params:
 {
 userID: string
 }
 */
internals.getUnreadMessages = function(req, reply){
    logUtil.info("Get all uread chat content", req.payload);

    chatModel.getUnreadMessages( req.payload, function(err, res){
        if (err != null){
            logUtil.error("Error when get unread Chat content, userID: " + JSON.stringify(req.payload));
            reply({
                status: constant.STS.FAILURE,
                error: err
            });
        } else {
            logUtil.info("Get uread Chat content successfully, userID: ", JSON.stringify(req.payload));
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
            
            let result = [];

            var async = require("async");

            async.forEach(res, function(e, callback){
                e.relatedToAds.giaFmt =  util.getPriceDisplay(e.relatedToAds.gia, e.relatedToAds.loaiTin);
                e.relatedToAds.dienTichFmt = util.getDienTichDisplay(e.relatedToAds.dienTich);
                e.relatedToAds.diaChinhFullName = e.relatedToAds.place.diaChi;
                e.relatedToAds.cover = e.relatedToAds.image ? e.relatedToAds.image.cover : undefined;
                let payload = {userID: req.payload.userID, partnerUserID: e.partner.userID, adsID: e.relatedToAds.adsID}

                chatModel.getAllChatMsg(payload, function(err, msgRes){
                    if (err != null){
                        logUtil.error("Error when get unread Chat content, userID: " + JSON.stringify(req.payload));
                    } else {
                        let numOfUnreadMessage = 0;
                        msgRes.map( (msg) => {
                            if (msg.default.toUserID == req.payload.userID && !msg.default.read){
                                    numOfUnreadMessage = numOfUnreadMessage + 1;
                                }
                        });
                        e.content = msgRes[0].default.content;
                        e.date = new Date(msgRes[0].default.date);
                        e.numOfUnreadMessage = numOfUnreadMessage;
                        callback();
                    }
                });
                result.push(e);

            }, function(err){
                reply({
                    status: constant.STS.SUCCESS,
                    data: result
                });
            });
        }
    });
}


module.exports = internals;

