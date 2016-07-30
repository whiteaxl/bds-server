(function() {
	'use strict';
	var controllerId = 'MobileDetailCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, $state, HouseService, NewsService, NgMap, $window,$timeout,$location){
		var vm = this;
		vm.adsID = $state.params.adsID;
		HouseService.detailAds({adsID: vm.adsID, userID: $rootScope.user.userID}).then(function(res){
			//console.log("res.data " + res.data.ads);
			$rootScope.user.lastViewAds = vm.adsID;
			vm.ads = res.data.ads;
			vm.ads.place.diaChinh.tinhKhongDau =  window.RewayUtil.locDau(vm.ads.place.diaChinh.tinh);
			vm.ads.place.diaChinh.huyenKhongDau =  window.RewayUtil.locDau(vm.ads.place.diaChinh.huyen);
			vm.placeSearchText = vm.ads.place.diaChinh.huyen + "," + vm.ads.place.diaChinh.tinh;
			// if($rootScope.alreadyLike(vm.ads.adsID) ==  true)
			// 	vm.likeAdsClass ="fa-heart";
			var price_min = 0;
			var price_max = window.RewayListValue.filter_max_value.value;
			var dien_tich_min = 0;
			var dien_tich_max = window.RewayListValue.filter_max_value.value;

		
			var pageSize = 8;

			vm.name ="";
			vm.phone="";
			vm.email="";
			vm.content = "Tôi muốn tìm hiểu thêm thông tin về bất động sản tại " + window.location.href + ", xin vui lòng liên hệ lại sớm.";
			vm.requestInfoClass = "btn-submit";
			vm.clearInfoRequest = function(){
				vm.name ="";
				vm.phone="";
				vm.email="";
				vm.content = "Tôi muốn tìm hiểu thêm thông tin về bất động sản tại " + window.location.href + ", xin vui lòng liên hệ lại sớm.";
			}
			if(vm.ads.place.diaChinh){
				HouseService.findDuAnHotByDiaChinhForDetailPage({diaChinh: vm.ads.place.diaChinh}).then(function(res){
					if(res.data.success==true)
						vm.listDuAnNoiBat = res.data.listDuAnNoiBat;
				});
			}
				

			vm.userLoggedIn = function(){
				vm.name = $rootScope.user.userName;
	                if($rootScope.user.phone)
						vm.phone = parseInt($rootScope.user.phone);
					vm.email = $rootScope.user.userEmail;
				if(vm.ads.dangBoi.userID == $rootScope.user.userID)
					vm.showLuotXem = true;
				if(vm.ads.dangBoi.email == $rootScope.user.userEmail)
					vm.showLuotXem = true;
			}
			
			$scope.$bus.subscribe({
            	channel: 'user',
	            topic: 'logged-in',
	            callback: function(data, envelope) {
	                //console.log('add new chat box', data, envelope);
	                vm.userLoggedIn();
	            }
	        });
	        if($rootScope.isLoggedIn()){	        	
	        	vm.userLoggedIn();
	        }

			vm.requestInfo = function(){
				if($('#form-info-request').valid()){
					vm.requestInfoClass = 'btn-submit-disabled';
					HouseService.requestInfo({
						name: vm.name,
						phone: vm.phone,
						email: vm.email,
						content: vm.content,
						adsUrl: window.location.href
					}).then(function(res){
						console.log(JSON.stringify(res.data));						
						vm.requestInfoClass = 'btn-submit';
						vm.clearInfoRequest();
					});
				}				
			}
			vm.requestInfoPopup = function(){
				if($('#form-info-request-popup').valid()){
					vm.requestInfoClass = 'btn-submit-disabled';
					HouseService.requestInfo({
						name: vm.name,
						phone: vm.phone,
						email: vm.email,
						content: vm.content,
						adsUrl: window.location.href
					}).then(function(res){
						console.log(JSON.stringify(res.data));
						vm.requestInfoClass = 'btn-submit';
						vm.clearInfoRequest();
					});
				}		
			}


			vm.goDetail = function(adsID){
        		$state.go('detail', { "adsID" : adsID}, {location: true});
        	}
		});
		
	});
})();
