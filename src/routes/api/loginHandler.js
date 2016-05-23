'use strict';

var Boom = require('boom');

var couchbase = require('couchbase');
var ViewQuery = couchbase.ViewQuery;

var myBucket = require('../../database/mydb');
myBucket.operationTimeout = 120 * 1000;
var QueryOps = require('../../lib/QueryOps');

var UserService = require('../../dbservices/User');
var JWT    = require('jsonwebtoken');

var userService = new UserService();

var JWT_SECRET = 'Cexk6azogyew7DoTOYKgAXtTOP+18VLDQ1MzYoEWxr6Gqbhg+CeK33MuBPdhyz1dlW4VOKE/ce4TTkfI0yGLlTc+kC74BA8WNoySWmmNsBTEgt83f+9WKYNUgYoGUvml3rRlzvNG71bFqcfJa7U+AuCECq8JnPTeMQ4MSuFBZb4i/q91ZPoI/8SDmcvfai1ofyaHc4xauqhq2hrED5zuZsFbiRDY9bo4d4hHPXdBQaUCm/vklx/BxaAL3OLvvNGhULYmbV/v9Yj0xSAqhZMd7b0TJcDYZ+FHrTX7ZCG15M/Sj/amI/auUEKRNYfwL67/Y7zZxgUWLPsZQ48zPBxgeA==';

var internals = {};


/**
    Ham nay kiem tra xem user co ton tai trong he thong theo tat ca nhung dieu kien truyen vao
    Request json: {
        email: email cua nguoi dun
        phone: so dien thoai nguoi dung
        userId: id cua user
    }
    Respone: json: {
        exist: true/false
    }
*/
internals.checkUserExist = function(req, reply){
    userService.isUserExist(req.payload,function(data){
        reply({
            exist: data
        });    
    }); 
}


/**
Ham nay thuc hien viec login va tra ve 1 jwt neu login thanh cong
Request json{
    email: email cua nguoi dung
    phone: so dien thoai
    userId: id cua user
    matKhau: mat khau
}
*/
internals.login = function(req, reply){

    userService.getUser(req.payload, function(err,res){
    	var result = {
    		login: false,
    		token: undefined,
    		message: undefined
    	}
    	console.log(req.payload);

        if(res && res.length==1){
        	console.log(res[0]);
            if(req.payload.matKhau){
                if(res[0].matKhau == req.payload.matKhau){
                	var token = JWT.sign({
	          			uid: res[0].userId,
	          			exp: Math.floor(new Date().getTime()/1000) + 7*24*60*60,
	          			userName: res[0].name,
	          			userID: res[0].userId
        			}, JWT_SECRET);
        			//console.log("token" + token);
        			result.login = true;
        			result.token = token;
        			result.userName = res[0].name;
        			result.userId = res[0].userID;
                }else{
                	result.message = "Mật khẩu không đúng ";
                }
            }
            
        }
        console.log(result);
        reply(result);
    })
}
internals.signup = function(req, reply){
	userService.createUserForWeb(req.payload, function(err, user){
		if(err!=null){
			reply(err);
		}else{
			var token = JWT.sign({
				uid: user.userID,
	          	exp: Math.floor(new Date().getTime()/1000) + 7*24*60*60,
	          	userName: user.name,
	          	userID: user.userID
        	}, JWT_SECRET);
        	//console.log("token" + token);
        	var result = {};
        	result.login = true;
        	result.token = token;
        	result.userName = user.name;
        	result.userId = user.userID;
        	reply(result);
		}
	})
}

module.exports = internals;