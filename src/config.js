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
    rootUrl : "http://localhost:5000",
    //rootUrl : "http://192.168.0.109:5000",
  }
};
