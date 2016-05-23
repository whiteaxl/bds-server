'use strict';

var UserService = require("../../src/dbservices/User");

var userService = new UserService();

var chatDto = {
  phone : "04",
  msg : "msg 5",
  type: "User"
};

/*
userService.createLoginOnSyncGateway(userDto, (err, res)=> {
  console.log(res);
});
*/


userService.createUser(chatDto, (err, res) => {
  console.log("Callback createUser", err, res);
});
