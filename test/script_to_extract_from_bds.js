'use strict';

var request = require("request");


//rootURL=http%3A%2F%2Fbatdongsan.com.vn%2Fnha-dat-ban&pageFrom=1&pageTo=5

function extract(sub, from, to) {

    var url = "http://localhost:5000/web/admin/extract/bds_com?" +
        `rootURL=${sub}&pageFrom=${from}&pageTo=${to}`;

    var done = false;

    request({url: url}, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("Done ok")
        } else {
            console.log("Error when extract" + error);
        }

        done = true;
    });

    var timer = setInterval(()=> {
        console.log("running...");
        if (done) {
            clearInterval(timer);
        }
    }, 1000);
}

/*
extract("http://batdongsan.com.vn/nha-dat-ban/", 6, 10);
extract("http://batdongsan.com.vn/nha-dat-ban/nha-dat-cho-thue", 6, 10);


for (var i=1; i<=8; i++) {
    extract("http://batdongsan.com.vn/nha-dat-ban/-1/-1/-1/"+i, 1, 5);
    extract("http://batdongsan.com.vn/nha-dat-cho-thue/-1/-1/-1/"+i, 1, 5);
}
*/

extract("http://batdongsan.com.vn/nha-dat-ban-ha-noi/", 31, 35);
extract("http://batdongsan.com.vn/nha-dat-cho-thue-ha-noi/", 31, 35);

