'use strict';

var _ = require("lodash");

var couchbase = require('couchbase');
var N1qlQuery = require('couchbase').N1qlQuery;
var ViewQuery = couchbase.ViewQuery;
var cluster = new couchbase.Cluster('couchbase://localhost:8091');
var bucket = cluster.openBucket('default');
bucket.enableN1ql(['127.0.0.1:8093']);
bucket.operationTimeout = 120 * 1000;

var constant = require('../lib/constant');
var log = require('../lib/logUtil');

var request = require("request");

var syncGatewayDB_URL = "http://localhost:4985/default/";


var SyncGw = require('./SyncGW');
var syncGw = new SyncGw();


class UserModel {
  initBucket() {
    bucket = cluster.openBucket('default');
    bucket.enableN1ql(['127.0.0.1:8093']);
    bucket.operationTimeout = 60 * 1000;
  }

  getUser(userDto, callback) {
    var sql = `select default.* from default where type='User'`;

    if(userDto.userID){
      this.getUserByID(userDto.userID,callback);
      return ;
    }

    if (userDto.phone) {
      sql = `${sql} AND phone='${userDto.phone}'`
    }
    if (userDto.email) {
      sql = `${sql} AND email='${userDto.email}'`
    }
    console.log(sql);
    var query = N1qlQuery.fromString(sql);

    //why need this?
    this.initBucket();

    bucket.query(query, callback);
  }

  getUserByID(userID,callback){
    var sql = `select default.* from default where type='User' and id='${userID}'`;

    var query = N1qlQuery.fromString(sql);
    this.initBucket();
    bucket.query(query, callback);
  }

  //userDto
  createLoginOnSyncGateway(userDto, callback) {
    var url = syncGatewayDB_URL + "_user/";
    request({
        url: url, method: "POST",
        json: {
          name: userDto.phone || userDto.email ,
          password: userDto.matKhau,
          admin_channels : ["chan_"+userDto.userID]
        }
      },
      function (error, response, body) {
        if (error) {
          log.error("Error when createLoginOnSyncGateway", error, response);
          callback(error, body);
          return;
        }

        if (response.statusCode === 200 || response.statusCode === 201) {
          callback(null, body);
        } else {
          log.error("createLoginOnSyncGateway", response.body);
          callback({code:99, msg: response.body.reason}, null);
        }
      });
  }

  updateUser(userDto, callback) {
    var url = syncGatewayDB_URL ;
    request({
      url: url+userDto.id,
      method: "GET",
    }, function(error, response, body) {

      if (error) {
        callback(error, null);
        return;
      }
      const resJson = JSON.parse(body);
      console.log(resJson);

      const updateUrl = `${url}${userDto.id}?rev=${resJson._rev}`;
      console.log("updateUrl:", updateUrl);


      request({
          url: updateUrl, method: "PUT",
          json: userDto
        },
        function (error, response, body) {
          if (error) {
            log.error("Error when createUser", error, response);
            callback(error, body);
            return;
          }

          if (response.statusCode === 200 || response.statusCode === 201) {
            callback(null, body);
          } else {
            log.error("CreateUser - Have response but status fail:", response);
            callback({code:99, msg: response.body}, null);
          }
        });

    });
  }

  /**
   * if exist return error, else create with ability to login to syncGateway
   * @param userDto
   *    phone/email: can only have one of these
   *    fullName: string
   *    matKhau: string
   * @param callback (err, res)
   */
  createUserAndLogin(userDto, callback) {
    this.getUser(userDto, (err, res) => {
      if (err) {
        callback(err, res)
      } else {
        //console.log(res);
        if (res.length > 0) { //exists
          log.warn("User already existed!");
          log.info(res);
          callback({code:1, msg: constant.MSG.USER_EXISTS}, userDto)
        } else {
          //create on sync gateway, only can have phone or email
          let loginName=userDto.phone||userDto.email;
          bucket.counter("idGeneratorForUsers", 1, {initial: 0}, (err, res)=> {
            if (err) {
              callback(err, res);
            } else {
              var userID = "User_" + res.value;
              //console.log("AAAAAAA", res);
              userDto.type = "User";
              userDto.userID = userID;
              userDto._id = userID;

              this.createLoginOnSyncGateway(userDto, (err, res) => {
                //log.info("Callback createLoginOnSyncGateway:", err, res);
                if (err) {
                  callback(err, null);
                  return;
                }

                if (res && res.reason === "Already exists") {
                  callback({code: 11, msg: constant.MSG.USER_EXISTS}, userDto);
                  return;
                }

                syncGw.createDocViaSyncGateway(userDto, (err, res) => {
                  if (err) {
                    log.warn("Error in createUserAndLogin", err);
                    callback({code: 99, msg: err.toString()})
                  } else {
                    log.info("user created:", res);

                    callback(null, userDto);
                  }
                });

              });
            }
          });
        }
      }
    });

  }

  queryAll(callBack) {
    let query = ViewQuery.from('user', 'all_user');

    this.myBucket.query(query, function (err, all) {
      console.log(all);

      if (!all)
        all = [];

      callBack(all);
    });
  }

  upsert(userDto) {
    bucket.upsert(userDto.userID, userDto, function (err, res) {
        if (err) {
            console.log("ERROR:" + err);
        }
    })
  }

  /**
  Ham nay se luu save search vao cuoi cung neu nhu chua co
  Neu co save search roi tra ve 
  {
      success: false
      msg: 
  }
  */

