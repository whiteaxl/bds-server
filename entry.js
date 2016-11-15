 //require("!style!css!./src/web/assets/css/style.css");
 //require("!style!css!./src/web/assets/css/ie.css");
// require("./src/app/app.js");
require("./src/web/common/services/test_data.js");
require("./src/web/common/utils/common.js");

//Controller
require("./src/web/app/home/home.js");
require("./src/web/app/home/homeCtrl.js");
require("./src/web/app/home/searchCtrl.js");
require("./src/web/app/home/homeCtrl.js");
require("./src/web/app/home/newsCtrl.js");
require("./src/web/app/home/newsDetailCtrl.js");

require("./src/web/app/home/detailCtrl.js");
require("./src/web/app/home/ChatPanelCtrl.js");
require("./src/web/app/home/ProfileCtrl.js");
require("./src/web/app/home/DangTinCtrl.js");


//services
require("./src/web/common/services/newsService.js");
require("./src/web/common/services/house.js");
require("./src/web/common/services/utils.js");


//Directives
require("./src/web/common/directives/loginDirective.js");
require("./src/web/common/directives/userInfoMenuDirective.js");
require("./src/web/common/directives/afterRenderedDirective.js");
require("./src/web/common/directives/chatDirective.js");
require("./src/web/common/directives/chatCtrl.js");
require("./src/web/common/directives/diaChinhLink.js");
require("./src/web/common/directives/bdsHeaderDirective.js");
require("./src/web/common/directives/bdsMobileMenuDirective.js");
require("./src/web/common/directives/bdsProfileLeftDirective.js");
require("./src/web/common/directives/bdsAdsBoxListDirective.js");



//Mobile zone
// require("./src/web/app/mobile/MobileHome.js");
require("./src/web/app/mobile/MobileHomeCtrl.js");
require("./src/web/app/mobile/MobileSearchCtrl.js");
require("./src/web/app/mobile/MobileDetailCtrl.js");
require("./src/web/app/mobile/MobileChatCtrl.js");
 require("./src/web/app/mobile/MobileChatDetailCtrl.js");
require("./src/web/app/mobile/MobilePostCtrl.js");
require("./src/web/app/mobile/MobileAdsMgmtCtrl.js");



require("./src/web/common/directives/mobile/BdsMobileLeftMenuDirective.js");
require("./src/web/common/directives/mobile/BdsMobileFilterDirective.js");
require("./src/web/common/directives/mobile/BdsMobileHeaderDirective.js");
require("./src/web/common/directives/mobile/BdsMobileLoginDirective.js");


//Libs
require("./src/lib/DanhMuc.js");
require("./src/lib/placeUtil.js");
require("./src/lib/utils.js");
require("./src/lib/constant.js");
// require("./src/lib/services.js");

