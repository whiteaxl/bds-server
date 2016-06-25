(function() {
	'use strict';
	var controllerId = 'ProfileCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope,$http, $scope,$state,HouseService,NgMap,$window,$timeout){
		var vm = this;
		vm.viewMap = false;
		$scope.chat_visible = true;
		$scope.$on('$viewContentLoaded', function(){
			$timeout(function() {
				window.DesignCommon.adjustPage();
			},0);
			if($state.current.data){
				$rootScope.bodyClass = "page-detail";
			}
		});	
		vm.init = function(){
			vm.userID = $state.params.userID;
			HouseService.profile({userID: vm.userID}).then(function(res){
				if(res.data.success == true){
					vm.user = res.data.user;	
				}				
			});
		}

		vm.init();
	});

})();