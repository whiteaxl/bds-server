(function() {
	'use strict';
	var controllerId = 'SearchCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope,$http, $scope,$state,HouseService,NgMap,$window,$timeout){
		var vm = this;
		vm.soPhongNguList = window.RewayListValue.getNameValueArray(window.RewayListValue.SoPhongNgu);
		vm.soPhongTamList = window.RewayListValue.getNameValueArray(window.RewayListValue.SoPhongTam);
		vm.soTangList = window.RewayListValue.getNameValueArray(window.RewayListValue.SoTang);
		vm.huongNhaList = window.RewayListValue.getNameValueArray(window.RewayListValue.HuongNha);
		vm.radiusInKmList = window.RewayListValue.getNameValueArray(window.RewayListValue.RadiusInKm);

		//use for menu
		vm.loaiNhaDatBanMenu = window.RewayListValue.LoaiNhaDatBanWeb;
		vm.loaiNhaDatThueMenu = window.RewayListValue.LoaiNhaDatThueWeb;
		vm.loaiNhaDatCanMuaMenu = window.RewayListValue.LoaiNhaDatCanMuaWeb;
		vm.loaiNhaDatCanThueMenu = window.RewayListValue.LoaiNhaDatCanThueWeb;
		vm.loaiTinTuc = window.RewayListValue.LoaiTinTuc;
		vm.onePoint = false;

		
		
		$scope.center = "Hanoi Vietnam";
		$scope.placeId = $state.params.place;
		$scope.loaiTin = $state.params.loaiTin;
		$scope.loaiNhaDat = $state.params.loaiNhaDat;
		vm.diaChinh = {
			tinh: $state.params.tinh,
			tinhKhongDau: $state.params.tinh,
			huyen: $state.params.huyen,
			huyenKhongDau: $state.params.huyen,
			xa: $state.params.xa,
			xaKhongDau: $state.params.xa,
		}
		vm.packageID = $state.params.packageID;
		vm.viewMode = $state.params.viewMode;
		if(!vm.viewMode)
			vm.viewMode = "map";

		if(!$scope.placeId)
			$scope.placeId = 'ChIJoRyG2ZurNTERqRfKcnt_iOc';
		if(!$scope.loaiTin)
			$scope.loaiTin = 0;
		if(!$scope.loaiNhaDat)
			$scope.loaiNhaDat = 0;
		vm.loaiTin = $scope.loaiTin;

		vm.stateName = $state.current.name;

		
		console.log("placeId: " + $scope.placeId);
		console.log("loaiTin: " + $scope.loaiTin);
		console.log("loaiNhaDat: " + $scope.loaiNhaDat);
		console.log("placeId: " + $scope.placeId);
		
		vm.viewTemplateUrl = "search.tpl.html";//1=map 2= list

		if($state.params.viewMode=="list"){
			vm.viewTemplateUrl = "list.tpl.html";
		}else if($state.params.viewMode=="map"){
			vm.viewTemplateUrl = "search.tpl.html"
		}
		vm.showList = function(){
			vm.viewTemplateUrl = "list.tpl.html"
			vm.viewMode = "list";
			$scope.bodyClass = "page-list";

		}

		vm.goPackage = function(packageID){
			$state.go('package', { "packageID" : packageID, "viewMode": vm.viewMode}, {location: true});
		}

		// vm.likeAds = function(index){
	 //      if(!$rootScope.user.userID){
	 //        alert("Đăng nhập để like");
	 //        return;
	 //      }
	 //      HouseService.likeAds({adsID: vm.ads_list[index].adsID,userID: $rootScope.user.userID}).then(function(res){
	 //        alert(res.data.msg);
	 //        console.log(res);
	 //      });
	 //    };
	    vm.likeAdsClass ="like";
		vm.likeAds = function(index,adsID){
	      if(!$rootScope.user.userID){
	        $scope.$bus.publish({
              channel: 'login',
              topic: 'show login',
              data: {label: "Đăng nhập để lưu BĐS"}
	        });
	        return;
	      }
	      HouseService.likeAds({adsID: vm.ads_list[index].adsID,userID: $rootScope.user.userID}).then(function(res){
	        //alert(res.data.msg);
	        //console.log(res);
	        if(res.data.success == true || res.data.status==1){
	        	vm.ads_list[index].liked =true;
	        }
	      });
	    };
		vm.gotoDiachinh = function(diachinh,type){
			/*if(type==1){
				vm.diaChinh.huyen = null;
				vm.diaChinh.xa = null;
			}else if(type==2){
				vm.diaChinh.xa = null;
			}
			//alert(diachinh +" " + type);

			
			vm.searchData = {
				"loaiTin": $scope.loaiTin,
				"loaiNhaDat": $scope.loaiNhaDat, 
				"loaiNhaDats": [],
			  	"giaBETWEEN": [vm.price_min,vm.price_max],
			  	"soPhongNguGREATER": vm.soPhongNguList[0].value,
			  	"soPhongTamGREATER": vm.soPhongTamList[0].value,
			  	"soTangGREATER": vm.soTangList[0].value,
			  	"dienTichBETWEEN": [0,vm.dien_tich_max],
			  	"huongNha": vm.huongNhaList[0].value,
			  	"huongNhas": [],
			  	//"geoBox": [  vm.map.getBounds().H.j,  vm.map.getBounds().j.j ,vm.map.getBounds().H.H, vm.map.getBounds().j.H],
			  	"limit": vm.pageSize,
			  	"orderBy": vm.sortOptions[0].value,
			  	diaChinh: vm.diaChinh,
			  	"pageNo": 1
			};


			//vm.searchData.geoBox = undefined;
			vm.search();*/
			if(type==1){
				vm.diaChinh.huyen = null;
				vm.diaChinh.xa = null;
			}else if(type==2){
				vm.diaChinh.xa = null;
			}

			$state.go('searchdc', { "tinh" : vm.diaChinh.tinh, "huyen" : vm.diaChinh.huyen,"xa" : vm.diaChinh.xa,"loaiTin" : $scope.loaiTin, "loaiNhaDat" : $scope.loaiNhaDat, "viewMode": vm.viewMode}, {location: true});
		}
		vm.showMap = function(){
			vm.viewTemplateUrl = "search.tpl.html"
			vm.viewMode = "map";
			$scope.bodyClass = "page-search";
		}
		vm.blankName = false;
		vm.saveSearch = function(){

			if(!vm.saveSearchName){
				vm.blankName = true;
				return;
			}

			
			if(!$rootScope.user.userID){
				$scope.$bus.publish({
	              channel: 'login',
	              topic: 'show login',
	              data: {label: "Đăng nhập để lưu tìm kiếm"}
		        });
		        return;
			}
			var data = {
				query: vm.searchData,
				userID: $rootScope.user.userID,
				saveSearchName: vm.saveSearchName
			};

			HouseService.saveSearch(data).then(function(res){				
				//alert(res.data.msg);
				if(res.data.success){
					vm.blankName = false;
					vm.saveSearchName = '';					
					vm.nameSaveSearch = false;
				}
			})
		}

		
			
		//vm.sell_price_list_from = window.RewayListValue.sell_steps;
		vm.sell_price_list_from = [
			{
		        value: 0,
		        lable: "Giá từ 0",
		        position: 0
		    },
		];
		Array.prototype.push.apply(vm.sell_price_list_from, window.RewayListValue.sell_steps);

		vm.radius_steps = [{
			value: 2,
			lable: "Bán kính 2km",
			position: 0
		}];
		Array.prototype.push.apply(vm.radius_steps, vm.radiusInKmList);
		

		vm.sell_price_list_to = [];
		Array.prototype.push.apply(vm.sell_price_list_to, window.RewayListValue.sell_steps);
		vm.sell_price_list_to.push(
			{
		        value: window.RewayListValue.filter_max_value.value,
		        lable: window.RewayListValue.filter_max_value.lable,
		        position: vm.sell_price_list_to.length
		    }
		);
		vm.sell_dien_tich_list_from = [
			{
		        value: 0,
		        lable: "Diện tích từ 0",
		        position: 0
		    },
		];
		Array.prototype.push.apply(vm.sell_dien_tich_list_from, window.RewayListValue.dientich_steps);
		vm.sell_dien_tich_list_to = [];
		Array.prototype.push.apply(vm.sell_dien_tich_list_to, window.RewayListValue.dientich_steps);
		vm.sell_dien_tich_list_to.push(
			{
		        value: window.RewayListValue.filter_max_value.value,
		        lable: window.RewayListValue.filter_max_value.lable,
		        position: vm.sell_price_list_to.length
		    }
		);
		
		
		 


		vm.sortOptions = window.RewayListValue.sortHouseOptions;
		vm.sortBy = vm.sortOptions[0].value;
		vm.price_min = 0;
		vm.price_max = window.RewayListValue.filter_max_value.value;
		vm.dien_tich_min = 0;
		vm.dien_tich_max = window.RewayListValue.filter_max_value.value;
		vm.zoomMode = "auto";

		vm.totalResultCounts = 0;
		vm.currentPage = 0;
		vm.lastPageNo = 0;
		vm.startPageNo = 0;
		vm.pageSize = 20;

		vm.searchData = {
			"loaiTin": $scope.loaiTin,
			"loaiNhaDat": $scope.loaiNhaDat, 
			"loaiNhaDats": [],
		  	"giaBETWEEN": [vm.price_min,vm.price_max],
		  	"soPhongNguGREATER": vm.soPhongNguList[0].value,
		  	"soPhongTamGREATER": vm.soPhongTamList[0].value,
		  	"soTangGREATER": vm.soTangList[0].value,
		  	"dienTichBETWEEN": [0,vm.dien_tich_max],
		  	"huongNha": vm.huongNhaList[0].value,
		  	"huongNhas": [],
		  	"radiusInKm": 2,
		  	"userID": $rootScope.user.userID,
		  	//"geoBox": [  vm.map.getBounds().H.j,  vm.map.getBounds().j.j ,vm.map.getBounds().H.H, vm.map.getBounds().j.H],
		  	"limit": vm.pageSize,
		  	"orderBy": vm.sortOptions[0].value,
		  	"pageNo": 1
		}

		

		vm.mouseover = function(e,i) {
          vm.showDetail(i);
        };
        vm.goDetail = function(event,i){
        	$state.go('detail', { "adsID" : vm.ads_list[i].adsID}, {location: true});
        }
        vm.goDetailHighlight = function(){
        	$state.go('detail', { "adsID" : vm.highlightAds.adsID}, {location: true});
        }
        vm.mouseout = function() {
          //vm.hideDetail();
        };
        vm.click = function(e,i) {
        	console.log('click');
    	};

        vm.showDetail = function(i) {
		    vm.highlightAds = vm.ads_list[i];
		    if(vm.ads_list[i].place){
    			if(vm.ads_list[i].place.geo){
    				vm.map.showInfoWindow("iw","m_" +i);
    			}
    		}
		};


		vm.hideDetail = function() {
			vm.map.hideInfoWindow('iw');
		};
		// window.DesignCommon.adjustPage();
		$scope.$on('$viewContentLoaded', function(){
			$timeout(function() {
				window.DesignCommon.adjustPage();
			},0);
			if($state.params){
				//$scope.bodyClass = $state.current.data.bodyClass;
				$rootScope.bodyClass = "page-search";
				if($state.params.viewMode=="list"){
					$rootScope.bodyClass = "page-list";
				} 
			}
		});
		vm.selectPlaceCallback = function(place){
			$scope.searchPlaceSelected = place;
    		$scope.placeSearchId = place.place_id;
    		/*$scope.markers = [];
    		var marker = {
    				id: -1,
    				coords: {latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng()},
    				content: 'you are here'
    		}
    		if(place.geometry.viewport){
    			vm.searchData.geoBox = [  place.geometry.viewport.H.j,  place.geometry.viewport.j.j ,place.geometry.viewport.H.H, vm.map.getBounds().j.H];
    			vm.searchData.geoBox = [place.geometry.viewport.getSouthWest().lat(),place.geometry.viewport.getSouthWest().lng(),place.geometry.viewport.getNorthEast().lat(),place.geometry.viewport.getNorthEast().lng()]
				vm.searchData.radiusInKm = undefined;

			}else{
				var placeData = {
			    			placeId: place.place_id,
			 	    		relandTypeName : window.RewayPlaceUtil.getTypeName(place),
			       			radiusInKm :  1,
			 				currentLocation: undefined
			 	}
			 	vm.searchData.place = placeData;
			    vm.searchData.geoBox = undefined;
			}*/
    		$scope.center = "[" + place.geometry.location.lat() + ", " + place.geometry.location.lng() + "]";
    		
    		/*$scope.markers.push(marker);
    		$scope.$apply();

    		if(place.geometry.viewport){
				vm.map.fitBounds(place.geometry.viewport);	
				//$scope.map
			}

    		//$scope.map.fit = false;
    		
    		vm.map.setCenter(place.geometry.location);*/
    		// $scope.$apply();
    		//$scope.map.refresh();
    		vm.goToPageSearch();
    		//vm.search();
		}

		vm.showStreetView = function(event){
			vm.map.getStreetView().setPosition(vm.highlightAds.streetviewLatLng);
			vm.map.getStreetView().setVisible(true);
			event.stopPropagation();
			//return false;

		}

		$scope.goToPageNews = function(loaiTinTuc){
			console.log("--goToPageNews---loaiTinTuc: " + loaiTinTuc);
			$state.go('news');
		}

		vm.goToPageSearch = function(){
			$state.go('search', { "place" : $scope.placeSearchId, "loaiTin" : $scope.loaiTin, "loaiNhaDat" : $scope.loaiNhaDat, "viewMode": vm.viewMode}, {location: true});
			//vm.search();
		}

		vm.goToPageSearchMenu = function(loaiTin, loaiNhaDat){
			vm.searchData.loaiTin = loaiTin;
			vm.searchData.loaiNhaDat = loaiNhaDat;
			vm.search();
		}
  		
		vm.firstPage = function(callback){
			vm.searchPage(1);
		}
		vm.nextPage = function(callback){
			vm.searchPage(vm.currentPage+1);
		}
		vm.lastPage = function(callback){
			vm.searchPage(vm.lastPageNo);
		}
		vm.previousPage = function(callback){
			vm.searchPage(vm.currentPage-1);
		}
		vm.updateStreetview = function(ads,fn){
			var STREETVIEW_MAX_DISTANCE = 100;
			var latLng = new google.maps.LatLng(ads.place.geo.lat, ads.place.geo.lon);
			var streetViewService = new google.maps.StreetViewService();
	        streetViewService.getPanoramaByLocation(latLng, STREETVIEW_MAX_DISTANCE, function(streetViewPanoramaData, status,res) {
	        	if (status === google.maps.StreetViewStatus.OK) {
					ads.streetviewLatLng = streetViewPanoramaData.location.latLng;
				}
			});
			
		}
		vm.searchPage = function(i, callback){
			vm.searchData.pageNo = i;		
			if(vm.searchData.place)
				vm.searchData.place.radiusInKm = vm.searchData.radiusInKm;	
			vm.searchData.userID = $rootScope.user.userID;
			HouseService.findAdsSpatial(vm.searchData).then(function(res){
				var result = res.data.list;
				//vm.totalResultCounts = res.data.list.length;
				
				for (var i = 0; i < result.length; i++) { 
		    		var ads = result[i];
		    		if($rootScope.alreadyLike(ads.adsID) ==  true)
						ads.liked =true;
			        var length = result.length;
			        var fn = function() {
			            if(i < length) {
			                vm.updateStreetview(result[i], fn);
			            }
			        };
				    fn();

		    		result[i].index = i;
		    		if(ads.huongNha){
		    			ads.huongNha =  window.RewayListValue.getHuongNhaDisplay(ads.huongNha);
		    		}else{
		    			ads.huongNha = "";	
		    		}
		    		if(result[i].place){
		    			if(result[i].place.geo){
			    			result[i].map={
			    				center: {
									latitude: 	result[i].place.geo.lat,
									longitude: 	result[i].place.geo.lon
								},
			    				marker: {
									id: i,
									coords: {
										latitude: 	result[i].place.geo.lat,
										longitude: 	result[i].place.geo.lon
									},
									content: result[i].giaFmt,
									data: 'test'
								},
								options:{
									scrollwheel: false
								},
								zoom: 14	
			    			}
			    					
						}
		    		}
		    		
				}
				vm.ads_list = res.data.list;
				$scope.markers = [];
				for(var i = 0; i < res.data.list.length; i++) { 
		    		var ads = res.data.list[i];
		    		if(res.data.list[i].map)
		    			$scope.markers.push(res.data.list[i].map.marker);
				}
				/*if(vm.ads_list.length==0){
					vm.zoomMode = "false";
				}else{
					vm.zoomMode = "auto";
				}*/

				vm.currentPageStart = vm.pageSize*(vm.searchData.pageNo-1) + 1
				vm.currentPageEnd = vm.currentPageStart + res.data.list.length -1;
				vm.currentPage = vm.searchData.pageNo;
				
				$timeout(function() {
					$('body').scrollTop(0);
				},0);
				

				if(callback)
					callback();
			});
		}

		vm.search = function(callback){
			if(vm.searchData.place)
				vm.searchData.place.radiusInKm = vm.searchData.radiusInKm;
			vm.searchData.userID = $rootScope.user.userID;
			HouseService.countAds(vm.searchData).then(function(res){
        		vm.totalResultCounts = res.data.countResult;
        		$scope.markers =[];
        		vm.ads_list = [];
        		if(vm.totalResultCounts>0){
        			vm.currentPage = 1;
        			vm.lastPageNo = Math.ceil(vm.totalResultCounts/vm.pageSize);
        			vm.currentPageStart = 1;
        			vm.currentPageEnd = (vm.totalResultCounts >= vm.pageSize?vm.pageSize-1: vm.totalResultCounts-1);

        		} else{
        			vm.currentPage = 0;
					vm.lastPageNo = 0;
					vm.startPageNo = 0;
        		}
        		vm.searchPage(1,callback);

        	});

		}
		vm.formatLabel = function(model){
			if(model)
				return model.formatted_address;
		}
		
		var events = {
          places_changed: function (searchBox) {}
        }
        $scope.searchbox = { template:'searchbox.tpl.html', events:events};
        


        NgMap.getMap().then(function(map){
        	// $scope.map = {center: {latitude: 16.0439, longitude: 108.199 }, zoom: 10 , control: {},fit: true};
        	vm.map = map;
        	google.maps.event.addListener(map, "dragend", function() {
				vm.searchData.geoBox = [vm.map.getBounds().getSouthWest().lat(),vm.map.getBounds().getSouthWest().lng(), vm.map.getBounds().getNorthEast().lat(),vm.map.getBounds().getNorthEast().lng()];
				$scope.center = "["+vm.map.getCenter().lat() +"," +vm.map.getCenter().lng() +"]";
	          	vm.search();
	        });

        	window.RewayClientUtils.createPlaceAutoComplete(vm.selectPlaceCallback,"autocomplete",map);
        	$scope.PlacesService =  new google.maps.places.PlacesService(map);
        	if(vm.stateName == "package"){
        		//TODO implement later wih packageID in Ads
        		vm.searchData = {
					"loaiTin": $scope.loaiTin,
					"loaiNhaDat": $scope.loaiNhaDat, 
					"loaiNhaDats": [],
				  	"giaBETWEEN": [vm.price_min,vm.price_max],
				  	"soPhongNguGREATER": vm.soPhongNguList[0].value,
				  	"soPhongTamGREATER": vm.soPhongTamList[0].value,
				  	"soTangGREATER": vm.soTangList[0].value,
				  	"dienTichBETWEEN": [0,vm.dien_tich_max],
				  	"huongNha": vm.huongNhaList[0].value,
				  	"huongNhas": [],
				  	"userID": $rootScope.user.userID,
				  	//"geoBox": [  vm.map.getBounds().H.j,  vm.map.getBounds().j.j ,vm.map.getBounds().H.H, vm.map.getBounds().j.H],
				  	"limit": vm.pageSize,
				  	"orderBy": vm.sortOptions[0].value,
				  	diaChinh: vm.diaChinh,
				  	"pageNo": 1
				};
				vm.searchData.diaChinh = vm.diaChinh;
				vm.search();
        	}else if(vm.stateName == "searchdc"){
        		vm.searchData = {
					"loaiTin": $scope.loaiTin,
					"loaiNhaDat": $scope.loaiNhaDat, 
					"loaiNhaDats": [],
				  	"giaBETWEEN": [vm.price_min,vm.price_max],
				  	"soPhongNguGREATER": vm.soPhongNguList[0].value,
				  	"soPhongTamGREATER": vm.soPhongTamList[0].value,
				  	"soTangGREATER": vm.soTangList[0].value,
				  	"dienTichBETWEEN": [0,vm.dien_tich_max],
				  	"huongNha": vm.huongNhaList[0].value,
				  	"huongNhas": [],
				  	"userID": $rootScope.user.userID,
				  	//"geoBox": [  vm.map.getBounds().H.j,  vm.map.getBounds().j.j ,vm.map.getBounds().H.H, vm.map.getBounds().j.H],
				  	"limit": vm.pageSize,
				  	"orderBy": vm.sortOptions[0].value,
				  	diaChinh: vm.diaChinh,
				  	"pageNo": 1
				};
				vm.searchData.diaChinh = vm.diaChinh;
				vm.search();
        	}else if(vm.stateName=="search"){
        		$scope.PlacesService.getDetails({
					placeId: $scope.placeId
				}, function(place, status) {
					if (status === google.maps.places.PlacesServiceStatus.OK) {
						$scope.searchPlaceSelected = place;
		        		//var map = $scope.map.control.getGMap();
		        		
		        		/*$scope.markers = [
							{
												id: 0,
												coords: {
													latitude: 	place.geometry.location.lat(),
													longitude: 	place.geometry.location.lng()
												},
												content: 'you are here'
											}
						];*/
						var googlePlace = $scope.searchPlaceSelected;
						vm.diaChinh = window.RewayPlaceUtil.getDiaChinhFromGooglePlace(googlePlace);
						vm.diaChinh.tinhKhongDau = vm.diaChinh.tinh;
						vm.diaChinh.huyenKhongDau = vm.diaChinh.huyen;
						vm.diaChinh.xaKhongDau = vm.diaChinh.xa;

						vm.placeSearchText = googlePlace.formatted_address;

						

						vm.onePoint = window.RewayPlaceUtil.isOnePoint(googlePlace);

						// if($scope.searchPlaceSelected.geometry.viewport){
						if(vm.onePoint == false){
			          		console.log("Tim ads for Tinh Huyen Xa: " + googlePlace.formatted_address);
			          		vm.searchData.geoBox = [googlePlace.geometry.viewport.getSouthWest().lat(),googlePlace.geometry.viewport.getSouthWest().lng(),googlePlace.geometry.viewport.getNorthEast().lat(),googlePlace.geometry.viewport.getNorthEast().lng()]
			          		//vm.searchData.radiusInKm = undefined;
			        	} else{
			          		console.log("Tim ads for dia diem: " + googlePlace.formatted_address);
			          		//data.radiusInKm = "10";
			          		var placeData = {
			          			placeId: googlePlace.place_id,
			 	      			relandTypeName : window.RewayPlaceUtil.getTypeName(googlePlace),
			       				radiusInKm :  vm.searchData.radiusInKm,
			 				    currentLocation: undefined
			 			  	}
			 			  	vm.searchData.place = placeData;
			          		vm.searchData.geoBox = undefined;
			        	}
			        	
						vm.search(function(){
							vm.zoomMode = "auto";
							var current_bounds = map.getBounds();
			        		//$scope.map.center =  
			        		vm.map.setCenter(place.geometry.location);
			        		//$scope.center = "["+place.geometry.location.lat() +"," +place.geometry.location.lng() +"]";
			        		if(place.geometry.viewport){
			        			map.fitBounds(place.geometry.viewport);	
			        			//$scope.map
			        		} else if( !current_bounds.contains( place.geometry.location ) ){
			        			//var new_bounds = current_bounds.extend(place.geometry.location);
			        			//map.fitBounds(new_bounds);
			        			//$digest();
			        		}
						});
						
						//vm.map.refresh();
						//$scope.$apply();	
		        	}
		        });
        	}
			
			
        });
        init();

		function init(){
			
			// $scope.map = {center: {latitude: 16.0439, longitude: 108.199 }, zoom: 10 , control: {},fit: true};
			//$rootScope.center = "Hanoi Vietnam";
			vm.provinces = [
				{
					value: "Hanoi",
					lable: "Hà Nội"
				},
				{
					value: "Da nang",
					lable: "Đà Nãng"

				}
			];

			vm.districts = [
				{
					value: "Cau Giay",
					lable: "Cầu Giấy"
				},
				{
					value: "Dong Da",
					lable: "Đống Đa"

				}
			];

			vm.loaiNhaDatList = []
			if(vm.loaiTin == 0){
				vm.loaiNhaDatList = window.RewayListValue.getNameValueArray(window.RewayListValue.LoaiNhaDatBan);	
			}else{
				vm.loaiNhaDatList = window.RewayListValue.getNameValueArray(window.RewayListValue.LoaiNhaDatThue);
			}
			
			
			vm.moreFilter = {
				loaiNhaDat: vm.loaiNhaDatList.slice(),
				huongNha: vm.huongNhaList.slice(),
				soPhongNgu: vm.soPhongNguList[0].value,
				soPhongTam: vm.soPhongTamList[0].value,
				soTang: vm.soTangList[0].value
			}
			vm.moreFilter.loaiNhaDat[0].selected = true;
			vm.moreFilter.huongNha[0].selected = true;
			vm.changeFilterLoaiNhaDat = function(k){
				var newvalue = vm.moreFilter.loaiNhaDat[k].selected;
				if(k==0){
					if(newvalue==true){
						for(var i =1; i< vm.moreFilter.loaiNhaDat.length;i++){
							vm.moreFilter.loaiNhaDat[i].selected = false;
						}
					}
				}else{
					if(newvalue==true)
						vm.moreFilter.loaiNhaDat[0].selected = false;	
				}
				
			}
			vm.changeFilterHuongNha = function(k){
				var newvalue = vm.moreFilter.huongNha[k].selected;
				if(k==0){
					if(newvalue==true){
						for(var i =1; i< vm.moreFilter.huongNha.length;i++){
							vm.moreFilter.huongNha[i].selected = false;
						}
					}
				}else{
					if(newvalue==true)
						vm.moreFilter.huongNha[0].selected = false;	
				}
			}

			vm.filter = function(){
				// vm.searchData.giaBETWEEN[vm.moreFilter.priceFrom, vm.moreFilter.priceTo];
				vm.searchData.soPhongNguGREATER=vm.moreFilter.soPhongNgu;
				vm.searchData.soTangGREATER=vm.moreFilter.soTang;
				vm.searchData.soPhongTamGREATER=vm.moreFilter.soPhongTam;
				vm.searchData.loaiNhaDat = [];
				vm.searchData.huongNha = [];
				for(var i = 0; i< vm.moreFilter.loaiNhaDat.length;i++){
					if(vm.moreFilter.loaiNhaDat[i].selected == true){
						vm.searchData.loaiNhaDat.push(vm.moreFilter.loaiNhaDat[i].value);
					}
				}
				for(var i = 0; i< vm.moreFilter.huongNha.length;i++){
					if(vm.moreFilter.huongNha[i].selected == true){
						vm.searchData.huongNha.push(vm.moreFilter.huongNha[i].value);
					}
				}
				// vm.searchData.loaiNhaDat=vm.moreFilter.loaiNhaDat;
				$("a[data-action='more']").click();
				//$('filter').trigger("click");
				vm.search(function(){
					vm.searchData.soPhongNguGREATER=undefined;
					vm.searchData.soTangGREATER=undefined;
					vm.searchData.soPhongNguGREATER=undefined;
					vm.searchData.soPhongTamGREATER=undefined;
					vm.searchData.huongNha=undefined;
					vm.searchData.loaiNhaDat = vm.loaiNhaDatList[0].value;
				});
			}



			$scope.options = {scrollwheel: false,labelContent: 'gia'};
			$scope.markerCount = 3;
			/*$scope.markers = [
				{
									id: 0,
									coords: {
										latitude: 	16.0439,
										longitude: 	108.199
									},
									content: 'you are here'
								}
			];*/
			//$scope.initData = window.initData;
			//$scope.hot_ads_cat = window.hot_ads_cat;
			//vm.ads_list = window.testData;
			$scope.bodyClass= "page-home";

			if(vm.viewMode == "list"){

			}


		}
		

	});

})();