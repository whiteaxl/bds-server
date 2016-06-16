(function() {
	'use strict';
	var controllerId = 'DetailCtrl';
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

		vm.marker = {
			id: 1,
			coords: {
				latitude: 	16.0439,
				longitude: 	108.199
			},
			content: undefined,
			data: 'test'
		}
		vm.center= [21.0363818591319,105.80105538518103];

		vm.diaChinh=  {};
		

		vm.goToPageSearch = function(){
			if(vm.placeSearchId){
				$state.go('search', { "place" : vm.placeSearchId, "loaiTin" : vm.ads.loaiTin, "loaiNhaDat" : vm.ads.loaiNhaDat }, {location: true});	
			}else{
				$state.go('searchdc', { "tinh" : vm.ads.place.diaChinh.tinhKhongDau, "huyen" : vm.ads.place.diaChinh.huyenKhongDau,"loaiTin" : vm.ads.loaiTin, "loaiNhaDat" : vm.ads.loaiNhaDat, "viewMode": "map"}, {location: true});	
			}
			
			
		}

		vm.showChat = function(user){
			if(!$rootScope.userID){
				alert("Đăng nhập để chat");
				return;
			}
			$scope.$bus.publish({
              channel: 'chat',
              topic: 'new user',
              data: {userID: user.userID,name: user.name,ads: {adsID:vm.ads.adsID, title: vm.ads.title, cover: vm.ads.image.cover}}
	        });
		};
		vm.likeAds = function(adsID){
	      if(!$rootScope.userID){
	        alert("Đăng nhập để like");
	        return;
	      }
	      HouseService.likeAds({adsID: vm.adsID,userID: $rootScope.userID}).then(function(res){
	        alert(res.data.msg);
	        console.log(res);
	      });
	    };
		$timeout(function() {
			$('body').scrollTop(0);
		},0);
		vm.adsID = $state.params.adsID;
		HouseService.detailAds({adsID: vm.adsID}).then(function(res){
			//console.log("res.data " + res.data.ads);
			vm.ads = res.data.ads;
			vm.marker.coords.latitude = vm.ads.place.geo.lat;
			vm.marker.coords.longitude = vm.ads.place.geo.lon;
			vm.center = [vm.ads.place.geo.lat,vm.ads.place.geo.lon];
			vm.marker.content = vm.ads.giaFmt;
			// vm.diaChinh = vm.ads.place.diaChinh;
			$scope.email = vm.ads.dangBoi.email;
			vm.placeSearchText = vm.ads.place.diaChinh.huyen + "," + vm.ads.place.diaChinh.tinh;
			// vm.diaChinh = {
			// 	tinh:vm.ads.place.diaChinh.tinh,
			// 	tinhKhongDau: vm.ads.place.diaChinh.tinhKhongDau,
			// 	huyen: vm.ads.place.diaChinh.huyen,
			// 	huyenKhongDau: vm.ads.place.diaChinh.huyenKhongDau,
			// 	xa: vm.ads.place.diaChinh.xa,
			// 	xaKhongDau: vm.ads.place.diaChinh.xaKhongDau
			// }				

			var price_min = 0;
			var price_max = window.RewayListValue.filter_max_value.value;
			var dien_tich_min = 0;
			var dien_tich_max = window.RewayListValue.filter_max_value.value;
		
			var pageSize = 8;

			vm.goDetail = function(adsID){
        		$state.go('detail', { "adsID" : adsID}, {location: true});
        	}
        	//find bds cung loai moi dang
			var searchDataCungLoai = {
				"loaiTin": vm.ads.loaiTin,
				"loaiNhaDat": vm.ads.loaiNhaDat, 
				"diaChinh": {
					tinh: vm.ads.place.diaChinh.tinhKhongDau,
					huyen: vm.ads.place.diaChinh.huyenKhongDau
				},
				"limit": pageSize,
			  	"orderBy": "ngayDangTinDESC",
			  	"pageNo": 1
			};
			
			HouseService.findAdsSpatial(searchDataCungLoai).then(function(res){
				vm.bdsCungLoaiMoiDang = [];
				for(var i=0;i<res.data.length;i++){
					if(res.data.list[i].adsID == vm.ads.adsID){

					}else if(vm.bdsCungLoaiMoiDang.length<7){
						vm.bdsCungLoaiMoiDang.push(res.data.list[i]);
					}
				}
				
			});
			//find bds ngang gia
			var searchDataNgangGia  ={
				"loaiTin": vm.ads.loaiTin,
				"diaChinh": {
					tinh: vm.ads.place.diaChinh.tinhKhongDau,
					huyen: vm.ads.place.diaChinh.huyenKhongDau
				},
				"limit": pageSize,
				"orderBy": "ngayDangTinDESC",
				"giaBETWEEN": [vm.ads.gia-0.1*vm.ads.gia,vm.ads.gia+0.1*vm.ads.gia],
			  	"pageNo": 1
			}
			
			HouseService.findAdsSpatial(searchDataNgangGia).then(function(res){
				vm.bdsNgangGia = [];
				for(var i=0;i<res.data.length;i++){
					if(res.data.list[i].adsID == vm.ads.adsID){

					}else if(vm.bdsNgangGia.length<7){
						vm.bdsNgangGia.push(res.data.list[i]);
					}
				}
				
			});
			//find bds gia nho hon
			var searchDataGiaNhoHon  ={
				"loaiTin": vm.ads.loaiTin,
				"diaChinh": {
					tinh: vm.ads.place.diaChinh.tinhKhongDau,
					huyen: vm.ads.place.diaChinh.huyenKhongDau
				},
				"limit": pageSize,
				"orderBy": "ngayDangTinDESC",
				"giaBETWEEN": [0,vm.ads.gia],
			  	"pageNo": 1
			}
			HouseService.findAdsSpatial(searchDataGiaNhoHon).then(function(res){
				vm.bdsNgangNhoHon = [];
				for(var i=0;i<res.data.length;i++){
					if(res.data.list[i].adsID == vm.ads.adsID){

					}else if(vm.bdsNgangNhoHon.length<7){
						vm.bdsNgangNhoHon.push(res.data.list[i]);
					}
				}
				
			});


		});
		vm.selectPlaceCallback = function(place){
			vm.searchPlaceSelected = place;
			vm.placeSearchId = place.place_id;
			vm.goToPageSearch();
		}


		vm.init = function(){
			NgMap.getMap().then(function(map){
	        	// $scope.map = {center: {latitude: 16.0439, longitude: 108.199 }, zoom: 10 , control: {},fit: true};
	        	window.RewayClientUtils.createPlaceAutoComplete(vm.selectPlaceCallback,"autoComplete",map);
	        	$scope.PlacesService =  new google.maps.places.PlacesService(map);
	        	/*$scope.PlacesService.getDetails({
	        		placeId: $scope.placeId
	        	}, function(place, status) {
	        		if (status === google.maps.places.PlacesServiceStatus.OK) {
	        			$scope.searchPlaceSelected = place;
			        		//var map = $scope.map.control.getGMap();
			        		var current_bounds = map.getBounds();
			        		//$scope.map.center =  
			        		vm.center = "["+place.geometry.location.lat() +"," +place.geometry.location.lng() +"]";
			        		if(place.geometry.viewport){
			        			//map.fitBounds(place.geometry.viewport);	
			        			//$scope.map
			        		} else if( !current_bounds.contains( place.geometry.location ) ){
			        			//var new_bounds = current_bounds.extend(place.geometry.location);
			        			//map.fitBounds(new_bounds);
			        			//$digest();
			        		}
			        		$scope.$apply();
			        		//vm.search();
		        	}
		        });*/

        	});
		}

		vm.init();



	});

})();