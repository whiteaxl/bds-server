(function() {
	'use strict';
	var controllerId = 'MainCtrl';
	angular.module('bds').controller(controllerId,MainCtrl);

	/* @ngInject */
	function MainCtrl($rootScope, $scope,HouseService) {
		var vm = this;
		init();
		vm.getAllAds = function(){
			HouseService.getAllAds().then(function(res){
				vm.sellingHouses = res.data;
			});
		}
		vm.createHouse = function(desc,seller,email){
			HouseService.createHouse(desc,seller,email).then(function(res){
				//vm.sellingHouses = res.data;
				alert(res.data);
			});
			//alert("done");

		}
		vm.detailHouse = function(){
			alert('todo');
		}
		function init(){
		}
	}
})();
