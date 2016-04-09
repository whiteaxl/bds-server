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
      	return $http.get(urlPath);
      }
      function createHouse(desc,email,seller){
        return $http.post(urlPath + 'create'); 
      }
    }

})();
