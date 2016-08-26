(function() {
	'use strict';
	var controllerId = 'MobileDetailCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, $state, HouseService, NewsService, NgMap, $window,$timeout,$location){
		var vm = this;
		vm.adsID = $state.params.adsID;
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
		HouseService.detailAds({adsID: vm.adsID, userID: $rootScope.user.userID}).then(function(res){
			//console.log("res.data " + res.data.ads);
			$rootScope.user.lastViewAds = vm.adsID;
			vm.ads = res.data.ads;
			vm.ads.chiTietThuGon = vm.ads.chiTiet;
			if(vm.ads.chiTiet.length > 30){
				vm.ads.chiTietThuGon = vm.ads.chiTiet.substring(0,300);				
			}
			vm.ads.place.diaChinh.tinhKhongDau =  window.RewayUtil.locDau(vm.ads.place.diaChinh.tinh);
			vm.ads.place.diaChinh.huyenKhongDau =  window.RewayUtil.locDau(vm.ads.place.diaChinh.huyen);
			vm.placeSearchText = vm.ads.place.diaChinh.huyen + "," + vm.ads.place.diaChinh.tinh;
			// if($rootScope.alreadyLike(vm.ads.adsID) ==  true)
			// 	vm.likeAdsClass ="fa-heart";
			var price_min = 0;
			var price_max = window.RewayListValue.filter_max_value.value;
			var dien_tich_min = 0;
			var dien_tich_max = window.RewayListValue.filter_max_value.value;
			vm.center = [vm.ads.place.geo.lat,vm.ads.place.geo.lon];
			vm.marker.content = vm.ads.giaFmt;
			vm.marker.coords.latitude = vm.ads.place.geo.lat;
			vm.marker.coords.longitude = vm.ads.place.geo.lon;

		
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
        		$state.go('mdetail', { "adsID" : adsID}, {location: true});
        	}
        	vm.goChats = function(){
        		$state.go('mchats', { "adsID" : vm.ads.adsID}, {location: true});
        	}
        	$timeout(function() {
				$("#phgantaichinh").drawDoughnutChart([
					{ title: "Gốc", value : 400,  color: "#20c063"},
					{ title: "Lãi", value:  100,   color: "#f0a401"}
			  	]);
			}, 10);

			var searchDataXungQuanh = {
				"loaiTin": vm.ads.loaiTin,
				"loaiNhaDat": 0, 
				"limit": 9,
				"soPhongNguGREATER": 0,
	  			"soPhongTamGREATER": 0,
	  			"soTangGREATER": 0,
				//"diaChinh": vm.ads.place.diaChinh,
				"place": {
 	      			//relandTypeName : window.RewayPlaceUtil.getTypeName(googlePlace),
       				radiusInKm :  2,
 				    currentLocation: {
 				    	lat: vm.ads.place.geo.lat,
 				    	lon: vm.ads.place.geo.lon
 				    }
				},
				"updateLastSearch": false,
			  	"orderBy": "ngayDangTinDESC",
			  	"pageNo": 1
			};

			HouseService.findAdsSpatial(searchDataXungQuanh).then(function(res){
				vm.nhaXungQuanh = res.data.list;					
			});

			var searchDataTuongTu = {
				"loaiTin": vm.ads.loaiTin,
				"loaiNhaDat": vm.ads.loaiNhaDat, 
				"limit": 9,
				"soPhongNguGREATER": 0,
	  			"soPhongTamGREATER": 0,
	  			"soTangGREATER": 0,
				"diaChinh": {
					tinh: vm.ads.place.diaChinh.tinhKhongDau,
					huyen: vm.ads.place.diaChinh.huyenKhongDau
				},
				"updateLastSearch": false,
			  	"orderBy": "ngayDangTinDESC",
			  	"pageNo": 1
			};

			HouseService.findAdsSpatial(searchDataTuongTu).then(function(res){
				vm.nhaTuongTu = res.data.list;					
			});


		});
		
	});
})();
