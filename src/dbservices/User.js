'use strict';

var _ = require("lodash");

var couchbase = require('couchbase');
var N1qlQuery = require('couchbase').N1qlQuery;
var ViewQuery = couchbase.ViewQuery;
var cluster = new couchbase.Cluster('couchbase://localhost:8091');
var bucket = cluster.openBucket('default');
bucket.enableN1ql(['127.0.0.1:8093']);
bucket.operationTimeout = 120 * 1000;

let constant = require('../lib/constant');
let log = require('../lib/logUtil');

var request = require("request");

var syncUserDB_URL = "http://localhost:4985/default/";


class UserModel {
  getUser(userDto, callback) {
    var sql = `select default.* from default where type='User'`;

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

  createLoginOnSyncGateway(name, password, callback) {
    var url = syncUserDB_URL + "_user/";
    request({
        url: url, method: "POST",
        json: {name: name, password: password}
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

  createUser(userDto, callback) {
    var url = syncUserDB_URL ;
    request({
        url: url, method: "POST",
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
  }

  updateUser(userDto, callback) {
    var url = syncUserDB_URL ;
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
   *
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

          this.createLoginOnSyncGateway(loginName, userDto.matKhau, (err, res) => {
            //log.info("Callback createLoginOnSyncGateway:", err, res);

            if (err) {
              callback(err, null);
              return;
            }

            if (res && res.reason === "Already exists") {
              callback({code:11, msg: constant.MSG.USER_EXISTS}, userDto);
              return;
            }

            bucket.counter("idGeneratorForUsers", 1, {initial: 0}, (err, res)=> {
              if (err) {
                callback(err, res);
              } else {
                console.log(res);

                const userID = "User_" + res.value;

                userDto.type = "User";
                userDto.id = userID;
                userDto._id = userID;

                this.createUser(userDto, (err, res) => {
                  if (err) {
                    log.warn("Error in createUserAndLogin", err);
                    callback({code:99, msg:err.toString()})
                  } else {
                    log.info("user created:", res);

                    callback(null, userDto);
                  }
                });
              }
            });
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

  createUserForWeb(data, callback){
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

}

module.exports = UserModel;