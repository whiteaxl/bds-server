'use strict';

var couchbase = require('couchbase');
var ViewQuery = couchbase.ViewQuery;
var N1qlQuery = require('couchbase').N1qlQuery;
var ViewQuery = couchbase.ViewQuery;
var cluster = new couchbase.Cluster('couchbase://localhost:8091');
var bucket = cluster.openBucket('default');
bucket.enableN1ql(['127.0.0.1:8093']);
bucket.operationTimeout = 120 * 1000;

var constant = require('../lib/constant');
var log = require('../lib/logUtil');

var request = require("request");

class ChatModel {
	constructor(myBucket) {
		this.myBucket = myBucket;
	}

	upsert(chatDto) {
		this.myBucket.upsert(chatDto.chatID, chatDto, function(err, res) {
			if (err) {
				console.log("ERROR:" + err);
			}
		})
	}
  /**
  save chat into db
  chat{
    chatID,
    fromUserID,
    toUserID,
    toFullName,
    fromFullName,
    relatedToAdsID,
    content,
    type: Chat,
    msgType: image/file/text,
    timeStamp,
    read: true/false,
    attachFile: {
      name,
      url,
      size
    }
  }
  */
  saveChat(chat,callback){
    bucket.counter("idGeneratorForChats", 1, {initial: 0}, (err, res)=> {
      if (err) {
        callback(err, res);
      } else {
        console.log(res);

        var chatID = "" + res.value;

        chat.type = "Chat";
        chat.id = chatID;
        console.log("before upsert " + chat.id);
        //TODO set timestamp for chat

        bucket.upsert(chat.id, chat, function (err, res) {
          if (err) {
            console.log("ERROR:" + err);
            callback({code:99, msg:err.toString()})
          }else{
            log.info("chat save:", res);
            callback(null, chat);
          }
        });
      }
    });
  }

	
}

module.exports = ChatModel;