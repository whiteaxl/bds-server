(function() {
	'use strict';

	var controllerId = 'MobileAdsMgmtCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, Upload, $state, HouseService, NewsService, RewayCommonUtil, NgMap, $window,$timeout,$location,$localStorage){
		var vm = this;

		vm.init = function(){

		}

		$timeout(function() {
			vm.init();
		},300);
	});
})();
