(function() {
	'use strict';
	var controllerId = 'DetailCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope,$http, $scope,$state,HouseService,NgMap,$window){
		var vm = this;
		$scope.chat_visible = true;
		$scope.$on('$viewContentLoaded', function(){
			window.DesignCommon.adjustPage();
			if($state.current.data){
				$rootScope.bodyClass = "page-detail";
			}
		});	
		vm.showChat = function(user){
			$scope.$bus.publish({
              channel: 'chat',
              topic: 'new user',
              data: user
	        });
		};

		vm.adsID = $state.params.adsID;
		HouseService.detailAds({adsID: vm.adsID}).then(function(res){
			//console.log("res.data " + res.data.ads);
			vm.ads = res.data.ads;
			$scope.email = vm.ads.dangBoi.email;
		});

	});

})();