  saveSearch(query,userID,onSuccess){

    this.getUserByID(userID, (err,res) => {
      if (err) {
        console.log("ERROR:" + err);
      }else{
        if(res && res.length==1){
          //get user from database
          var user = res[0];
          console.log(user);

          if(this._checkSaveSearchExist(query,user)==true){
            onSuccess({success: false,msg: constant.MSG.EXIST_SAVE_SEARCH});
          }else{
            console.log("going to push query " + JSON.stringify(query));
            user.saveSearch.push(query);
            bucket.upsert(user.id, user, function (err, res) {
              if (err) {
                  console.log("ERROR:" + err);
              }
              onSuccess({success:true,msg: constant.MSG.SUCCESS_SAVE_SEARCH});
            })
          } 
        }
      }
    });
  }

  likeAds(payload,reply){
    var adsID = payload.adsID;
    var userID = payload.userID;
    this.getUserByID(userID, (err,res) => {
      if (err) {
        console.log("ERROR:" + err);
      }else{
        if(res && res.length==1){
          //get user from database
          var user = res[0];
          if(!user.adsLikes)
            user.adsLikes = [];
          var alreadyHasAdsID = false;
          for(var i=0;i<user.adsLikes.length;i++){
            if(_.isEqual(user.adsLikes[i],adsID)){
              alreadyHasAdsID = true;
              break;
            }
          }
          if(alreadyHasAdsID==false){
            user.adsLikes.push(adsID);
            bucket.upsert(user.id, user, function (err, res) {
              if (err) {
                  console.log("ERROR:" + err);
              }
              reply({success:true,msg: constant.MSG.SUCCESS_LIKE_ADS});
            })
          }else{
            reply({success:false, msg: constant.MSG.EXIST_LIKE_ADS});
          }
        }
      }
    });       
  }

  resetPassword(payload,reply){
    var pass = payload.pass;
    var userID = payload.userID;
    console.log('find user for ' + userID); 
    this.getUserByID(userID, (err,res) => {
      if (err) {
        console.log("ERROR:" + err);
      }else{
        if(res && res.length==1){
          //get user from database
          var user = res[0];
          user.matKhau = pass;
          bucket.upsert(user.id, user, function (err, res) {
            if (err) {
                console.log("ERROR:" + err);
                reply({success: false, msg: err});
            }else{
              reply({success:true,msg: constant.MSG.SUCCESS_UPDATE_PASSWORD});  
            }            
          })          
        }
      }
    });       
  }

  
  _checkSaveSearchExist(data, user){
    if(!user.saveSearch)
      user.saveSearch = [];
    if(user.saveSearch){
      for(var i=0;i< user.saveSearch.length;i++){
        if(_.isEqual(user.saveSearch[i],data)==true)
          return true;
      }
    }else{
      return false;  
    }
  }

  isUserExist(data, onSuccess) {
    var sql = `select count(*) from default where type='User'`;

    if (data.phone) {
      sql = `${sql} AND phone='${data.phone}'`
    }
    if (data.email) {
      sql = `${sql} AND email='${data.email}'`
    }
    var query = N1qlQuery.fromString(sql);

    bucket.query(query, function (err, res) {
      if (err) {
          console.log('query failed'.red, err);
          return;
      }
      // console.log('success!', res[0].cnt==1);
      console.log("before reply count = " + res[0].$1);
      onSuccess(res[0].$1==1);
    });
  }

  createUserForWeb(reply,data, callback){
    this.isUserExist(data,function(isExist){
      if(isExist==true){
        reply({
          result: undefined,
          err: constant.DB_ERR.USER_EXISTS
        })
      }else{

        bucket.counter("idGeneratorForUsers", 1, {initial: 0}, (err, res)=> {
          if (err) {
            callback(err, res);
          } else {
            console.log(res);

            var userID = "User_" + res.value;

            data.type = "User";
            data.id = userID;
            data._id = userID;
            data.name = data.email;
            console.log("before upsert " + data.id);

            bucket.upsert(data.id, data, function (err, res) {
              if (err) {
                console.log("ERROR:" + err);
                callback({code:99, msg:err.toString()})
              }else{
                log.info("user created:", res);
                callback(null, data);
              }
            });
          }
        });

        
      }
    });
  }

  //userDto.phone or userDto.email
  deleteUser(userDto, callback) {
    let username = userDto.phone || userDto.email;

    this._deleteLoginFromSyncGateway(username, (err, res) => {
      if (!err) {
        this._deleteUserFromDB(userDto, callback);
      } else {
        callback(err, null)
      }
    });
  }

  _deleteLoginFromSyncGateway(name, callback) {
    var url = syncGatewayDB_URL + "_user/" + name;
    request({
        url: url, method: "DELETE"
      },
      function (error, response, body) {
        if (error) {
          log.error("Error when _deleteLoginFromSyncGateway", error, response);
          callback(error, body);
          return;
        }

        if (response.statusCode === 200 || response.statusCode === 201) {
          callback(null, body);
        } else {
          log.error("_deleteLoginFromSyncGateway", response.body);
          callback({code:99, msg: response.body.reason}, null);
        }
      });
  }

  _deleteUserFromDB(userDto, callback) {
    var sql = `delete from default where type='User'`;

    if (userDto.phone) {
      sql = `${sql} AND phone='${userDto.phone}'`
    }
    if (userDto.email) {
      sql = `${sql} AND email='${userDto.email}'`
    }
    console.log(sql);
    var query = N1qlQuery.fromString(sql);

    bucket.query(query, callback);
  }

}

module.exports = UserModel;