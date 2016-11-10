'use strict';

var Boom = require('boom');

var couchbase = require('couchbase');
var ViewQuery = couchbase.ViewQuery;

var myBucket = require('../../database/mydb');
myBucket.operationTimeout = 120 * 1000;
var QueryOps = require('../../lib/QueryOps');
var constant = require("../../lib/constant");

var UserService = require('../../dbservices/User');
var JWT    = require('jsonwebtoken');

var userService = new UserService();

var JWT_SECRET = 'Cexk6azogyew7DoTOYKgAXtTOP+18VLDQ1MzYoEWxr6Gqbhg+CeK33MuBPdhyz1dlW4VOKE/ce4TTkfI0yGLlTc+kC74BA8WNoySWmmNsBTEgt83f+9WKYNUgYoGUvml3rRlzvNG71bFqcfJa7U+AuCECq8JnPTeMQ4MSuFBZb4i/q91ZPoI/8SDmcvfai1ofyaHc4xauqhq2hrED5zuZsFbiRDY9bo4d4hHPXdBQaUCm/vklx/BxaAL3OLvvNGhULYmbV/v9Yj0xSAqhZMd7b0TJcDYZ+FHrTX7ZCG15M/Sj/amI/auUEKRNYfwL67/Y7zZxgUWLPsZQ48zPBxgeA==';

var internals = {};

var chatHandler = require("../../lib/ChatHandler");

var RewayMailer = require("../../lib/RewayMailer");


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
            if(req.payload.matKhau){
                if(res[0].matKhau == req.payload.matKhau){
                	var token = JWT.sign({
	          			uid: res[0].userID,
	          			exp: Math.floor(new Date().getTime()/1000) + 7*24*60*60,
	          			userName: res[0].name,
	          			userID: res[0].userID
        			}, JWT_SECRET);
        			result.login = true;
        			result.token = token;
        			result.userName = res[0].name;
        			result.userID = res[0].id;
                    result.email = res[0].email;
                    result.avatar = res[0].avatar;
                    result.lastSearch = res[0].lastSearch;
                    result.lastViewAds = res[0].lastViewAds;
                    result.adsLikes = res[0].adsLikes;
                    result.phone = res[0].phone;
                    result.saveSearch = res[0].saveSearch;
                }else{
                	result.message = "Mật khẩu không đúng ";
                }
            }
            
        }
        reply(result);
    })
}

internals.signup = function(req, reply){
    var deviceDto = {
        deviceID: req.payload.deviceID || undefined,
        deviceModel: req.payload.deviceModel || undefined,
        type: 'Device'
    }


    req.payload.deviceID = undefined;
    req.payload.deviceModel = undefined;

	userService.createUserForWeb(reply, req.payload, function(err, user){
        
		if(err!=null){
			reply(err);
		}else{

            if(deviceDto.deviceID){
                deviceDto.userID = user.userID;

                userService.updateDevice(deviceDto, (err, res) => {
                    let toClient = {};
                    if (err) {
                        toClient.login = false;
                        toClient.msg = err.msg;
                        reply(toClient);
                    }
                 });
            }
            console.log("bbbbbb");
			var token = JWT.sign({
				uid: user.userID,
	          	exp: Math.floor(new Date().getTime()/1000) + 7*24*60*60,
	          	userName: user.name,
	          	userID: user.userID
        	}, JWT_SECRET);
        	//console.log("token" + token);
            console.log("ccccc");
        	var result = {};
        	result.login = true;
        	result.token = token;
        	result.userName = user.name;
        	result.userID = user.id;
            result.email = user.email;
            //result.phone = user.phone;
            console.log("dddddd");
            chatHandler.addUser(user);
            console.log("eeeee");
        	reply(result);
		}
	})
}

