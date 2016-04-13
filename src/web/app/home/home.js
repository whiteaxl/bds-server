(function() {
  'use strict';
  var bds= angular.module('bds', ['ngCookies','ui.router','nemLogging','uiGmapgoogle-maps'])
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
          sellingHouses: function(HouseService) {
            //alert(HouseService);
            return HouseService.getAllAds().then(function(data){
              return data.data;
            });
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
          sellingHouses: function(HouseService) {
            //alert(HouseService);
            return HouseService.getAllAds().then(function(data){
              return data.data;
            });
          }
        },
        data: {
            bodyClass: "page-search"
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
          sellingHouses: function(HouseService) {
            //alert(HouseService);
            return HouseService.getAllAds().then(function(data){
              return data.data;
            });
          }
        },
        data: {
            bodyClass: "page-home"
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
