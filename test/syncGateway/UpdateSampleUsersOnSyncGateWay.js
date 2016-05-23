'use strict';

var UserService = require("../../src/dbservices/User");

var userService = new UserService();

var userDto = {
  phone : "0982969669",
  matKhau: "123",
  fullName : "tran van 05_03",
  id : "User_4",
  type: "User"
};

/*
userService.createLoginOnSyncGateway(userDto, (err, res)=> {
  console.log(res);
});
*/


userService.updateUser(userDto, (err, res) => {
  console.log("Callback createUserAndLogin", err, res);
});