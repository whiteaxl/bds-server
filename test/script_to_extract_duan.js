'use strict';

var DuAnExtractor = require("../src/lib/DuAnExtractor");

function extractDuan(sub, from, to) {

var duanEx = new DuAnExtractor();

duanEx.extractWithLimit(sub,from,to);

}


extractDuan("http://batdongsan.com.vn/cao-oc-van-phong", 1, 14);
// extractDuan("http://batdongsan.com.vn/khu-can-ho", 1, 55);
// extractDuan("http://batdongsan.com.vn/khu-do-thi-moi", 1, 23);
// extractDuan("http://batdongsan.com.vn/khu-thuong-mai-dich-vu", 1, 4);
// extractDuan("http://batdongsan.com.vn/khu-phuc-hop", 1, 14);
// extractDuan("http://batdongsan.com.vn/khu-dan-cu", 1, 17);
// extractDuan("http://batdongsan.com.vn/khu-du-lich-nghi-duong", 1, 9);
// extractDuan("http://batdongsan.com.vn/khu-cong-nghiep", 1, 2);
// extractDuan("http://batdongsan.com.vn/du-an-khac", 1, 7);

