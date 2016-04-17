(function() {
  'use strict';
  window.initData = {};
  var bds= angular.module('bds', ['ngCookies','ui.router','nemLogging','uiGmapgoogle-maps','ui.bootstrap'])
  .run(['$rootScope', '$cookieStore','$http', function($rootScope, $cookieStore, $http){
    $rootScope.globals = $cookieStore.get('globals') || {};
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
      //alert(toState.name);
      if (toState.name === 'home') {
        toState.templateUrl = '/web/index_content.html';
      }else{
        toState.templateUrl = '/web/'+toState.name+'.html';
      }
        //if (toState.name === 'list') {
        //  alert(toState);
          
        //}
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      console.log("changed to state " + toState) ;
    });

    $rootScope.getGoogleLocation = function(val) {
        return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
          params: {
            address: val,
            language: 'en',
            //key: 'AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU',
            //types: 'gecodes,cities',
            components: 'country:vn',
            sensor: false
          }
        }).then(function(response){
          /*return response.data.results.map(function(item){
            return item;
          });*/
          return response.data.results;
        });
      };


  }]);
  bds.config(function($stateProvider, $urlRouterProvider,$locationProvider){
      // For any unmatched url, send to /route1
      $locationProvider.html5Mode(true);
      //$urlRouterProvider.otherwise("/web/list.html")
      //alert('sss');
      $stateProvider
      .state('list', {
        url: "/list",
        //templateUrl: '/web/list.html',
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
        url: "/search",
        //templateUrl: "/web/searchContent.html",
        controller: "SearchCtrl",
        controllerAs: 'mc',
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
        //templateUrl: "/web/index_content.html",
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
