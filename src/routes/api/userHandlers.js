"use strict";

var User = require("../../dbservices/User");
var Boom = require('boom');
var moment = require('moment');
var log = require("../../lib/logUtil");
var constant = require("../../lib/constant");
var util = require("../../lib/utils");

var userService = new User();

var internals = {};

var cache = {};

internals.requestVerifyCode = function (req, reply) {
  console.log("Call requestVerifyCode:", req.payload);
  const phone = req.payload.phone;

  try {
    //check existing:
    userService.getUser({phone: phone}, (err, res) => {
      if (err) {
        reply({
          status: 99,
          msg: err.toString()
        });

        return;
      }

      if (res.length > 0) { //exists
        log.warn("User already existed!");
        log.info(res);

        reply({
          status: 1,
          msg:constant.MSG.USER_EXISTS
        });

        return;
      }
      //good
      const verifyCode = Number(moment().format('HHmm'));
      cache[phone] = verifyCode;
      console.log("requestVerifyCode, verifyCode of " + phone + " is " + verifyCode);

      reply({
        status: 0,
        verifyCode: verifyCode
      });
    });
  } catch (e) {
    console.log(e);
    reply(Boom.badImplementation());
  }
};

internals.registerUser = function (req, reply) {
  log.info("Call registerUser:", req.payload);

  let userDto = {
    phone: req.payload.phone,
    email: req.payload.email,
    matKhau: req.payload.matKhau,
    fullName: req.payload.fullName
  };

  userService.createUserAndLogin(userDto, (err, res) => {
    console.log("Callback createUserAndLogin", err, res);
    let toClient = {};
    if (err) {
      toClient.status = 99;
      toClient.msg = err.msg;

    } else {
      toClient.status = 0;
      toClient.res = res;
    }

    reply(toClient);
  });
};

internals.updateDevice = function (req, reply) {
  log.info("Call updateDevice:", req.payload);
  let dto = req.payload;

  dto.type = 'Device';

  const userDto = {
    phone : dto.phone,
    email : dto.email
  };

  userService.getUser(userDto, (err, res) => {
    if (!err && res.length > 0) { //exists
      //console.log("Callback getUser", err, res);
      dto.userID = res[0].userID;

      userService.updateDevice(dto, (err, res) => {
        let toClient = {};
        if (err) {
          toClient.status = 99;
          toClient.msg = err.msg;

        } else {
          toClient.status = 0;
          toClient.res = res;
        }

        reply(toClient);
      });
    } else {
      console.log("Callback getUser error", err, res);
      let msg = err ? "Error:" + err.msg : "User does not exist!";

      reply({
        status : 99,
        msg : msg
      });
    }
  });
};

function convertAds(ads) {
  //images:
  var targetSize = "745x510"; //350x280

  let tmp = {
    adsID : ads.adsID,
    gia : ads.gia,
    giaFmt: util.getPriceDisplay(ads.gia, ads.loaiTin),
    dienTich: ads.dienTich, dienTichFmt: util.getDienTichDisplay(ads.dienTich),
    soPhongNgu: ads.soPhongNgu,
    soPhongNguFmt: ads.soPhongNgu ? ads.soPhongNgu + "pn" : null,
    soTang: ads.soTang,
    soTangFmt: ads.soTang ? ads.soTang + "t" : null,
    image : {
      cover: ads.image.cover ? ads.image.cover.replace("80x60", targetSize).replace("120x90", targetSize):null,
      images : ads.image.images ? ads.image.images.map((e) => {
        return e.replace("80x60", targetSize);
      }) : null
    },
    diaChi : ads.place.diaChi,
    ngayDangTin : ads.ngayDangTin,
    giaM2 : ads.giaM2,
    loaiNhaDat: ads.loaiNhaDat,
    loaiTin: ads.loaiTin,
    huongNha: ads.huongNha
  };



  if (tmp.chiTiet) {
    var idx = val.chiTiet.indexOf("Tìm kiếm theo từ khóa");
    tmp.chiTiet =  tmp.chiTiet.substring(0, idx);
  }

  if (tmp.ngayDangTin) {
    var ngayDangTinDate= moment(tmp.ngayDangTin, constant.FORMAT.DATE_IN_DB);
    tmp.soNgayDaDangTin = moment().diff(ngayDangTinDate, 'days');
  }

  return tmp;
}

internals.getAdsLikes = function (req, reply) {
  log.info("Call getAdsLikes:", req.payload);
  let userID = req.payload.userID;

  try {
    userService.getAdsLikes(userID, (err, res) => {
      if (!err) { //exists
        console.log("Callback getAdsLikes", err, res);
        let listAds = res.map(e => {
          return convertAds(e);
        });
        reply({
          data : listAds,
          status : 0,
        });
      } else {
        reply({
          status : 99,
          msg : err.msg
        });
      }
    });
  } catch (ex) {
    log.error(ex);
    reply({
      status : 99,
      msg : ex.toString()
    });
  }


};


module.exports = internals;

