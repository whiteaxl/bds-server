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

var placeHandlers = require('./placeHandlers');

var esms = require("../../lib/esms");

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

                    var lastSearch = res[0].lastSearch;
                    if (lastSearch && lastSearch.length>0) {
                        lastSearch.sort((a, b) => b.timeModified - a.timeModified);
                        if (!lastSearch[0].query.viewport){
                            if(lastSearch[0].query.diaChinh){
                                let diaChinh = {
                                    tinh: lastSearch[0].query.diaChinh.tinhKhongDau || undefined,
                                    huyen: lastSearch[0].query.diaChinh.huyenKhongDau || undefined,
                                    xa: lastSearch[0].query.diaChinh.xaKhongDau || undefined
                                }
                                let diaChinhResult = placeHandlers._getDiaChinhFromCache(diaChinh);
                                if (diaChinhResult && diaChinhResult.length>0 && diaChinhResult[0].geometry){
                                    lastSearch[0].query.viewport = diaChinhResult[0].geometry.viewport;
                                }
                            }
                        }
                    }

        			result.login = true;
        			result.token = token;
        			result.userName = res[0].name;
        			result.fullName = res[0].fullName;
        			result.userID = res[0].id;
                    result.email = res[0].email;
                    result.avatar = res[0].avatar;
                    result.lastSearch = lastSearch;
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
	          	userName: user.fullName,
	          	userID: user.userID
        	}, JWT_SECRET);
        	//console.log("token" + token);
            console.log("ccccc");
        	var result = {};
        	result.login = true;
        	result.token = token;
        	result.userName = user.fullName;
        	result.userID = user.id;
            result.email = user.email;
            //result.phone = user.phone;
            console.log("dddddd");
            //nhannc rao
            //chatHandler.addUser(user);
            //
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
        if (phone && (phone.length != 10 && phone.length !=11)){
            console.log("loginHandler.forgotPassword - sai dinh dang so dt " + phone);
            result.msg = "Số điện thoại không đúng định dạng";
            reply(result);
            return;
        }
        userService.getUser({phone: phone}, (err, res) => {
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
                    msg:constant.MSG.USER_NOT_EXIST + ". Xin nhập số điện thoại"
                });
                return;
            }

            var user = res[0];
            let code = Math.round(Math.random()*100000).toString();

            esms.sendMultipleMessage(code, [phone])
                .then((res) => {
                    console.log("Final res:", res);
                    // Final res: { code: 0, errorMsg: undefined }
                    if (res.code ==0 ){
                      let expiredDate = Math.floor(new Date().getTime()/1000) + 12*60*60;

                      let verify = {    sendType: 'sms', // sms/email
                                        verifyType:'password', // password/ads
                                        verifyCode: code,
                                        expiredDate: expiredDate,
                                        verifyStatus:  false // true/false
                                    };

                      user.verify = user.verify ? user.verify : [];

                      user.verify.push(verify);

                      userService.upsert(user,function(uerr,ures){
                            if(uerr){
                                result.success = false
                                result.msg = uerr;
                            }else{
                                result.success = true;
                                result.sentSms = true;
                            }
                            reply(result);
                      });
                    }
                });
        });

        /*result.success = true;
        result.sentMail = true;
        result.msg = "TODO";
        reply(result);*/
    }
}

/**

 This function udpate password su dung verifyCode

 {
 Request Data:
 {
     email: email dung de dang nhap
     phone: so dien thoai de dang nhap
     verifyCode: verify code lay tu sms
     newPassword: mat khau moi su dung de update
 }
 Response Data:
 {
     success: true/false
 }

 }

 */

internals.updatePassword = function(req,reply){
    var email = req.payload.email;
    var phone = req.payload.phone;
    var verifyCode = req.payload.verifyCode;
    var newPassword = req.payload.newPassword;

    var result = {
        success: false
    }

    if (email){
        result.success = true;
        result.msg = "TODO";
        reply(result);
    } else if (phone){
        userService.getUser({phone: phone}, (err, res) => {
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
                    msg: constant.MSG.USER_NOT_EXIST + ". Xin nhập số điện thoại"
                });
                return;
            }

            var user = res[0];
            let expiredDate = Math.floor(new Date().getTime()/1000);
            if (user.verify && user.verify.length>0){
                for (var i=0; i< user.verify.length; i++){
                    if (user.verify[i].verifyCode == verifyCode
                        && expiredDate <= user.verify[i].expiredDate
                        && !user.verify[i].verifyStatus)
                    {
                        user.verify[i].verifyStatus = true;
                        user.matKhau = newPassword;

                        userService.upsert(user,function(uerr,ures){
                            if(uerr){
                                result.success = false
                                result.msg = uerr;
                            }else{
                                result.success = true;
                            }
                            reply(result);
                        });
                        return;
                    }
                }
                reply({
                    success: false,
                    msg: "Mã xác nhận không hợp lệ"
                });
                return;
            } else {
                reply({
                    success: false,
                    msg: "Không tồn tại mã xác nhận"
                });
                return;
            }

        });
    }

    /*result.success = true;
    result.msg = "TODO";
    reply(result);*/
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