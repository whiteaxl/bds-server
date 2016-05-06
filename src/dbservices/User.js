'use strict';

var _ = require("lodash");

var couchbase = require('couchbase');
var N1qlQuery = require('couchbase').N1qlQuery;
var ViewQuery = couchbase.ViewQuery;
var cluster = new couchbase.Cluster('couchbase://localhost:8091');
var bucket = cluster.openBucket('default');
bucket.enableN1ql(['127.0.0.1:8093']);

var request = require("request");

var syncUserDB_URL = "http://localhost:4985/default/";


class UserModel {
    getUserByDeviceID(deviceID, callback) {
        var sql = `select default.* from default where type='User' and deviceID =  '${deviceID}'`;
        var query = N1qlQuery.fromString(sql);

        bucket.query(query, callback);
    }

    createUserOnSyncGateway(userDto, callback) {
            var url = syncUserDB_URL+"_user/";
            request({url: url,method:"POST", json: {name: userDto.userID, password: userDto.matKhau, type:"User"}}, function (error, response, body) {

                if (!error && (response.statusCode === 200|| response.statusCode === 201)) {
                    callback(null, body);
                } else {
                    console.log("Error when createUserOnSyncGateway" + error);
                    callback(error, body);
                }
            });
    }

	upsert(userDto, callback) {
        this.getUserByDeviceID(userDto.deviceID, (err, res) => {
            if (err) {
                callback(err, res)
            } else {
                //console.log(res);
                if (res.length > 0) { //exists
                    console.log("User already existed!");
                    callback(err, {user: res[0]});
                } else {
                    bucket.counter("idGeneratorForUsers", 1, {initial:0}, (err, res)=>{
                        if (err) {
                            callback(err, res);
                        } else {
                            console.log(res);

                            //userDto.userID = "User_" + _.padStart(res.value, 20, '0');
                            userDto.userID = "User_" + res.value;

                            userDto.type = "User";
                            userDto.matKhau = "123";
                            userDto.id = '_sync:user:'+userDto.userID;

                            //create on sync gateway
                            this.createUserOnSyncGateway(userDto, (err, res) => {
                                if (!err || res.reason==="Already exists") {
                                    bucket.get(userDto.id, (err, res) => {
                                        if (err) {
                                            callback(err, res);
                                        } else {
                                            console.log(res);
                                            Object.assign(userDto, res.value);

                                            bucket.upsert(userDto.id, userDto, (err, res) => {
                                                if (err) {
                                                    callback(err, res);
                                                } else {
                                                    callback(null, {user: userDto});
                                                }
                                            });
                                        }
                                    });
                                }
                            });

                        }
                    });

                }
            }
        });

	}

	queryAll(callBack) {
        let query = ViewQuery.from('user', 'all_user');

        this.myBucket.query(query, function(err, all) {
            console.log(all);

            if (!all)
                all = [];

            callBack(all);
        });
    }
}

module.exports = UserModel;