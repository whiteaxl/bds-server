'use strict';

var RealEstateExtractor = require("../src/lib/RealEstateExtractor");

var bdsEx = new RealEstateExtractor();

 //for (var i=1; i<=1; i++) {
   //bdsEx.extractRealEstateWithLimit("http://batdongsan.com.vn/nha-dat-cho-thue/-1/-1/-1/" + i, 1, 5, extractedDate);
//   bdsEx.extractRealEstateWithLimit("http://batdongsan.com.vn/nha-dat-ban/-1/-1/-1/" + i, 30, 60, extractedDate);
//}

//bdsEx.extractRealEstateWithLimit("http://batdongsan.com.vn/nha-dat-cho-thue/-1/-1/-1/"+1, 1, 5,extractedDate);


//bdsEx.extractRealEstateWithLimit("http://batdongsan.com.vn/nha-dat-ban/-1/-1/-1/"+1, 1, 5);

//bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-me-linh', 0);
bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-cho-thue-gia-lam', 0);


//bdsEx.extractWithLimit('http://batdongsan.com.vn/nha-dat-ban-ba-vi', 0);


