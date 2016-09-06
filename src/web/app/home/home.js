(function() {
  'use strict';
  window.initData = {};
  
  var postal = require("postal.js");
    
  var tap = postal.addWireTap( function( d, e ) {
    console.log( JSON.stringify( e ) );
  });


  var bds= angular.module('bds', ['ngCookies','ui.router','nemLogging','ngMap','ngMessages','ngStorage','ngFileUpload','btford.socket-io','angular-jwt','infinite-scroll'])
  .run(['$rootScope', '$cookieStore','$http','$compile', function($rootScope, $cookieStore, $http,$compile,$sce){
    $rootScope.globals = $cookieStore.get('globals') || {};
    //$rootScope.center = "Hanoi Vietnam";
    $rootScope.center  = {
      lat: 16.0439,
      lng: 108.199
    }

    $rootScope.loginbox = {};
    $rootScope.chatBoxes = [];
    $rootScope.menuitems = window.RewayListValue.menu;
    $rootScope.user = {
      userID: null,
      adsLikes: [],
      lastSearch: null
    }    
    $rootScope.pageSize = 25;

    $rootScope.searchData = {
      giaBETWEEN: [0,9999999999999],
      "loaiTin": 0,
      "loaiNhaDat": 0, 
      "loaiNhaDats": [],
      "soPhongNguGREATER": 0,
      "soPhongTamGREATER": 0,
      "soTangGREATER": 0,
      "dienTichBETWEEN": [0,99999999999999],
      "huongNha": 0,
      "huongNhas": [],
      "radiusInKm": 2,
      "ngayDaDang": undefined,
      "userID": $rootScope.user.userID,
      //"geoBox": [  vm.map.getBounds().H.j,  vm.map.getBounds().j.j ,vm.map.getBounds().H.H, vm.map.getBounds().j.H],
      "limit": $rootScope.pageSize,
      "orderBy": 0,
      "pageNo": 1
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

    $rootScope.signin = function(){

    }
    //end mobild login box controll

    $rootScope.alreadyLike = function(adsID){
      return _.indexOf($rootScope.user.adsLikes,adsID) >=0;
    } 

    $rootScope.showDangNhapForLike = function(){
        
    }

    $rootScope.isLoggedIn = function(){
      if($rootScope.user.userID)
        return true;
      return false;
    }

    $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
      $rootScope.lastState = from;
      $rootScope.lastStateParams = fromParams;
    });
    
      
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



    $rootScope.signout = function(){
        $rootScope.loginbox.resetLoginBox(); 
    }
    $rootScope.bodyClass = "page-home";


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
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      console.log("changed to state " + toState) ;
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

  }]);
  bds.config(function($provide,$stateProvider, $urlRouterProvider,$locationProvider,$interpolateProvider,$httpProvider){
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
        url: "/mobile/search/:place/:loaiTin/:loaiNhaDat/:viewMode",
        templateUrl: "/web/mobile/search.html",
        controller: "MobileSearchCtrl",
        params:{query: null},
        controllerAs: 'msc',
      }).state('mdetail', {
        url: "/mobile/detail/:adsID",
        templateUrl: "/web/mobile/detail.html",
        controller: "MobileDetailCtrl",
        controllerAs: 'mdt'
      }).state('mchats', {
        url: "/mobile/chats/:adsID",
        templateUrl: "/web/mobile/chats.html",
        controller: "MobileChatCtrl",
        controllerAs: 'mcc'
      })
    });
  bds.factory('socket', function (socketFactory) {
    // var socket = io.connect("http://localhost:5000");
    var socket = io.connect();
    //socket.forward('error');
    // socket.connect();
    return socket;
  });
  })();



  var hello = function (){
    alert('hello buddy! how are you today?');
  }
