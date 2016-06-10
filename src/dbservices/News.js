'use strict';
var mysql = require("mysql");
var connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "123456",
    database : "reland"
});
connection.connect(function (error) {
    if(error){
        console.log("Problem with connect to database Reland");
    } else{
        console.log("Connect db success");
    }
});