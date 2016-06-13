'use strict';

var SyncGW = require("../../src/dbservices/SyncGW");

var syncGW = new SyncGW();

var chatDto = {
  //chatID: "Chat_1",
  fromUserID    : "097001",
  toUserID      : "098001",
  fromFullName  : "Nguyen Van Te",
  toFullName    : "Tran Thi Thao",
  fromUserAvatar: 'http://i55.tinypic.com/5k0b3d.jpg',
  relatedToAds  : {
    adsID : "Ads_bds_097001",
    title : "10.5 tỷ - Biệt thự - KDT Xala, Hà Đông",
    cover: "http://file4.batdongsan.com.vn/resize/120x90/2016/03/29/9nEQh3wp/20160329095402-66d6.jpg"
  },
  content: "Nội thất có gì không ạ 01-2",
  msgType : "text",
  read : false,
  date : new Date(),
  timeStamp: "09:12 PM",
  type: "Chat"
};


var chatDto1 = {
  //chatID: "Chat_1",
  fromUserID    : "098003",
  toUserID      : "098001",
  fromFullName  : "Pham Van Tuyen",
  toFullName    : "Tran Thi Thao",
  fromUserAvatar  : "http://autographmagazine.com/wp-content/uploads/2009/01/Barack-Obama.jpg",
  relatedToAds  : {
    adsID : "Ads_bds_3609065",
    title : "1.2 tỷ - Căn hộ chung cư - Carina Plaza",
    cover: "http://file1.batdongsan.com.vn/guestthumb120x90.20140906133609914.jpg"
  },
  content: "Anh cho thêm vài ba tấm anh nữa 03",
  msgType : "text",
  read : false,
  date : new Date(),
  timeStamp: "09:12 PM",
  type: "Chat"
};


var chatDto2 = {
  chatID: "Chat_9_10_001",
  fromUserID    : "User_9",
  toUserID      : "User_10",
  fromFullName  : "User 9",
  toFullName    : "User 10",
  fromUserAvatar  : "https://techreviewpro-techreviewpro.netdna-ssl.com/wp-content/uploads//2015/03/Nice-Success-Picture-for-facebook-profile-WhatsApp-DP-Cover-Pic.jpg",
  relatedToAds  : {
    adsID : "Ads_bds_3776104",
    title : "5.5 triệu/tháng - Căn hộ chung cư - Era Town",
    cover: "http://file1.batdongsan.com.vn/guestthumb120x90.20150128093209122.jpg"
  },
  content: "Chat from user 9, send to user 10 001",
  msgType : "text",
  read : false,
  date : new Date(),
  timeStamp: "09:12 PM",
  type: "Chat"
};

var chatDto2_1 = {
  chatID: "Chat_10_9_001",
  fromUserID    : "User_10",
  toUserID      : "User_9",
  fromFullName  : "User 10",
  toFullName    : "User 9",
  fromUserAvatar  : "https://techreviewpro-techreviewpro.netdna-ssl.com/wp-content/uploads//2015/03/Nice-Success-Picture-for-facebook-profile-WhatsApp-DP-Cover-Pic.jpg",
  relatedToAds  : {
    adsID : "Ads_bds_3776104",
    title : "5.5 triệu/tháng - Căn hộ chung cư - Era Town",
    cover: "http://file1.batdongsan.com.vn/guestthumb120x90.20150128093209122.jpg"
  },
  content: "Chat from user 10, send to user 9 001",
  msgType : "text",
  read : false,
  date : new Date(),
  timeStamp: "09:12 PM",
  type: "Chat"
};



var chatDto3 = {
  chatID: "Chat_010",
  fromUserID    : "User_10",
  toUserID      : "User_0",
  fromFullName  : "User 10",
  toFullName    : "User 0",
  fromUserAvatar  : "https://techreviewpro-techreviewpro.netdna-ssl.com/wp-content/uploads//2015/03/Funny-Love-Quote-Best-Whatsapp-Profile-Dp-Profiledp.jpg",
  relatedToAds  : {
    adsID : "Ads_bds_3989184",
    title : "33 triệu/m² - Căn hộ chung cư - N05 Trần Duy Hưng",
    cover: "http://file1.batdongsan.com.vn/guestthumb120x90.20131125095109163.jpg"
  },
  content: "Giá có thể giảm thêm được không anh 20",
  msgType : "text",
  read : false,
  timeStamp: "09:12 PM",
  date : new Date(),
  type: "Chat"
};

var chatDto30 = {
  chatID: "Chat_002",
  fromUserID    : "User_0",
  toUserID      : "User_10",
  fromFullName  : "User 0",
  toFullName    : "User 10",
  relatedToAds  : {
    adsID : "Ads_bds_3989184",
    title : "33 triệu/m² - Căn hộ chung cư - N05 Trần Duy Hưng",
    cover: "http://file1.batdongsan.com.vn/guestthumb120x90.20131125095109163.jpg"
  },
  content: "Khong the, tot nhat roi 2",
  msgType : "text",
  read : false,
  timeStamp: "09:12 PM",
  date : new Date(),
  type: "Chat"
};

/*
userService.createLoginOnSyncGateway(userDto, (err, res)=> {
  console.log(res);
});
*/

syncGW.createDocViaSyncGateway(chatDto2, (err, res) => {
  console.log("Callback createChat", err, res);
});


setTimeout( () =>
syncGW.createDocViaSyncGateway(chatDto2_1, (err, res) => {
  console.log("Callback createChat 2", err, res);
}), 5000);
