(function () {
    'use strict';
    angular
        .module('bds')
        .factory('HouseService', HouseService);
    /* @ngInject */
    function HouseService($http, $q, $rootScope) {
      var urlPath = '/api/houses/find';
      var service = {};
      service.findHouse = findHouse;
      service.createHouse = createHouse;
      return service;

      function findHouse(){
      	return $http.get(urlPath);
      }
      function createHouse(desc,email,seller){
        return $http.post(urlPath + 'create'); 
      }
    }

})();
