(function() {
    'use strict';

    angular.module('bds', ['ngCookies'])
		.run(['$rootScope', '$cookieStore', function($rootScope, $cookieStore){

		        $rootScope.globals = $cookieStore.get('globals') || {};

		}]);
})();

hello = function (){
  alert('hello buddy! how are you today?');
}
