'use strict';

var UserService = require("../../src/dbservices/User");

var userService = new UserService();

var userDto = {
  phone : "11",
  matKhau: "123",
  fullName : "tran van 11",
};

/*
userService.createLoginOnSyncGateway(userDto, (err, res)=> {
  console.log(res);
});
*/


userService.createUserAndLogin(userDto, (err, res) => {
  console.log("Callback createUserAndLogin", err, res);
});
