'use strict';

var RealEstateExtractor = require("../src/lib/RealEstateExtractor");

var bdsEx = new RealEstateExtractor();

//var extractedDate = "20160702";
var extractedDate = null;

 //for (var i=1; i<=1; i++) {
   //bdsEx.extractRealEstateWithLimit("http://batdongsan.com.vn/nha-dat-cho-thue/-1/-1/-1/" + i, 1, 5, extractedDate);
//   bdsEx.extractRealEstateWithLimit("http://batdongsan.com.vn/nha-dat-ban/-1/-1/-1/" + i, 30, 60, extractedDate);
//}

//bdsEx.extractRealEstateWithLimit("http://batdongsan.com.vn/nha-dat-cho-thue/-1/-1/-1/"+1, 1, 5,extractedDate);


//bdsEx.extractRealEstateWithLimit("http://batdongsan.com.vn/nha-dat-ban/-1/-1/-1/"+1, 1, 5);

bdsEx.extractRealEstateWithLimit("http://batdongsan.com.vn/nha-dat-ban-thanh-oai", 1, 101,null);

