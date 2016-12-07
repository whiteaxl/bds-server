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
      /*
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
    });*/
      var date = new Date();
      chat.type = "Chat";
      chat.id = chat.chatID;
      chat.date = date;
      chat.timestamp = date.getTime();
      console.log("before upsert " + chat.id);

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

  markReadMessage(chat,callback){
    var sql = `update default set read=true where type='Chat' and chatID='${chat.chatID}'`;
    var query = N1qlQuery.fromString(sql);

    bucket.query(query, function (err, res) {
        if (err) {
            console.log('query failed'.red, err);
            return;
        }
        console.log("----------------------------------markReadMessage------------------");
        console.log(sql);
        console.log("----------------------------------markReadMessage------------------");
        callback(err,res);
    });
  }
/*
    getChatID(chatID,callback){
        var sql = `select default.* from default where type='Chat' and id='${chatID}'`;

        var query = N1qlQuery.fromString(sql);

        log.info("getUserByID: " + sql);
        bucket.query(query, callback);
    }
    markReadMessage(chat,callback){
        this.getChatID(chat.chatID, (err,res) => {
            if (err) {
                console.log("ERROR:" + err);
            }else{
                if(res && res.length==1){
                    //get user from database
                    var chat = res[0];
                    chat.read = true;
                    console.log("-------------------------markReadMessage-read----------");
                    console.log(chat);

                    bucket.upsert(chat.id, chat, function (err, res) {
                        if (err) {
                            console.log("ERROR:" + err);
                        }
                        console.log("-------------------------markReadMessage-upset----------");
                        console.log(chat);
                        console.log("-------------------------markReadMessage-upset----------");


                        callback(err, res);
                    })
                }
            }
        });
    }*/

  getAllChatMsg(payload,callback) {
     var userID = payload.userID;
     var partnerUserID = payload.partnerUserID;
     var adsID = payload.adsID;
     var limit = 100;

     var sql = `select * from default where type='Chat' `;
     sql = `${sql} and ((fromUserID='${partnerUserID}' and toUserID='${userID}') or (fromUserID='${userID}' and toUserID='${partnerUserID}'))`
     sql = `${sql} and relatedToAds.adsID='${adsID}'`;
     sql = `${sql} order by date desc limit ${limit}`;

    console.log("sql: " + sql);

     var query = N1qlQuery.fromString(sql);

     bucket.query(query, function (err, all) {
         if (err) {
             console.log('query failed'.red, err);
             return;
         }
         console.log("number of msg:" + all.length);
         if (!all)
             all = [];
         callback(err, all);
     });
  }

  getInboxMsg(payload,callback){
      var userID = payload.userID;

      /*var sql = `select distinct {"userID": toUserID} as partner, {"adsID" : relatedToAds.adsID} as relatedToAds from default where type='Chat'`;
      sql = `${sql} and fromUserID='${userID}'`;
      sql = `${sql} union`;
      sql = `${sql} select distinct {"userID": fromUserID} as partner, {"adsID" : relatedToAds.adsID} as relatedToAds from default where type='Chat'`;
      sql = `${sql} and toUserID='${userID}'`;
*/
      var sql = `select {"userID": b.id, "fullName": b.fullName, "phone": b.phone, "email": b.email, "avatar": b.avatar} as partner,`;
      sql = `${sql} {"adsID": c.id, "loaiTin": c.loaiTin, "loaiNhaDat": c.loaiNhaDat, "gia": c.gia, "place": c.place,"image": c.image,  "dienTich": c.dienTich} as relatedToAds`;
      sql = `${sql} from (`;
      sql = `${sql} select toUserID as userID, relatedToAds.adsID as adsID`;
      sql = `${sql} from default`;
      sql = `${sql} where type='Chat' and fromUserID='${userID}'`;
      sql = `${sql} union`;
      sql = `${sql} select fromUserID as userID, relatedToAds.adsID as adsID`;
      sql = `${sql} from default`;
      sql = `${sql} where type='Chat' and toUserID='${userID}')  a`;
      sql = `${sql} inner join default b`;
      sql = `${sql} on keys a.userID`;
      sql = `${sql} inner join default c `;
      sql = `${sql} on keys a.adsID`;


      console.log("sql: " + sql);

      var query = N1qlQuery.fromString(sql);

      bucket.query(query, function (err, all) {
          if (err) {
              console.log("ERROR:" + err);
              callback(err, null);
          } else {
              console.log("Get Inbox Msg:");
              console.log(all);
              callback(null, all);
          }
      });
  }

  confirmRead(chat,callback){
  	chat.read = true;
    bucket.upsert(chat.chatID, chat, callback);
  }

	
}

module.exports = ChatModel;