/**

This function send email / sms to nguoi dung voi mat khau moi

{
Request Data:
{
    email: email dung de dang nhap
    phone: so dien thoai de dang nhap
}
Response Data:
{
    success: true/false
    sentMail: true/false
    sentSms: true/false
}

}

*/
internals.forgotPassword = function(req,reply){
    var email = req.payload.email;
    var phone = req.payload.phone;
    var newPass = req.payload.newPass;
    var result = {
        success: false,
        sentMail: false,
        sentSms: false
    }
    if(email){
        userService.getUser({email: email}, (err, res) => {
          if (err) {
            reply({
              success: false,
              msg: err.toString()
            });
            return;
          }

          if (res.length <= 0) { //exists
            reply({
              success: false,
              msg:constant.MSG.USER_NOT_EXIST + ". Xin nhập địa chỉ email"
            });
            return;
          }
          //
          var user = res[0];

          console.log(JSON.stringify(user));
          var randomstring = Math.random().toString(36).slice(-8);
          var token = JWT.sign({
            uid: user.userID,            
            exp: Math.floor(new Date().getTime()/1000) + 7*24*60*60,
            userName: user.name,
            pass: randomstring,
            userID: user.id,
          }, JWT_SECRET);

          
    
          var url = req.connection.info.protocol + '://' + req.info.host + "/web/resetPassword?token=" + token;      
          console.log(url);
          RewayMailer.sendMail({
            to: email,
            subject: 'Reland: Quen mat khau',
            html: 'Hi '+ user.name + ',<br> Hãy click vào link này để đặt lại mật khẩu: <a href="'+url+'"> đổi mật khẩu </a>'  
          }, function(error, response){
            if (error) {
                console.log(error);
                result.success = false;
                reply(result);
            } else {
                console.log('Message sent');
                result.success = true;
                result.sentMail = true;
                result.msg = "Mail đã gửi thành công! Hãy kiểm tra email và làm theo hướng dẫn để đổi mật khẩu";
                reply(result);
            }
          });
        });
    }else if(phone){
        result.success = true;
        result.sentMail = true;
        result.msg = "TODO";
        reply(result);
    }
}

internals.changePassword = function(req,reply){
    var mydecoded = JWT.decode(req.auth.token,{complete: true});
    var userID = mydecoded.payload.userID;

    var userDto = {
        userID: userID,
        password: req.payload.password,
        newPassword: req.payload.newPassword
    }

    userService.changePassword(userDto, reply)
}

internals.resetPassword = function(req,reply){
    var token = req.payload.token;
    var pass = req.payload.pass;
    console.log(JSON.stringify(req.payload));
    var mydecoded = JWT.decode(token,{complete: true});
    console.log(JSON.stringify(mydecoded));
    var userID = mydecoded.payload.userID;
    var userName = mydecoded.payload.userName;
    //var pass = mydecoded.payload.pass;

    userService.resetPassword({"userID": userID, "pass": pass}, reply)
}

/**

This function get the user by userID 
*/

internals.profile = function(req,reply){
    var result = {
        success: false,
        user: undefined
    }
    var userID = req.payload.userID;
    console.log("get profile for " + userID);
    userService.getUserByID(userID,function(err,res){
        console.log(JSON.stringify(res));
        if(res && res.length>0){
            result.success = true;
            result.user = res[0];
            reply(result);
        }else{
            reply(result);
        }

    })
}

/**

This function update user profile
Request:{
    newPass,
    email,
    phone,
    fullName,
    diaChi,
    userID
}
*/

internals.updateProfile = function(req,reply){
    var result = {
        success: false,
        msg: ""
    }
    console.log("update profile " + JSON.stringify(req.payload));
    var userID = req.payload.userID;

    userService.getUserByID(userID,function(err,res){
        console.log(JSON.stringify(res));
        if(res && res.length>0){
            var user = res[0];
            user.userID = user.id;
            user.fullName = req.payload.fullName;
            user.email = req.payload.email;
            user.phone = ""+req.payload.phone;
            user.diaChi = req.payload.diaChi;
            user.gioiThieu = req.payload.gioiThieu;
            user.avatar = req.payload.avatar;
            user.sex = req.payload.sex;
            user.birthDate = req.payload.birthDate;
            user.website = req.payload.website;
            user.broker = req.payload.broker;
            user.timeModified = (new Date()).getTime();

            userService.upsert(user,function(uerr,ures){
                if(uerr){
                    result.msg = uerr;
                }else{
                    result.success = true;
                }
                reply(result);
            });
        }else{
            reply(result);
        }

    })
}

module.exports = internals;