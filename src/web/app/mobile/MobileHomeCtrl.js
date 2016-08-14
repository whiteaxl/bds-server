(function() {
	'use strict';
	var controllerId = 'MobileHomeCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, $state, HouseService, NewsService, NgMap, $window,$timeout,$location){
		var vm = this;
		var query = { loaiTin: 0,
		   //giaBETWEEN: [ 0, 9999999 ],
		   soPhongNguGREATER: '0',
		   soTangGREATER: '0',
		   soPhongTamGREATER: '0',
		   dienTichBETWEEN: [ 0, 9999999 ],
		   place:
		   { placeId: 'ChIJKQqAE44ANTERDbkQYkF-mAI',
		   relandTypeName: 'Tỉnh',
		   fullName: 'Hanoi',
		   radiusInKm: 20 },
		   limit: 200,
		   polygon: []
	   	}
	   	var homeDataSearch = {
          timeModified: undefined,
          query: query,
          currentLocation : undefined
        }
        if($rootScope.lastSearch)
        	homeDataSearch.query = $rootScope.lastSearch;
        vm.getLocation = function() {
		    if (navigator.geolocation) {
		        navigator.geolocation.getCurrentPosition(function(position){
		        	$rootScope.currentLocation.lat = position.coords.latitude;
		        	$rootScope.currentLocation.lon = position.coords.longitude;
		        	homeDataSearch.currentLocation = $rootScope.currentLocation;
		        	HouseService.homeDataForApp(homeDataSearch).then(function(res){
						//alert(JSON.stringify(res));
						vm.boSuuTap = res.data.data; 
					});
		        });
		    } else {
		        //x.innerHTML = "Geolocation is not supported by this browser.";
		        HouseService.homeDataForApp(homeDataSearch).then(function(res){
					//alert(JSON.stringify(res));
					vm.boSuuTap = res.data.data; 
				});
		    }
		}
		vm.goDetail = function(ads){
			$state.go('mdetail', { "adsID" : ads.adsID}, {location: true});
		}
		vm.likeAds = function(event,adsID){
		  event.stopPropagation();
	      if(!$rootScope.user.userID){
	        $scope.$bus.publish({
              channel: 'login',
              topic: 'show login',
              data: {label: "Đăng nhập để lưu BĐS"}
	        });

	        return;
	      }
	      HouseService.likeAds({adsID: adsID,userID: $rootScope.user.userID}).then(function(res){
	        //alert(res.data.msg);
	        //console.log(res);
	        if(res.data.success == true || res.data.status==1){
	        	$rootScope.user.adsLikes.push(adsID);
	        	//vm.likeAdsClass ="fa-heart";
	        }
	      });
	    };
		vm.showMore = function(index){
			var query =  {};
			Object.assign( query,vm.boSuuTap[index].query);
			query.limit = 20;
			query.duAnID = vm.boSuuTap[index].query.duAnID;
			$state.go('msearch',{place: query.place.placeId || query.place.place_id,loaiTin: query.loaiTin, loaiNhaDat:query.loaiNhaDat,viewMode: "list", query: query})			
			//$state.go('msearch', { "place" : $scope.placeSearchId, "loaiTin" : $scope.loaiTin, "loaiNhaDat" : $scope.loaiNhaDat, "viewMode": vm.viewMode}, {location: true});
			//alert('showmore');
		}
		

		vm.init = function(){
			vm.getLocation();
			if($rootScope.currentLocation){
				if($rootScope.lastSearch){
					var queryNearBy = {}; 
					Object.assign(queryNearBy, vm.query);
					// window.RewayServiceUtil.getDiaChinhKhongDauByGeocode($rootScope.currentLocation.lat
					// 	, $rootScope.currentLocation.lon).then(function(diaChinh){
    	// 				alert(diaChinh);
    	// 			});
					// queryNearBy.place
				}else{

				}

			}else{
				if($rootScope.lastSearch){

				}

			}
		}
		vm.init();

		
	});
})();