'use strict';

var bucket = require("../database/mydb");
var N1qlQuery = require('couchbase').N1qlQuery;

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

        var chatID = "Chat_web_" + res.value;

        chat.type = "Chat";
        chat.chatID = chatID;
        chat.id = chatID;
        var date = new Date();
        // chat.date = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
        chat.date = date;
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
  getUnreadMessages(user,callback){
	var sql = `select * from default where type='Chat' and read = false`;
	sql = `${sql} AND toUserID='${user.userID}'`
    var query = N1qlQuery.fromString(sql);

    bucket.query(query, function (err, all) {
      if (err) {
          console.log('query failed'.red, err);
          return;
      }
      console.log("number of ads:" + all.length);
      if (!all)
        all = [];
      callback(err,all);
    });  	
  }

  confirmRead(chat,callback){
  	chat.read = true;
  	console.log(chat);
  	bucket.upsert(chat.chatID, chat, callback);
  }

	
}

module.exports = ChatModel;