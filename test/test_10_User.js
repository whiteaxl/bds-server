"use strict";

var supertest = require("supertest");
var should = require("should");
var UserService = require("../src/dbservices/User");

var userService = new UserService();


var server = supertest.agent("http://localhost:5000");

describe("10.User",function() {


    //
    //-------------------------------------------------
    var createUserOnSyncGateway = function (done) {
        var userDto = {
            userID : "User_1",
            matKhau: "123"
        };

        userService.createUserOnSyncGateway(userDto, (err, res)=> {
            console.log(res);
            done();
        });
    };

    it("createUserOnSyncGateway", createUserOnSyncGateway);


    var deviceID = 'device-01';
    //
    //-------------------------------------------------
    var testGetUserByDeviceID = function (done) {
        userService.getUserByDeviceID('device-01', (err, res)=> {
            console.log(res);
            done();
        });
    };

    it("testGetUserByDeviceID", testGetUserByDeviceID);


    //-------------------------------------------------
    var testCreateUserByDeviceID = function (done) {
        server
            .post("/api/user/create")
            .send({
                "deviceID" : "deviceID-01"
            })
            .expect("Content-type", /json/)
            .expect(200) // THis is HTTP response
            .end(function (err, res) {
                res.body.should.propertyByPath('user', 'userID');
                console.log("\n testCreateUserByDeviceID:" + res.body.user.userID);

                done();
            });
    };

    it("testCreateUserByDeviceID", testCreateUserByDeviceID);

    //-------------------------------------------------
    var testRegisterFromDevice = function (done) {
        server
            .post("/api/user/register")
            .send({
                "deviceID" : "deviceID-01",
                "phone" : "123456780",
                "verifyCode" : "1234",
                "name" :"Phan Thi Thanh"
            })
            .expect("Content-type", /json/)
            .expect(200) // THis is HTTP response
            .end(function (err, res) {

                console.log("\n testCreateUserByDeviceID:" + res.body.user.userID);

                done();
            });
    };

    it("testRegisterFromDevice", testRegisterFromDevice);

});