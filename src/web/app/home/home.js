(function() {
  'use strict';
  window.initData = {};
  var bds= angular.module('bds', ['ngCookies','ui.router','nemLogging','ngMap'])
  .run(['$rootScope', '$cookieStore','$http', function($rootScope, $cookieStore, $http){
    $rootScope.globals = $cookieStore.get('globals') || {};
    //$rootScope.center = "Hanoi Vietnam";
    $rootScope.center  = {
      lat: 16.0439,
      lng: 108.199
    }
    
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
      //alert(toState.name);
      if (toState.name === 'home') {
        toState.templateUrl = '/web/index_content.html';
      }else{
        if(!toState.templateUrl)
          toState.templateUrl = '/web/'+toState.name+'.html';
        //toState.templateUrl = '/web/marker.html';
      }
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
  bds.config(function($stateProvider, $urlRouterProvider,$locationProvider,$interpolateProvider){
      // For any unmatched url, send to /route1
      $locationProvider.html5Mode(true);
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
      .state('search', {
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
