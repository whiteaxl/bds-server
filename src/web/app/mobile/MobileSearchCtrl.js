(function() {
	'use strict';
	var controllerId = 'MobileSearchCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, $state, HouseService, NewsService, NgMap, $window,$timeout,$location){
		var vm = this;
		// vm.soPhongNguList = window.RewayListValue.getNameValueArray(window.RewayListValue.SoPhongNgu);
		// vm.soPhongTamList = window.RewayListValue.getNameValueArray(window.RewayListValue.SoPhongTam);
		// vm.soTangList = window.RewayListValue.getNameValueArray(window.RewayListValue.SoTang);
		// vm.huongNhaList = window.RewayListValue.getNameValueArray(window.RewayListValue.HuongNha);
		// vm.radiusInKmList = window.RewayListValue.getNameValueArray(window.RewayListValue.RadiusInKm);
		// vm.sortOptions = window.RewayListValue.sortHouseOptions;
		// vm.sortBy = vm.sortOptions[0].value;
		// vm.price_min = 0;
		// vm.price_max = window.RewayListValue.filter_max_value.value;
		// vm.dien_tich_min = 0;
		// vm.dien_tich_max = window.RewayListValue.filter_max_value.value;
		// vm.zoomMode = "auto";
		vm.ads_list = [{},{},{},{},{}];
		$scope.center = "Hanoi Vietnam";
		vm.zoomMode = "auto";
		vm.placeId = $state.params.place;
		vm.loaiTin = $state.params.loaiTin;
		vm.loaiNhaDat = $state.params.loaiNhaDat;
		vm.viewMode = $state.params.viewMode;
		if($state.params.query)
			$rootScope.searchData = $state.params.query;
		vm.initMap = true;
		vm.page = 1;
		vm.initialized = false;
		
		vm.showList = function(){
			vm.viewMode = "list";
			// vm.map.refresh();
		}
		vm.showMap = function(){
			vm.viewMode = "map";			
		}
		vm.sort = function(sortBy){
			$rootScope.searchData.orderBy = sortBy;
			vm.search();
		}

		vm.mapInitialized = function(map){
			//vm.initialized = true;

		}

		/*vm.searchData = {
			"loaiTin": vm.loaiTin,
			"loaiNhaDat": vm.loaiNhaDat, 
			"loaiNhaDats": [],
		  	"giaBETWEEN": [vm.price_min,vm.price_max],
		  	"khoangGia": vm.khoangGia, 
		  	"khoangDienTich": vm.khoangDienTich,
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
		}*/
		vm.goDetail = function(event,i){
        	$state.go('mdetail', { "adsID" : vm.ads_list[i].adsID}, {location: true});
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
        vm.disableScrolling = true;
        vm.page =1;
        vm.nextPage =function(){        	
        	vm.disableScrolling = true;
        	vm.initialized = false;   
        	//alert('aaaa');
        	vm.page = vm.page+1;
        	$rootScope.searchData.pageNo = vm.page;       
            if($rootScope.searchData.place)
                $rootScope.searchData.place.radiusInKm = $rootScope.searchData.radiusInKm;  
            $rootScope.searchData.userID = $rootScope.user.userID;
            HouseService.findAdsSpatial($rootScope.searchData).then(function(res){
                var result = res.data.list;
                for (var i = 0; i < result.length; i++) { 
                    var ads = result[i];
                    ads.giaFmt = ads.giaFmtForWeb;

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
                                    latitude:   result[i].place.geo.lat,
                                    longitude:  result[i].place.geo.lon
                                },
                                marker: {
                                    id: i,
                                    coords: {
                                        latitude:   result[i].place.geo.lat,
                                        longitude:  result[i].place.geo.lon
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
                vm.ads_list = vm.ads_list.concat(res.data.list);
                // $scope.markers = [];
                for(var i = 0; i < res.data.list.length; i++) { 
                    var ads = res.data.list[i];
                    if(res.data.list[i].map)
                        $scope.markers.push(res.data.list[i].map.marker);
                }       
                vm.disableScrolling = false;
            });
        }
		vm.searchPage = function(i, callback){
            $rootScope.searchData.pageNo = i;       
            if($rootScope.searchData.place)
                $rootScope.searchData.place.radiusInKm = $rootScope.searchData.radiusInKm;  
            $rootScope.searchData.userID = $rootScope.user.userID;
            //$rootScope.searchData.dienTichBETWEEN[0] = $rootScope.searchData.khoangDienTich.value.min;
            //$rootScope.searchData.dienTichBETWEEN[1] = $rootScope.searchData.khoangDienTich.value.max;
            vm.initialized = false;   
            // vm.khoangGiaList[]
            // $rootScope.searchData.khoangGia
            HouseService.findAdsSpatial($rootScope.searchData).then(function(res){
                var result = res.data.list;
                //vm.totalResultCounts = res.data.list.length;
                
                for (var i = 0; i < result.length; i++) { 
                    var ads = result[i];
                    ads.giaFmt = ads.giaFmtForWeb;

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
                                    latitude:   result[i].place.geo.lat,
                                    longitude:  result[i].place.geo.lon
                                },
                                marker: {
                                    id: i,
                                    coords: {
                                        latitude:   result[i].place.geo.lat,
                                        longitude:  result[i].place.geo.lon
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

                vm.currentPageStart = vm.pageSize*($rootScope.searchData.pageNo-1) + 1
                vm.currentPageEnd = vm.currentPageStart + res.data.list.length -1;
                vm.currentPage = $rootScope.searchData.pageNo;
                
                $timeout(function() {
                    $('body').scrollTop(0);
                    vm.initialized = true;  
                },0);
                
                if($rootScope.isLoggedIn()){
                    $rootScope.user.lastSearch = $rootScope.searchData;
                }
                
                if(vm.ads_list && vm.ads_list.length>0){                    
                    if(vm.diaChinh)
                        HouseService.findDuAnHotByDiaChinhForSearchPage({diaChinh: vm.diaChinh}).then(function(res){
                            if(res.data.success==true)
                                vm.duAnNoiBat = res.data.duAnNoiBat;
                        });
                }
                vm.disableScrolling = false; 
                 
                if(callback)
                    callback.call(this);
            });
        }

		vm.search = function(callback){
            var googlePlace = $rootScope.searchData.place;
            vm.diaChinh = window.RewayPlaceUtil.getDiaChinhFromGooglePlace(vm.place);
            vm.diaChinh.tinhKhongDau = vm.diaChinh.tinh;
            vm.diaChinh.huyenKhongDau = vm.diaChinh.huyen;
            vm.diaChinh.xaKhongDau = vm.diaChinh.xa;

            vm.placeSearchText = googlePlace.formatted_address;

            vm.onePoint = window.RewayPlaceUtil.isOnePoint(googlePlace);

            // if($scope.searchPlaceSelected.geometry.viewport){
            if(vm.onePoint == false){
                console.log("Tim ads for Tinh Huyen Xa: " + googlePlace.formatted_address);
                $rootScope.searchData.geoBox = [googlePlace.geometry.viewport.getSouthWest().lat(),googlePlace.geometry.viewport.getSouthWest().lng(),googlePlace.geometry.viewport.getNorthEast().lat(),googlePlace.geometry.viewport.getNorthEast().lng()]
                //$rootScope.searchData.radiusInKm = undefined;
            } else{
                console.log("Tim ads for dia diem: " + googlePlace.formatted_address);
                //data.radiusInKm = "10";
                var placeData = {
                    placeId: googlePlace.place_id,
                    relandTypeName : window.RewayPlaceUtil.getTypeName(googlePlace),
                    radiusInKm :  $rootScope.searchData.radiusInKm,
                    currentLocation: undefined
                }
                $rootScope.searchData.place = placeData;
                $rootScope.searchData.geoBox = undefined;
            }
            $rootScope.searchData.userID = $rootScope.user.userID;
            if($rootScope.searchData.place.geometry)
            	vm.map.fitBounds($rootScope.searchData.place.geometry.viewport);
            else{
            	//vm.zoomMode = "auto";
            	// vm.map.setCenter($scope.center,10);
            }
            $rootScope.lastSearch = $rootScope.searchData;

            HouseService.countAds($rootScope.searchData).then(function(res){
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
            // vm.searchPage(1,null);
        }

        //vm.search();

        NgMap.getMap('searchmap').then(function(map){
        	vm.map = map; 
        	    	
            google.maps.event.addListener(map, "dragend", function() {
            	//alert(vm.map.getBounds());
				$rootScope.searchData.geoBox = [vm.map.getBounds().getSouthWest().lat(),vm.map.getBounds().getSouthWest().lng(),vm.map.getBounds().getNorthEast().lat(),vm.map.getBounds().getNorthEast().lng()];
				//alert($rootScope.searchData.geoBox);
				$scope.center = "["+vm.map.getCenter().lat() +"," +vm.map.getCenter().lng() +"]";
				vm.marker = {
					id: -1,
					coords: {latitude: vm.map.getCenter().lat(), longitude: vm.map.getCenter().lng()},
					content: 'you are here'
				};
				// $scope.$apply();
	          	vm.search();
	   			//alert('dragend');
	   			//alert($rootScope.searchData.geoBox);
	        });

	        google.maps.event.addListener(map, "zoom_changed", function() {	        	
	        	//$rootScope.searchData.geoBox = [vm.map.getBounds().getSouthWest().lat(),vm.map.getBounds().getSouthWest().lng(), vm.map.getBounds().getNorthEast().lat(),vm.map.getBounds().getNorthEast().lng()];
				//$scope.center = "["+vm.map.getCenter().lat() +"," +vm.map.getCenter().lng() +"]";
				// vm.marker = {
				// 	id: -1,
				// 	coords: {latitude: vm.map.getCenter().lat(), longitude: vm.map.getCenter().lng()},
				// 	content: 'you are here'
				// };
				// $scope.$apply();
	          	//vm.search();
	   			//alert('zoom_changed');
	   			//alert($rootScope.searchData.geoBox);
	   			if(vm.initialized == true){
	   				vm.initialized = false;
	   				$rootScope.searchData.geoBox = [vm.map.getBounds().getSouthWest().lat(),vm.map.getBounds().getSouthWest().lng(), vm.map.getBounds().getNorthEast().lat(),vm.map.getBounds().getNorthEast().lng()];
					$scope.center = "["+vm.map.getCenter().lat() +"," +vm.map.getCenter().lng() +"]";
					vm.marker = {
						id: -1,
						coords: {latitude: vm.map.getCenter().lat(), longitude: vm.map.getCenter().lng()},
						content: 'you are here'
					};
	   				vm.search(function(){
	   					$timeout(function() {
	   						vm.initialized = true;
	   					}, 10);
	   					
	   				});
	   				// alert('human zoom');
	   			}
	        });


	        
            // window.RewayClientUtils.createPlaceAutoComplete(vm.selectPlaceCallback,"searchadd",map);
            vm.PlacesService =  new google.maps.places.PlacesService(map);
            if(vm.placeId){
                vm.PlacesService.getDetails({
                    placeId: vm.placeId
                }, function(place, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                    	vm.place = place;
                        $rootScope.searchData.place = place;
                        //var map = $scope.map.control.getGMap();
                        var current_bounds = map.getBounds();
                        //$scope.map.center =  
                        $scope.center = "["+place.geometry.location.lat() +"," +place.geometry.location.lng() +"]";
                        if(place.geometry.viewport){
                            //map.fitBounds(place.geometry.viewport);   
                            //$scope.map
                        } else if( !current_bounds.contains( place.geometry.location ) ){
                            //var new_bounds = current_bounds.extend(place.geometry.location);
                            //map.fitBounds(new_bounds);
                            //$digest();
                        }
                        vm.marker = {
							id: -1,
							coords: {latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng()},
							content: 'you are here'
						};
                        $scope.$apply();
                        vm.search(function(){
                        	if(vm.viewMode=="list"){
                        		vm.initMap = false;
                        	}
                        });
                    }
                });
            }            
        });

		
	});
})();
