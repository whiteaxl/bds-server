'use strict';

var SyncGW = require("../../src/dbservices/SyncGW");

var syncGW = new SyncGW();

var chatDto = {
  id : "Chat_0_1_001",
  chatID: "Chat_0_1_001",
  fromUserID    : "User_0",
  toUserID      : "User_1",
  fromFullName  : "User 0",
  toFullName    : "User 1",
  fromUserAvatar  : "https://techreviewpro-techreviewpro.netdna-ssl.com/wp-content/uploads//2015/03/Nice-Success-Picture-for-facebook-profile-WhatsApp-DP-Cover-Pic.jpg",
  relatedToAds  : {
    adsID : "Ads_bds_3776104",
    title : "5.5 triệu/tháng - Căn hộ chung cư - Era Town",
    cover: "http://file1.batdongsan.com.vn/guestthumb120x90.20150128093209122.jpg"
  },
  content: "Chat 001",
  msgType : "text",
  read : false,
  date : new Date(),
  timeStamp: "09:12 PM",
  type: "Chat",
  epoch: new Date().getTime()
};

syncGW.createDocViaSyncGateway(chatDto, (err, res) => {
  console.log("Callback createChat", err, res);
});

