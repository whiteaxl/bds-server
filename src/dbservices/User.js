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
/*
 userID: string
 fullName: string
 email: string - unique
 phone: string -- Unique
 adsLikes: [adsID]
 matKhau: string
 chatBlockedList: [userID]
 diemDanhGia: number
 saveSearch : [{
   name: string,
   timeModified: number (from 1970),
   query: {gia, soPhongNguGREATER, ...}}]
 avatar: string (image url) -- image de trong Upload cua Web
 timeCreated: number (ms from 1970)
 timeModified : number (ms)
 serviceOrders: [{serviceID, adsID, beginDate, endDate}]
 account: {
  main: number - Tai khoan chinh
  bonus: number - Tai khoan khuyen mai
 }
 lastViewAdsID : string
 */

class UserModel {
  initBucket() {
    cluster = new couchbase.Cluster('couchbase://localhost:8091');
    bucket = cluster.openBucket('default');
    bucket.enableN1ql(['127.0.0.1:8093']);
    bucket.operationTimeout = 60 * 1000;
  }
  //getUserByMsisdn: start with 84
  getUserByMsisdn(msisdn, callback) {
    var sql = `select default.* from default where type='User'`;
    var f1 = msisdn;
    var f2 = msisdn.substring(2);
    var f3 = "0" + f2;

    sql = `${sql} AND (phone='${f1}' OR phone='${f2}' OR phone='${f3}') `;

    log.info("getUserByMsisdn, sql:", sql);

    var query = N1qlQuery.fromString(sql);

    //Todo: why need this?
    this.initBucket();

    bucket.query(query, callback);
  }

  // by phone or email
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

    //Todo: why need this?
    this.initBucket();

    bucket.query(query, callback);
  }

  getUserByID(userID,callback){
    var sql = `select default.* from default where type='User' and id='${userID}'`;

    var query = N1qlQuery.fromString(sql);
    this.initBucket();
    console.log("getUserByID: " + sql);
    bucket.query(query, callback);
  }

  getAdsLikes(userID,callback){
    var sql = `select t.adsLikes from default t where type='User' and id='${userID}'`;

    var query = N1qlQuery.fromString(sql);
    this.initBucket();
    console.log("getAdsLikes, sql=", sql);
    bucket.query(query, (err, res) => {
      if (err) {
        callback(err, res);
      } else {
        console.log("getAdsLikes, res:", res);
        if (res.length == 0) {
          callback(err, res);
          return;
        }
        let adsLikes = res[0].adsLikes;
        let sql2 = `select a.* from default a where a.type='Ads' and a.adsID in ${JSON.stringify(adsLikes)}`;
        console.log("getAdsLikes, sql 2:", sql2);

        var query2 = N1qlQuery.fromString(sql2);
        bucket.query(query2, callback);
      }
    });
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
      console.log("Get user from syncGateway:", resJson);

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
          bucket.counter(constant.DB_SEQ.User, 1, {initial: 0}, (err, res)=> {
            if (err) {
              callback(err, res);
            } else {
              var userID = "User_" + res.value;
              //console.log("AAAAAAA", res);
              userDto.type = "User";
              userDto.userID = userID;
              userDto._id = userID;
              userDto.id = userID;

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

  upsert(userDto,callback) {
    this.initBucket();
    bucket.upsert(userDto.userID, userDto, function (err, res) {
        if (err) {
            console.log("ERROR:" + err);
        }
        if(callback)
          callback(err,res);
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

  saveSearch(data,userID,onSuccess){

    this.getUserByID(userID, (err,res) => {
      if (err) {
        console.log("ERROR:" + err);
      }else{
        if(res && res.length==1){
          //get user from database
          var user = res[0];
          console.log(user);

          if(this._checkSaveSearchExist(data,user)==true){
            onSuccess({success: true,status:1,msg: constant.MSG.EXIST_SAVE_SEARCH});
          }else{
            console.log("going to push query " + JSON.stringify(data));            
            user.saveSearch.push(data);
            bucket.upsert(user.id, user, function (err, res) {
              if (err) {
                  console.log("ERROR:" + err);
              }
              onSuccess({success:true,status:0,msg: constant.MSG.SUCCESS_SAVE_SEARCH});
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
      console.log("Done getUserByID");
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
              console.log("likeAds, reply SUCCESS_LIKE_ADS");
              reply({success:true,status:0,msg: constant.MSG.SUCCESS_LIKE_ADS});
            })
          }else{
            console.log("likeAds, reply EXIST_LIKE_ADS");
            reply({success:false,status:1, msg: constant.MSG.EXIST_LIKE_ADS});
          }
        } else {
          reply({success:false,status:2, msg: constant.MSG.USER_NOT_EXIST});
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

    this.initBucket();

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
            data.userID = data.id;
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

    this.initBucket();

    bucket.query(query, callback);
  }

  updateDevice(dto, callback) {
    this.initBucket();
    console.log('updateDevice dto:', dto);
    bucket.upsert(dto.deviceID, dto, callback)
  }

  getTokenOfUser(userID,callback){
    var sql = `select default.* from default where type='Device' and userID='${userID}'`;
    var query = N1qlQuery.fromString(sql);
    this.initBucket();
    bucket.query(query, callback);
  }

  getDocById(id, callback) {
    this.initBucket();
    bucket.get(id, callback);
  }

  /*
    dto: {mainAmount, bonusAmount}
   */
  updateAccount(dto, callback) {
    var url = syncGatewayDB_URL ;
    request({
      url: url+dto.userID,
      method: "GET",
    }, function(error, response, body) {

      if (error) {
        callback(error, null);
        return;
      }
      const resJson = JSON.parse(body);
      console.log("Get user from syncGateway:", resJson);

      var user = {}; Object.assign(user, resJson);
      //user._rev = null;
      user._id = dto.userID;

      if (!user.account) {
        user.account = {
          main:0,
          bonus : 0
        }
      }

      user.account.main += dto.mainAmount;
      user.account.bonus += dto.bonusAmount;

      const updateUrl = `${url}${user.id}?rev=${resJson._rev}`;
      console.log("Will update user:", {updateUrl, user});

      request({
          url: updateUrl, method: "PUT",
          json: user
        },
        function (error, response, body) {
          if (error) {
            log.error("Error when createUser", error, response);
            callback(error, body);
            return;
          }

          if (response.statusCode === 200 || response.statusCode === 201) {
            callback(null, {user: user, body: body});
          } else {
            log.error("UpdateUser - Have response but status fail:", response.body);
            callback({code:99, msg: response.body}, null);
          }
        });

    });
  }

}

module.exports = UserModel;