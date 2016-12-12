(function() {
  'use strict';
  window.initData = {};
  
  var postal = require("postal.js");
    
  var tap = postal.addWireTap( function( d, e ) {
    console.log( JSON.stringify( e ) );
  });

  var _ = require('lodash');
  var FastClick = require('fastclick');

  var bds= angular.module('bds', ['ngCookies','ui.router','nemLogging','ngMap','ngMessages','ngStorage','ngFileUpload','btford.socket-io','angular-jwt','infinite-scroll','ngDialog'])
      .factory('socket', function (socketFactory) {
          // var socket = io.connect("http://localhost:5000");

          var socket = io.connect();
          //socket.forward('error');
          // socket.connect();
          return socket;
      })
      .config(function($provide,$stateProvider, $urlRouterProvider,$locationProvider,$interpolateProvider,$httpProvider){
          // For any unmatched url, send to /route1
          $locationProvider.html5Mode(true);

          $provide.decorator('$rootScope', ['$delegate','$window', function ($delegate,$window) {
              Object.defineProperty($delegate.constructor.prototype,
                  '$bus', {
                      value: postal,
                      enumerable: false
                  });
              return $delegate;
          }]);




          $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
              return {
                  'request': function (config) {
                      config.headers = config.headers || {};
                      if ($localStorage.relandToken) {
                          config.headers.Authorization = 'Bearer ' + $localStorage.relandToken;
                      }
                      return config;
                  },
                  'responseError': function (response) {
                      if (response.status === 401 || response.status === 403) {
                          //$location.path('/signin');
                          alert("Đăng nhập hệ thống để sử dụng tính năng này");
                      }
                      return $q.reject(response);
                  }
              };
          }]);

          //$urlRouterProvider.otherwise("/web/list.html")
          //alert('sss');
          // $interpolateProvider.startSymbol('{[{');
          // $interpolateProvider.endSymbol('}]}');

          /*uiGmapGoogleMapApiProvider.configure({
           //    key: 'your api key',
           v: '3.20', //defaults to latest 3.X anyhow
           libraries: 'places,geometry,visualization' // Required for SearchBox.
           });*/
          $stateProvider
              .state('package', {
                  url: "/hotlist/:packageID/:viewMode",
                  templateUrl: "/web/search.html",
                  controller: "SearchCtrl",
                  controllerAs: 'mc',
                  resolve: {
                      title: function(HouseService,$stateParams,$rootScope) {
                          var result = HouseService.getAllAds();
                          //var result = $rootScope.getGoogleLocationById($stateParams.place);
                          //alert($state.params.place);
                          //var result = HouseService.findAdsSpatial($stateParams.place);
                          result.then(function(data){
                              window.initData = data.data;
                          });
                          return result;
                      }
                  },
                  data: {
                      //bodyClass: "page-search",
                      //abc: title
                  }
                  // ,
                  // controller: function($scope,sellingHouses){
                  //   $scope.sellingHouses = sellingHouses;
                  //   //alert(sellingHouses.length);
                  // }
              })
              .state('searchdc', {
                  url: "/searchdc/:tinh/:huyen/:xa/:loaiTin/:loaiNhaDat/:viewMode",
                  templateUrl: "/web/search.html",
                  controller: "SearchCtrl",
                  controllerAs: 'mc',
                  resolve: {
                      title: function(HouseService,$stateParams,$rootScope) {
                          var result = HouseService.getAllAds();
                          //var result = $rootScope.getGoogleLocationById($stateParams.place);
                          //alert($state.params.place);
                          //var result = HouseService.findAdsSpatial($stateParams.place);
                          result.then(function(data){
                              window.initData = data.data;
                          });
                          return result;
                      }
                  },
                  data: {
                      //bodyClass: "page-search",
                      //abc: title
                  }
                  // ,
                  // controller: function($scope,sellingHouses){
                  //   $scope.sellingHouses = sellingHouses;
                  //   //alert(sellingHouses.length);
                  // }
              }).state('search', {
              url: "/search/:place/:loaiTin/:loaiNhaDat/:viewMode",
              // templateUrl: "/web/search.tpl.html",
              controller: "SearchCtrl",
              controllerAs: 'mc',
              resolve: {
                  title: function(HouseService,$stateParams,$rootScope) {
                      var result = HouseService.getAllAds();
                      //var result = $rootScope.getGoogleLocationById($stateParams.place);
                      //alert($state.params.place);
                      //var result = HouseService.findAdsSpatial($stateParams.place);
                      result.then(function(data){
                          window.initData = data.data;
                      });
                      return result;
                  }
              },
              data: {
                  //bodyClass: "page-search",
                  //abc: title
              }
              // ,
              // controller: function($scope,sellingHouses){
              //   $scope.sellingHouses = sellingHouses;
              //   //alert(sellingHouses.length);
              // }
          }).state('home', {
              url: "/index.html",
              templateUrl: "/web/index_content.html",
              controller: "MainCtrl",
              controllerAs: 'mc',
              resolve: {
                  title: function(HouseService) {
                      //alert(HouseService);
                      //return HouseService.getAllAds();
                      /*.then(function(data){
                       return data.data;
                       });*/
                      //return $http.get("http://www.dantri.com");
                      window.initData = [{a:'a'},{b:'b'}];
                  }
              },
              data: {
                  bodyClass: "page-home",
                  xyz: [{a:'b'}],
              }
          }).state('detail', {
              url: "/detail/:adsID",
              //templateUrl: "/web/index_content.html",
              controller: "DetailCtrl",
              controllerAs: 'dt',
              data: {
                  bodyClass: "page-detail"
              }
          }).state('news', {
              url: "/news/:rootCatId",
              controller: "NewsCtrl",
              controllerAs: 'nc',
              data: {

              }
          }).state('newsDetail', {
              url: "/newsDetail/:rootCatId/:articleId",
              controller: "NewsDetailCtrl",
              controllerAs: 'ndc',
              data: {

              }
          }).state('resetPassword', {
              url: "/resetPassword",
              templateUrl: "/web/index_content.html",
              controller: "MainCtrl",
              controllerAs: 'mc',
              data: {
                  bodyClass: "page-detail"
              }
          }).state('profile', {
              url: "/profile/:userID",
              templateUrl: "/web/profile.tpl.html",
              controller: "ProfileCtrl",
              controllerAs: 'pc',
              data: {
                  bodyClass: "page-detail"
              }
          }).state('dangtin', {
              url: "/dangtin",
              templateUrl: "/web/dang-tin.html",
              controller: "DangTinCtrl",
              controllerAs: 'dt',
              data: {
                  bodyClass: "page-detail"
              }
          }).state('topview', {
              url: "/topview/:tinhKhongDau/:huyenKhongDau/:ngayDaDang",
              templateUrl: "/web/search.html",
              controller: "SearchCtrl",
              controllerAs: 'mc',
              resolve: {
                  title: function(HouseService,$stateParams,$rootScope) {
                      var result = HouseService.getAllAds();
                      //var result = $rootScope.getGoogleLocationById($stateParams.place);
                      //alert($state.params.place);
                      //var result = HouseService.findAdsSpatial($stateParams.place);
                      result.then(function(data){
                          window.initData = data.data;
                      });
                      return result;
                  }
              }
          }).state('mhome', {
                  url: "/mobile/index.html",
                  templateUrl: "/web/mobile/index_content.html",
                  controller: "MobileHomeCtrl",
                  controllerAs: 'mhc',
              })
              .state('msearch', {
                  // url: "/mobile/search/:place/:loaiTin/:loaiNhaDat/:viewMode",
                  url: "/mobile/search/:placeId/:loaiTin/:loaiNhaDat/:viewMode",
                  templateUrl: "/web/mobile/search.html",
                  controller: "MobileSearchCtrl",
                  params:{query: null},
                  controllerAs: 'msc',
              }).state('mdetail', {
              url: "/mobile/detail/:adsID",
              templateUrl: "/web/mobile/detail.html",
              controller: "MobileDetailCtrl",
              controllerAs: 'mdt'
          }).state('mpost', {
              url: "/mobile/post/:adsID",
              templateUrl: "/web/mobile/post.html",
              controller: "MobilePostCtrl",
              controllerAs: 'mpc'
          }).state('madsMgmt', {
              url: "/mobile/adsMgmt/:loaiTin",
              templateUrl: "/web/mobile/adsMgmt.html",
              controller: "MobileAdsMgmtCtrl",
              controllerAs: 'mamc'
          }).state('mchats', {
              url: "/mobile/chats",
              templateUrl: "/web/mobile/chats.html",
              controller: "MobileChatCtrl",
              controllerAs: 'mcc'
          }).state('mchatDetail', {
              url: "/mobile/chatDetail/:adsID/:toUserID",
              templateUrl: "/web/mobile/chatDetail.html",
              controller: "MobileChatDetailCtrl",
              controllerAs: 'mcdc'
          }).state('mlistMore', {
              url: "/mobile/more",
              templateUrl: "/web/mobile/listMoreAds.html",
              controller: "MobileListAdsCtrl",
              controllerAs: 'mlm',
              params:{query: null},
          })
      })
  .run(['socket', '$timeout', 'jwtHelper','$rootScope','$localStorage', '$cookieStore','$http','$compile','HouseService', function(socket, $timeout, jwtHelper,$rootScope,$localStorage, $cookieStore, $http,$compile,HouseService){
    $rootScope.globals = $cookieStore.get('globals') || {};
    //$rootScope.center = "Hanoi Vietnam";
    // FastClick.attach(document.body);    
    $rootScope.center  = {
      lat: 16.0439,
      lng: 108.199
    }
    //alert($localStorage.relandToken);

    var decodedToken = {};
    $rootScope.loginbox = {};
    $rootScope.chatBoxes = [];
    $rootScope.menuitems = window.RewayListValue.menu;
    $rootScope.user = {
      userID: undefined,
      adsLikes: [],
      lastSearch: null,
      autoSearch: false
    }    
    $rootScope.pageSize = 25;
    $rootScope.act = "Quận Cầu Giấy, Hà Nội";
    $rootScope.bodyClass = "hfixed header bodySearchShow";

    if($localStorage.relandToken){
      decodedToken = jwtHelper.decodeToken($localStorage.relandToken);
      HouseService.profile({userID: decodedToken.userID}).then(function(res){
        //$rootScope.user.userID = decodedToken.userID;
        if(res.data.success == true)
          //Nhannc edit, Hung check lai
          //$rootScope.user = res.data.user;
          $rootScope.user.userName = res.data.user.name;
          $rootScope.user.userID = res.data.user.id;
          $rootScope.user.userAvatar = res.data.user.avatar;
          $rootScope.user.adsLikes = res.data.user.adsLikes;
          $rootScope.user.userEmail = res.data.user.email;
          $rootScope.user.phone = res.data.user.phone;
          //LastSearch may use in storega
          /*
          if($localStorage.lastSearch){
              $rootScope.user.lastSearch = $localStorage.lastSearch;
          }*/
          //Sugest autocomplete use lastSearch info of user  if it exist
          if(res.data.user.lastSearch && res.data.user.lastSearch.length > 0){
              $localStorage.searchHistory = res.data.user.lastSearch;
              $rootScope.user.lastSearch = res.data.user.lastSearch;
          }

          if(res.data.user.fullName)
              $rootScope.user.fullName = res.data.user.fullName;
          $rootScope.user.lastViewAds = res.data.user.lastViewAds;
          $rootScope.user.saveSearch = res.data.user.saveSearch;
          $rootScope.getUnreadMsgCount($rootScope.user.userID);
          socket.emit('alert user online',{email: $rootScope.user.userEmail, fromUserID:  $rootScope.user.userID, fromUserName : $rootScope.user.userName},function(data){
              console.log("alert user online " + $rootScope.user.userID);
          });
      });
    }

    

    // $rootScope.searchData = {
    //   giaBETWEEN: [0,9999999999999],
    //   "loaiTin": 0,
    //   "loaiNhaDat": 0, 
    //   "loaiNhaDats": [],
    //   "soPhongNguGREATER": 0,
    //   "soPhongTamGREATER": 0,
    //   "soTangGREATER": 0,
    //   "dienTichBETWEEN": [0,99999999999999],
    //   "huongNha": 0,
    //   "huongNhas": [],
    //   "radiusInKm": 2,
    //   "ngayDaDang": undefined,
    //   "userID": $rootScope.user.userID,
    //   //"geoBox": [  vm.map.getBounds().H.j,  vm.map.getBounds().j.j ,vm.map.getBounds().H.H, vm.map.getBounds().j.H],
    //   "limit": $rootScope.pageSize,
    //   "orderBy": 0,
    //   "pageNo": 1
    // }

    $rootScope.headerInfo = {
      act: "Quận Cầu Giấy, Hà Nội",
      listMoreFirstTitle: 'Hung',
      listMoreSecondTitle: 'Tim',      
    }    
    $rootScope.searchData = {
        "placeId": undefined,
        "loaiTin": 0,
        //"giaBETWEEN": [0, 999999999],
        //"dienTichBETWEEN" : [0, 99999999999],
        //"ngayDangTinGREATER" : "19810101",
        "viewport" : {
            "northeast": {
                "lat": 21.0594115,
                "lon": 105.8134889
            },
            "southwest": {
                "lat": 21.0009685,
                "lon": 105.7680415
            }
        },
        // "viewport" : {
        //   "northeast" : {
        //     "lat" : 21.385027,
        //     "lon" : 106.0198859
        //   },
        //   "southwest" : {
        //     "lat" : 20.562323,
        //     "lon" : 105.2854659
        //   }
        // },
        "diaChinh" : {
          "tinhKhongDau" : "HN",
          "huyenKhongDau" : "7",
          "fullName" : "Quận Cầu Giấy, Hà Nội"
        },
        // circle : {
        //   center : PointModel,
        //   radius : Joi.number()
        // },
        //server ordered by itself
        //"orderBy" : {"name": "ngayDangTin", "type":"ASC"},
        "limit" : 25,
        "pageNo" : 1,
        "isIncludeCountInResponse" : false,
        "updateLastSearch": true
      }
    //mobile login box controll

    $rootScope.ENTER_EMAIL = 1;
    $rootScope.ENTER_PASSWORD = 2;
    $rootScope.LOGGED_IN = 3;
    $rootScope.FORGOT_PASSWORD = 4;
    $rootScope.SENT_PASSWORD = 5;
    $rootScope.RESET_PASSWORD = 6;

    $rootScope.loginbox.state = $rootScope.ENTER_EMAIL;

    $rootScope.currentLocation = {
      lat: undefined,
      lon: undefined
    } 
    $rootScope.lastSearch = undefined;

    $rootScope.getUnreadMsgCount = function(userID){
      HouseService.getUnreadMessages({userID: userID}).then(function(res) {
          if (res.status == 200 && res.data.status == 0) {
              if (res.data.data.length > 0) {
                  $rootScope.unreadMsg = res.data.data.length;
              }
          }
          if(!$rootScope.unreadMsg)
              $rootScope.unreadMsg = null;
      });
    }
    $rootScope.getLastSearch = function(localStorage){
      if(localStorage && localStorage.lastSearch && localStorage.lastSearch.length>0){
        var clone = _.cloneDeep(localStorage.lastSearch[localStorage.lastSearch.length-1]);
        return clone;
      }
      return undefined
    }

    $rootScope.getSearchHistory = function(){
      if($localStorage && $localStorage.searchHistory){
        return $localStorage.searchHistory;
      }      
    }
    
    $rootScope.addLastSearch = function(localStorage, oLastSearch){
        console.log("---------------home-addLastSearch-------------------");
      var lastSearch = _.cloneDeep(oLastSearch);
      if(localStorage){
        if(!localStorage.lastSearch || localStorage.lastSearch.length==0){
          localStorage.lastSearch = [];
        }
        //Nhan: why remove at index=2?
        /*
        else if (localStorage.lastSearch.length==2){
            localStorage.lastSearch =  _(localStorage.lastSearch).slice(1,localStorage.lastSearch.length).value();                
        }*/
        localStorage.lastSearch.push(
          {
            time: new Date().toString('yyyyMMdd HH:mm:ss'),
            query: lastSearch
          }
        );

        if($rootScope.user && $rootScope.user.userID){
          if(!localStorage.searchHistory || localStorage.searchHistory.length==0){
              localStorage.searchHistory = [];
          }
          var searchHistory = _.cloneDeep(oLastSearch);

          $localStorage.searchHistory.push(
              {
                  time: new Date().toString('yyyyMMdd HH:mm:ss'),
                  query: searchHistory
              }
          );
        }
        

        $rootScope.$bus.publish({
            channel: 'search',
            topic: 'search',
            data: $rootScope.getLastSearch(localStorage)
        });
      }
    }

    $rootScope.signin = function(){

    }
    //end mobild login box controll

    $rootScope.alreadyLike = function(adsID){
      return _.indexOf($rootScope.user.adsLikes,adsID) >=0;
    } 

    // show notify
    $rootScope.showNotify = function(text, box, item, itemtext){
      if(item!==null || item != "") $(item).html(itemtext);
      if(text!==null || text != "") $(".notifyBox").html(text);
      if(box!==null || box != ""){
        $(box).fadeIn(100).delay(1800).slideUp(150);
      }
      else{
        $(".notifyBox").fadeIn(100).delay(900).slideUp(150);
      }
    }

    $rootScope.showDangNhapForLike = function(){
        
    }

    $rootScope.isLoggedIn = function(){

      if($rootScope.user.userID)
        return true;
      return false;
    }

    
    
      
    $rootScope.chat_visible = true;
    $rootScope.showChat = function(user,scope){
      if($rootScope.chatBoxes.hasOwnProperty(user.email)){
        
      }else{
        $rootScope.chatBoxes[user.email] = user;
        var divElement = angular.element(document.querySelector('#chat-container'));
        var appendHtml = $compile('<bds-chat visible="$root.chat_visible" useremail="email"></bds-chat>')(scope);
        divElement.append(appendHtml);
      }

      /*if(true || $rootScope.user.userName){
        $rootScope.chat_visible = true;
        $rootScope.chat_user = user;

      }
      else{
        alert(window.RewayConst.MSG.LOGIN_REQUIRED);
      }*/
    }
    $rootScope.closeChat = function(){
      $rootScope.chat_visible = false;
    }
    
    $rootScope.postPageRendered = function(){
      // alert('aaa');
      //window.DesignCommon.adjustPage();
    }

    $rootScope.suggestedSearch = [
      {
          description: "Vị trí hiện tại",
          types:      "1", 
          place_id:   "111",
          class: "iconLocation gray"
      }
    ];

    $rootScope.signout = function(){
        $rootScope.loginbox.resetLoginBox(); 
    }
    


    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
      //alert(toState.name);
      // if (toState.name === 'msearch') {
      //   if(toParams.viewMode == "list"){
      //     toState.templateUrl = '/web/mobile/list.html';  
      //   }else{
      //     toState.templateUrl = '/web/mobile/maps.html';
      //   }
      // }
      //else{
      //   if(!toState.templateUrl)ss
      //     toState.templateUrl = '/web/'+toState.name+'.html';
      //   //toState.templateUrl = '/web/marker.html';
      // }
      if(!toState.templateUrl)
          toState.templateUrl = '/web/'+toState.name+'.html';
        //if (toState.name === 'list') {
        //  alert(toState);
          
        //}

    });

    $rootScope.bodyScrollTop =0;

    $rootScope.removeDetailAds = function(){
      $rootScope.bodyClass = "hfixed header bodySearchShow";
      angular.element('#detailModal').hide();
      angular.element('#mainView').show();
      $('body').scrollTop($rootScope.bodyScrollTop);
      if($rootScope.detailAdsScope){
        $rootScope.detailAdsScope.$destroy();
        $('#detailModal').empty();
        $('#detailModal').show();
      }
    }
    $rootScope.showDetailAds = function(adsID,scope){
        $rootScope.bodyClass = "hfixed header";        
        $rootScope.bodyScrollTop = $('body').scrollTop();
        $rootScope.detailAdsScope = scope.$new();
        $rootScope.compiledDirective = $compile("<bds-detail ads-id='" + adsID+ "' on-remove-detail='$root.removeDetailAds'></bds-detail>")
        var directiveElement = $rootScope.compiledDirective($rootScope.detailAdsScope);
        angular.element('#detailModal').append(directiveElement);
        angular.element('#mainView').hide();
    }

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      console.log("changed to state " + toState) ;
      $rootScope.lastState = fromState;
      $rootScope.lastStateParams = fromParams;
      if(toState.name==='mdetail'){
        $rootScope.bodyClass = "hfixed header";
      }else{
        $rootScope.bodyClass = "hfixed header bodySearchShow";
      }      
    });

    $rootScope.getGoogleLocation = function(val) {
        return $http.get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            address: val,
            //language: 'en',
            key: 'AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU',
            //types: 'gecodes,cities,places',
            components: 'country:vn',
            sensor: false
          }
        }).then(function(response){
          /*return response.data.results.map(function(item){
            return item;
          });*/
          return response.data.results;
        });
        // return $http.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
        //   params: {
        //     input: val,
        //     language: 'en',
        //     key: 'AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU',
        //     //types: 'gecodes,cities',
        //     components: 'country:vn',
        //     sensor: false
        //   }
        // }).then(function(response){
        //   /*return response.data.results.map(function(item){
        //     return item;
        //   });*/
        //   return response.data.results;
        // });
      };
    $rootScope.getGoogleLocationById = function(val) {
        return $http.get('https://maps.googleapis.com/maps/api/place/details/json', {
          params: {
            placeid: val,
            // language: 'en',
            key: 'AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU'
            //types: 'gecodes,cities',
            // components: 'country:vn',
            // sensor: false
          }
        }).then(function(response){
          /*return response.data.results.map(function(item){
            return item;
          });*/
          return response.data.result;
        });
      };

      socket.on("new message", function(data) {
          console.log("----------------on new message-------------------");
          $rootScope.chatMsgData = data;
          $timeout(function() {
              if($rootScope.isLoggedIn()){
                  if(!$rootScope.unreadMsg)
                      $rootScope.unreadMsg = 1;
                  else
                      $rootScope.unreadMsg = $rootScope.unreadMsg + 1;
              }
          },100);
          $rootScope.$broadcast("newMessageChat");
      });

      socket.on("alert user online",function(data){
          console.log("-----------------alert user online----------------");
          $timeout(function() {
              if(!$rootScope.allOlineUser)
                  $rootScope.allOlineUser = [];
              var index = $rootScope.allOlineUser.indexOf(data.fromUserID.trim());
              if(index < 0){
                  $rootScope.allOlineUser.push(data.fromUserID.trim());
              }
              $rootScope.$broadcast("userOnOffline");
          },100);

      });

      socket.on("alert user offline",function(data){
          console.log("-----------------alert user offline----------------");
          $timeout(function() {
              if($rootScope.allOlineUser){
                  var index = $rootScope.allOlineUser.indexOf(data.fromUserID.trim());
                  if(index != -1){
                      $rootScope.allOlineUser.splice(index, 1);
                  }
                  $rootScope.$broadcast("userOnOffline");
              }
          },100);

      });

      socket.on("unread-messages", function(data){
          console.log("------------------chat-unreadMessage-----------------");
          $timeout(function() {
              $rootScope.unreadMsgs = [];
              for (var i = 0, len = data.length; i < len; i++) {
                  var msg = data[i].default;
                  $rootScope.unreadMsgs.push(data[i]);
              }
              $rootScope.$broadcast("unreadMsgs");
          },100)
      });
      $rootScope.$bus.subscribe({
          channel: 'user',
          topic: 'logged-in',
          callback: function(data, envelope) {
              //console.log('add new chat box', data, envelope);
              $rootScope.$broadcast("userLogin");
          }
      });

      $rootScope.$bus.subscribe({
          channel: 'login',
          topic: 'logged out',
          callback: function(data, envelope) {
              $rootScope.$broadcast("userLogout");
          }
      });
  }]);
  })();

  var hello = function (){
    alert('hello buddy! how are you today?');
  }
