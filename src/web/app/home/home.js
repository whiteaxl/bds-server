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
      .state('route1', {
        url: "/list.html",
        templateUrl: '/web/list1.html',
        controller: "MainCtrl",
        resolve: {
          sellingHouses: function(HouseService) {
            //alert(HouseService);
            return HouseService.getAllAds().then(function(data){
              return data.data;
            });
          }
        }
        ,
        controller: function($scope,sellingHouses){
          $scope.sellingHouses = sellingHouses;
          alert(sellingHouses.length);
        }
      }).state('search', {
        url: "/search.html",
        templateUrl: "/web/search1.html",
        controller: "MainCtrl",
        resolve: {
          sellingHouses: function(HouseService) {
            //alert(HouseService);
            return HouseService.getAllAds().then(function(data){
              return data.data;
            });
          }
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
