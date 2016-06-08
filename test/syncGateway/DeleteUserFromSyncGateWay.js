'use strict';

var UserService = require("../../src/dbservices/User");

var userService = new UserService();

var userDto = {
  phone : "0987654301"
};

/*
userService.createLoginOnSyncGateway(userDto, (err, res)=> {
  console.log(res);
});
*/


userService.deleteUser(userDto, (err, res) => {
  console.log("Callback deleteUser", err, res);
});
