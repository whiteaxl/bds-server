(function() {
	'use strict';
	var controllerId = 'MainCtrl';
	angular.module('bds').controller(controllerId,MainCtrl);

	/* @ngInject */
	function MainCtrl($rootScope, $scope,HouseService) {
		var vm = this;
		init();
		$scope.map = {center: {latitude: 51.219053, longitude: 4.404418 }, zoom: 14 };
        $scope.options = {scrollwheel: false};
        alert($scope.map.center['latitude']);
		vm.findHouse = function(){
			HouseService.findHouse().then(function(res){
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
