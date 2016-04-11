(function () {
    'use strict';
    angular
        .module('bds')
        .factory('HouseService', HouseService);
    /* @ngInject */
    function HouseService($http, $q, $rootScope) {
      var urlPath = '/api/ads/getAllAds';
      var service = {};
      service.getAllAds = getAllAds;
      service.createHouse = createHouse;
      return service;

      function getAllAds(){
        console.log("Get all Ads");
      	//return $http.get(urlPath);
        var deferred = $q.defer()
        deferred.resolve({data: [{a:"a",b: "b"}]});
        return deferred.promise;
      }
      function createHouse(desc,email,seller){
        return $http.post(urlPath + 'create'); 
      }
    }

})();
