(function() {
  'use strict';
  window.initData = {};
  var bds= angular.module('bds', ['ngCookies','ui.router','nemLogging','uiGmapgoogle-maps','ui.bootstrap'])
  .run(['$rootScope', '$cookieStore', function($rootScope, $cookieStore){
    $rootScope.globals = $cookieStore.get('globals') || {};
  }]);
  bds.config(function($stateProvider, $urlRouterProvider,$locationProvider){
      // For any unmatched url, send to /route1
      $locationProvider.html5Mode(true);
      //$urlRouterProvider.otherwise("/web/list.html")
      //alert('sss');
      $stateProvider
      .state('list', {
        url: "/list.html",
        templateUrl: '/web/list.html',
        controller: "MainCtrl",
        resolve: {
          title: function(HouseService) {
            //alert(HouseService);
            return [{'a':'a'}];
          }
        },
        data: {
            bodyClass: "page-list"
        } 
      }).state('search', {
        url: "/search.html",
        templateUrl: "/web/search.html",
        controller: "MainCtrl",
        resolve: {
          title: function(HouseService) {
            var result = HouseService.getAllAds();
            result.then(function(data){
              window.initData = data.data;
            }); 
            return result;
          }
        },
        data: {
            bodyClass: "page-search",
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
            //abc: title
        }
        // ,
        // controller: function($scope, adsList){
        //   $scope.sellingHouses = adsList;
        //   alert(adsList.length);
        // }
      })
    });

  })();

  hello = function (){
    alert('hello buddy! how are you today?');
  }
