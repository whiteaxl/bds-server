module.exports = {
  mongodb: {
    ip: '127.0.0.1',
    port: '27017',
    app: 'nodejs'
  }, 
  crypto: {
    privateKey:
    '37LvDSasdfasfsaf3a3IEIA;3r3oi3joijpjfa3a3m4XvjYOh9Yaa.p3id#IEYDNeaken',
    tokenExpiry: 1 * 30 * 1000 * 60 //1 hour
  },
  validation: {
    username: /^[a-zA-Z0-9]{6,12}$/,
    password: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/
  },
  onepay : {
    secret : "iv9wvzqvy9bhpk1xv7w2hol9qbzsw1i4",
    access_key: "89drdkir1hsi8uie7uuq",
    //rootUrl : "https://api.1pay.vn"
    //rootUrl : `http://${process.env.OPENSHIFT_NODEJS_IP || '192.168.0.109'}:5000`,
    rootUrl : "http://192.168.0.109:5000",
  },
  noCoverUrl : "https://img.landber.com/images/reland_house_large.jpg",
  esms : {
    APIKEY:"80FFA052B5321FE40A7633AA0F01F6",
    SECRETKEY: "6697FF3D7420874690FFC6CAC9C7CE",

    SendMultipleMessageURL : "http://api.esms.vn/MainService.svc/xml/SendMultipleMessage_V2/",
    RETURN_CODE : {
      SUCCESS: 100,
      100: "Request thành công",
      99: "Lỗi không xác định , thử lại sau",
      101: "Đăng nhập thất bại (api key hoặc secrect key không đúng )",
      102: "Tài khoản đã bị khóa",
      103: "Số dư tài khoản không đủ dể gửi tin",
      104: "Mã Brandname không đúng"
    }
  }
};
