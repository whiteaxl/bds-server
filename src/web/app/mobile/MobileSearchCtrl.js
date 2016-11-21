(function() {
	'use strict';
	var controllerId = 'MobileSearchCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, $state, HouseService, NewsService, NgMap, $window,$timeout,$location,$localStorage){
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
        vm.pageSize = 25;
        vm.resetResultList = function(){
            vm.currentPage = 0;
            vm.lastPageNo = 0;
            vm.startPageNo = 0;
            vm.ads_list = [];
            vm.viewport = undefined;
            $scope.markers = [];        
            //$scope.$apply();
        }

         vm.getLocation = function() {     
            if(vm.poly)
                vm.poly.setMap(null);            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position){
                    $rootScope.searchData.circle = {
                      center : {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                      },
                      radius : 2
                    };
                    vm.initialized = false

                    vm.disableIdleHandler();
                    $rootScope.searchData.viewport = undefined;
                    $rootScope.searchData.diaChinh = undefined;
                    $rootScope.searchData.polygon = undefined;
                    $rootScope.currentLocation.lat = position.coords.latitude;
                    $rootScope.currentLocation.lon = position.coords.longitude;
                    $scope.center = "[" +position.coords.latitude + "," + position.coords.longitude+"]";
                    vm.marker = position;
                    // homeDataSearch.currentLocation = $rootScope.currentLocation;
           //       HouseService.homeDataForApp(homeDataSearch).then(function(res){
                    //  //alert(JSON.stringify(res));
                    //  vm.boSuuTap = res.data.data; 
                    // });
                    // fetchHomeData();                    
                    vm.resetResultList();
                    //vm.map.setCenter($scope.center);
                    vm.search(function(){
                        //vm.initialized = true;

                        $timeout(function() {
                            vm.initialized = true;
                            //vm.map.fitBounds(bounds);
                            vm.humanZoom = false;
                            vm.enableMapIdleHandler();
                        }, 0);
                    });
                }, function(error){
                    console.log(error);                 
                    // vm.showAskCurrentLocation  = true;
                    // fetchHomeData();
                });
            } else {
                // fetchHomeData();
            }
        }
		
		vm.init = function(){
            vm.ads_list = [];
            $scope.center = "Danang";
            vm.zoomMode = "false";
            vm.loaiTin = $state.params.loaiTin;
            vm.loaiNhaDat = $state.params.loaiNhaDat;
            vm.viewMode = $state.params.viewMode;
            // vm.diaChinh ={};
            // vm.diaChinh.tinhKhongDau = $state.params.tinh;
            // vm.diaChinh.huyenKhongDau = $state.params.huyen;
            // vm.diaChinh.xaDau = $state.params.xa;
            vm.placeId = $state.params.placeId;
            

            if($state.params.query)
                $rootScope.searchData = $state.params.query;
            vm.viewTemplateUrl = "/web/mobile/list.tpl.html";//1=map 2= list

            if($state.params.viewMode=="list"){
                vm.viewTemplateUrl = "/web/mobile/list.tpl.html";
            }else if($state.params.viewMode=="map"){
                vm.viewTemplateUrl = "/web/mobile/map.tpl.html"
            }
            vm.initMap = true;
            vm.page = 1;
            vm.initialized = false;

            if(vm.placeId){
                HouseService.getPlaceByID({placeId: vm.placeId}).then(function(res){
                    if($state.params.keepViewport && $state.params.keepViewport ==true){
                        
                    }else{
                        vm.viewport = res.data.place.geometry.viewport;
                    }
                    $scope.center = "[" +res.data.place.geometry.location.lat + "," + res.data.place.geometry.location.lon+"]";
                    if(!$rootScope.searchData.diaChinh)
                        $rootScope.searchData.diaChinh = {};
                    $rootScope.searchData.diaChinh.tinhKhongDau = res.data.place.codeTinh;
                    $rootScope.searchData.diaChinh.huyenKhongDau = res.data.place.codeHuyen;
                    $rootScope.searchData.diaChinh.xaKhongDau = res.data.place.codeXa;
                    $rootScope.searchData.viewport = vm.viewport;
                    $rootScope.searchData.placeId = vm.placeId;
                    vm.search(function(){
                        if(vm.viewMode=="list"){
                            vm.initMap = false;
                        }
                    });
                });
            }else {
                vm.viewport = $rootScope.searchData.viewport;
                $rootScope.searchData.viewport = undefined;
                $rootScope.searchData.diaChinh = undefined;
                $scope.center = "[14.058324,108.277199]";
                vm.search(function(){
                    if(vm.viewMode=="list"){
                        vm.initMap = false;
                    }
                });
            }
        }

        vm.changeBrowserHistory = function(){
            let url = window.location.href;
            let index = url.lastIndexOf("/");
            url = url.substring(0,index+1) + vm.viewMode;
            //history.replaceState(null, null, url);            
        }

		vm.showList = function(){
			vm.viewTemplateUrl = "/web/mobile/list.tpl.html"
			vm.viewMode = "list";
            // vm.disableIdleHandler();
            vm.changeBrowserHistory();
            //vm.map = undefined;			
		}
		vm.showMap = function(){
			vm.viewMode = "map";
			vm.viewTemplateUrl = "/web/mobile/map.tpl.html"			
            $timeout(function() {
                vm.mapInitialized();
            }, 0);            
            vm.changeBrowserHistory();
		}
		vm.sort = function(sortByName, sortByType){
			$rootScope.searchData.orderBy.name = sortByName;
            $rootScope.searchData.orderBy.type = sortByType;
			vm.search();
		}

		vm.likeAdsClass ="";

		vm.likeAds = function(event,adsID){
		  //event.stopPropagation();
	      if($rootScope.isLoggedIn()==false){
	        $scope.$bus.publish({
              channel: 'login',
              topic: 'show login',
              data: {label: "Đăng nhập để lưu BĐS"}
	        });
	        return;
	      }
          let ind = $rootScope.user.adsLikes.indexOf(adsID);
          if(ind >=0){
            HouseService.unlikeAds({userID: $rootScope.user.userID, adsID: adsID}).then(function(res){
                if(res.status == 200){
                    var index = $rootScope.user.adsLikes.indexOf(adsID);
                    $rootScope.user.adsLikes.splice(index,1);                    
                }                
            });
          } else{
            HouseService.likeAds({adsID: adsID,userID: $rootScope.user.userID}).then(function(res){
                //alert(res.data.msg);
                //console.log(res);
                if(res.data.success == true || res.data.status==1){
                    $rootScope.user.adsLikes.push(adsID);
                }
            });  
          }	      
	    };       

        vm.searchWithoutViewport =function(){
            $rootScope.searchData.viewport = undefined;
            $rootScope.searchData.polygon = undefined;
            if(vm.poly){
                vm.poly.setMap(null);
            }
            vm.search();
        }

        vm.disableIdleHandler = function(){
            if(vm.zoomChangeHanlder)
                google.maps.event.removeListener(vm.zoomChangeHanlder);
        }
        vm.enableMapIdleHandler = function(){
            
            if(!vm.map)
                return;
            vm.disableIdleHandler();
            vm.zoomChangeHanlder = google.maps.event.addListener(vm.map, "idle", function(){
                if(vm.initialized == true){
                    vm.initialized = false;
                    vm.humanZoom = true;
                    // $rootScope.searchData.viewport = [vm.map.getBounds().getSouthWest().lat(),vm.map.getBounds().getSouthWest().lng(), vm.map.getBounds().getNorthEast().lat(),vm.map.getBounds().getNorthEast().lng()];
                    $rootScope.searchData.viewport = {
                        southwest: {
                            lat: vm.map.getBounds().getSouthWest().lat(),
                            lon: vm.map.getBounds().getSouthWest().lng()
                        },
                        northeast: {
                            lat: vm.map.getBounds().getNorthEast().lat(),
                            lon: vm.map.getBounds().getNorthEast().lng()
                        }
                    };
                    // $scope.center = "["+vm.map.getCenter().lat() +"," +vm.map.getCenter().lng() +"]";
                    // //var bounds = vm.map.getBounds();
                    // //alert($rootScope.searchData.geoBox);
                    // vm.marker = {
                    //  id: -1,
                    //  coords: {latitude: vm.map.getCenter().lat(), longitude: vm.map.getCenter().lng()},
                    //  content: 'you are here'
                    // };
                    vm.viewport = $rootScope.searchData.viewport;
                    if($rootScope.user.autoSearch==false){
                        vm.initialized = true;
                        vm.humanZoom = false;
                        return;
                    }
                    vm.search(function(){
                        $timeout(function() {
                            vm.initialized = true;
                            //vm.map.fitBounds(bounds);
                            vm.humanZoom = false;
                        }, 0);
                        
                    });
                    // alert('human zoom');
                }else{
                    console.log("not human zoom and turn to human zoom");
                    $timeout(function() {
                        vm.initialized = true;
                        //vm.map.fitBounds(bounds);
                        vm.humanZoom = false;
                    }, 200);
                }
            });   
        }
         $scope.$on("$destroy", function() {
                    // google.maps.event.removeListener(vm.zoomChangeHanlder);
                    // google.maps.event.removeListener(vm.dragendHanlder);
                    vm.disableIdleHandler();
                });

		vm.mapInitialized = function(){
			//vm.initialized = true;
			// alert('aa');

            if(!vm.map && vm.viewMode=='map'){
                vm.map = NgMap.initMap('searchmap');  
                vm.initialized = false;    
                var southWest = new google.maps.LatLng(vm.viewport.southwest.lat, vm.viewport.southwest.lon);
                var northEast = new google.maps.LatLng(vm.viewport.northeast.lat, vm.viewport.northeast.lon);
                var bounds = new google.maps.LatLngBounds(southWest, northEast);
                if(vm.humanZoom != true && vm.viewport.northeast.lat && vm.viewport.southwest.lat && vm.map){
                    let zoom = vm.map.zoom;
                    // vm.map.setZoom(20);
                    vm.map.fitBounds(bounds);
                    // vm.map.setCenter(bounds.getCenter());  
                    // vm.map.setZoom(zoom);
                    //vm.map.setCenter(vm.map.getBounds().getCenter());                         
                    //$scope.center = 'Hanoi';
                }
                $timeout(function() {
                    vm.showCC = true;
                // google.maps.event.removeListener(zoomChangeHanlder);
                // if(google.maps.event.hasListeners(map,'zoom_changed')!=true){
                    // google.maps.event.clearInstanceListeners(map);
                    vm.enableMapIdleHandler();
                    vm.humanZoom = false;    
                    vm.initialized = true;
                },500);                        
            }

			// vm.dragendHanlder = google.maps.event.addListener(vm.map, "dragend", function() {
   //          	//alert(vm.map.getBounds());
			// 	//$rootScope.searchData.geoBox = [vm.map.getBounds().getSouthWest().lat(),vm.map.getBounds().getSouthWest().lng(),vm.map.getBounds().getNorthEast().lat(),vm.map.getBounds().getNorthEast().lng()];

   //              $rootScope.searchData.viewport = {
   //                  southwest: {
   //                      lat: vm.map.getBounds().getSouthWest().lat(),
   //                      lon: vm.map.getBounds().getSouthWest().lng()
   //                  },
   //                  northeast: {
   //                      lat: vm.map.getBounds().getNorthEast().lat(),
   //                      lon: vm.map.getBounds().getNorthEast().lng()
   //                  }
   //              };
			// 	//alert($rootScope.searchData.geoBox);
			// 	$scope.center = "["+vm.map.getCenter().lat() +"," +vm.map.getCenter().lng() +"]";
			// 	vm.marker = {
			// 		id: -1,
			// 		coords: {latitude: vm.map.getCenter().lat(), longitude: vm.map.getCenter().lng()},
			// 		content: 'you are here'
			// 	};
   //              vm.viewport = $rootScope.searchData.viewport;
			// 	// $scope.$apply();
	  //         	vm.search();
	  //  			//alert('dragend');
	  //  			//alert($rootScope.searchData.geoBox);
	  //       });

	        

            // }

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
        vm.showSaveSearch = function(){
        	if($rootScope.isLoggedIn()){
        		$('#saveBox').modal("show");
        	}else{
        		$scope.$bus.publish({
	              channel: 'login',
	              topic: 'show login',
	              data: {label: "Đăng nhập để lưu tìm kiếm"}
		        });
        	}
        }
        vm.saveSearch = function(){
        	if(!vm.saveSearchName){
				vm.blankName = true;
				return;
			}			
			var data = {
				query: $rootScope.searchData,
				userID: $rootScope.user.userID,
				saveSearchName: vm.saveSearchName
			};

			HouseService.saveSearch(data).then(function(res){				
				//alert(res.data.msg);
				if(res.data.success){
					vm.blankName = false;
					vm.saveSearchName = '';					
					vm.nameSaveSearch = false;
					$('#saveBox').modal("hide");
                    $rootScope.user.saveSearch.push(data);
				}
			})
        	
        }
        /*start draw freehand*/
        vm.drawText = "Draw";

        vm.drawFreeHand = function(){

            //the polygon
            vm.poly=new google.maps.Polyline({map:vm.map,clickable:false});
            
            //move-listener
            if(vm.drawMove)
                google.maps.event.removeListener(vm.drawMove);     

            vm.drawMove =google.maps.event.addListener(vm.map,'mousemove',function(e){
                //e.preventDefault();
                vm.poly.getPath().push(e.latLng);
            });
            
            //mouseup-listener
            google.maps.event.addListenerOnce(vm.map,'mouseup',function(e){
                //google.maps.event.removeListener(vm.drawMove);
                var path=vm.poly.getPath();
                vm.poly.setMap(null);
                vm.poly=new google.maps.Polygon({map:vm.map,path:path});
                
                //search here
                if(vm.poly){
                    $rootScope.searchData.polygon = [];
                    let polyData = vm.poly.latLngs.b[0].b;
                    for (var i = polyData.length - 1; i >= 0; i--) {
                        $rootScope.searchData.polygon.push({
                            lat: polyData[i].lat(),
                            lon: polyData[i].lng()
                        });
                    }    
                }
                
                vm.search(function(){
                    if(vm.viewMode=="list"){
                        vm.initMap = false;
                    }
                });

                //google.maps.event.clearListeners(vm.map.getDiv(), 'mousedown');
                
                //vm.enable()
            });
        }
        vm.disable = function(){
            vm.map.setOptions({
                draggable: false, 
                zoomControl: false, 
                scrollwheel: false, 
                disableDoubleClickZoom: false
            });
        }
        
        vm.enable = function(){
            vm.map.setOptions({
                draggable: true, 
                zoomControl: true, 
                scrollwheel: true, 
                disableDoubleClickZoom: true
            });
            if(vm.drawMove){
                google.maps.event.removeListener(vm.drawMove);
                vm.drawMove = undefined;    
            }            
        }
        vm.freeHand = false;
        vm.toggleDrawMode = function(e){
            if(vm.freeHand == false){
                e.preventDefault();
                console.log("enable draws");  
                vm.freeHand = true;                 
                
                vm.disable()
                google.maps.event.addDomListener(vm.map.getDiv(),'mousedown',function(e){
                    if(vm.poly){
                        vm.poly.setMap(null);
                    }
                    vm.drawFreeHand()
                });
                
            }else{  
                if(vm.poly){
                    vm.poly.setMap(null);
                }  
                // google.maps.event.clearListeners(vm.map.getDiv(), 'mousemove');                   
                google.maps.event.clearListeners(vm.map.getDiv(), 'mousedown');                
                vm.enable();
                vm.freeHand = false;         
                $rootScope.searchData.polygon = undefined;       
            }            
        }
        /*end draw freehand*/
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
        
        //vm.page =1;
        vm.nextPage =function(){        	
        	vm.disableScrolling = true;
        	//vm.initialized = false;   
        	$('#searchmap').hide();
        	//alert('aaaa');
        	vm.currentPage = vm.currentPage+1;
        	$rootScope.searchData.pageNo = vm.currentPage;       
            if($rootScope.searchData.place)
                $rootScope.searchData.place.radiusInKm = $rootScope.searchData.radiusInKm;  
            $rootScope.searchData.userID = $rootScope.user.userID || undefined;
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
                // vm.initialized = false;   
                 $('#searchmap').show();
            });
        }
        // vm.initMap = function(){
        //     if(!vm.map){
        //         vm.map = NgMap.initMap('searchmap');
        //         vm.mapInitialized(vm.map);
        //     } 
        // }

		vm.searchPage = function(i, callback){
            $rootScope.searchData.pageNo = i;       
            $rootScope.searchData.userID = $rootScope.user.userID || undefined;
            //$rootScope.searchData.dienTichBETWEEN[0] = $rootScope.searchData.khoangDienTich.value.min;
            //$rootScope.searchData.dienTichBETWEEN[1] = $rootScope.searchData.khoangDienTich.value.max;
            vm.initialized = false;   

            // vm.khoangGiaList[]
            // $rootScope.searchData.khoangGia
            HouseService.findAdsSpatial($rootScope.searchData).then(function(res){
                var result = res.data.list;
                //vm.totalResultCounts = res.data.list.length;
                if(!result || result.length ==0){
                    //$rootScope.showNotify("Không thấy bất động sản thỏa mãn điều kiện tìm kiếm", ".heartNotify");
                    vm.noResult = true;
                }else{
                    vm.noResult = false;
                }
                
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
                                    data: 'test',
                                    count: 1
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
                if(vm.viewport){
                    //$scope.center = [vm.viewport.center.lat,vm.viewport.center.lon];  
                    var southWest = new google.maps.LatLng(vm.viewport.southwest.lat, vm.viewport.southwest.lon);
                    var northEast = new google.maps.LatLng(vm.viewport.northeast.lat, vm.viewport.northeast.lon);
                    var bounds = new google.maps.LatLngBounds(southWest, northEast);
                    

                    if(vm.humanZoom != true && vm.viewport.northeast.lat && vm.viewport.southwest.lat && vm.map){
                        let zoom = vm.map.zoom;
                        // vm.map.setZoom(20);
                        vm.map.fitBounds(bounds);
                        // vm.map.setCenter(bounds.getCenter());  
                        vm.map.setZoom(zoom);
                        //vm.map.setCenter(vm.map.getBounds().getCenter());                         
                        //$scope.center = 'Hanoi';
                    }
                        
                }


                for(var i = 0; i < res.data.list.length; i++) { 
                    var ads = res.data.list[i];
                    if(res.data.list[i].map){  
                        var dup = false;
                        for(var j=0;j<$scope.markers.length;j++){
                            var marker = $scope.markers[j];
                            if(marker.coords.latitude==res.data.list[i].map.marker.latitude 
                                && marker.coords.longitude == res.data.list[i].map.marker.longitude){
                                marker.count = marker.count + 1;
                                dup = true;
                                break;
                            }
                        }                      
                        if(dup == false){
                            $scope.markers.push(res.data.list[i].map.marker);    
                        }
                        
                    }
                }
                /*if(vm.ads_list.length==0){
                    vm.zoomMode = "false";
                }else{
                    vm.zoomMode = "auto";
                }*/

                vm.currentPageStart = vm.pageSize*($rootScope.searchData.pageNo-1) + 1
                vm.currentPageEnd = vm.currentPageStart + res.data.list.length -1;
                vm.currentPage = $rootScope.searchData.pageNo;

                vm.mapInitialized();       
                // if(vm.map){
                //     vm.disableIdleHandler();
                //     google.maps.event.addListenerOnce(vm.map, 'idle', function() {
                //         vm.enableMapIdleHandler();
                //         vm.initialized = true;
                //         vm.doneSearch = true;   
                //     });    
                // }            
                
                
                $timeout(function() {
                    $('body').scrollTop(0);
                    // vm.initialized = true;  
                    vm.doneSearch = true;   
                },0);
                
                // if($rootScope.isLoggedIn()){
                //     $rootScope.user.lastSearch = $rootScope.searchData;
                // }

                

                
                if(vm.ads_list && vm.ads_list.length>0){       
                    $rootScope.addLastSearch($localStorage,$rootScope.searchData);             
                    if(vm.diaChinh)
                        HouseService.findDuAnHotByDiaChinhForSearchPage({diaChinh: vm.diaChinh}).then(function(res){
                            if(res.data.success==true)
                                vm.duAnNoiBat = res.data.duAnNoiBat;
                        });
                }
                vm.disableScrolling = false; 
                if($rootScope.searchData.pageNo>1 && result && result.length >0){
                    $timeout(function() {
                        $rootScope.showNotify("Đang hiển thị từ " + vm.currentPageStart + "-" + vm.currentPageEnd + " / " + vm.totalResultCounts + " kết quả phù hợp",".mapsnotify");
                    },100);    
                }                
                if(callback)
                    callback(res);
            });
        }

        vm.prev = function(){
            if(vm.currentPage>=2){
                vm.currentPage = vm.currentPage-1;
                vm.searchPage(vm.currentPage);
            }
        }
        vm.next = function(){
            if(vm.totalResultCounts>0 && vm.totalResultCounts > (vm.currentPage+1)*vm.pageSize){
                vm.currentPage = vm.currentPage+1;
                vm.searchPage(vm.currentPage);
            }

        }
        vm.refreshPage = function(){
            if($rootScope.user.autoSearch==true){

            }else{
                //vm.searchPage(vm.currentPage);
                // vm.searchPage(1);
                google.maps.event.clearListeners(vm.map.getDiv(), 'mousedown');                
                vm.enable();
                vm.freeHand = false;         
                $rootScope.searchData.polygon = undefined;   
                vm.search();
            }            
        }
		vm.search = function(callback){
            // if($scope.searchPlaceSelected.geometry.viewport){
            /*if($rootScope.searchData.viewport){
            	console.log("Tim ads for viewport: " + JSON.stringify($rootScope.searchData.viewport));
            }else if(vm.onePoint == false){
                console.log("Tim ads for Tinh Huyen Xa: " + googlePlace.formatted_address);
                $rootScope.searchData.geoBox = [googlePlace.geometry.viewport.getSouthWest().lat(),googlePlace.geometry.viewport.getSouthWest().lng(),googlePlace.geometry.viewport.getNorthEast().lat(),googlePlace.geometry.viewport.getNorthEast().lng()]
                //$rootScope.searchData.radiusInKm = undefined;
            } else{
                console.log("Tim ads for dia diem: " + googlePlace.formatted_address);
                //data.radiusInKm = "10";
                var placeData = {
                    placeId: googlePlace.place_id || googlePlace.placeId,
                    relandTypeName : window.RewayPlaceUtil.getTypeName(googlePlace),
                    radiusInKm :  $rootScope.searchData.radiusInKm,
                    currentLocation: undefined
                }
                $rootScope.searchData.place = placeData;
                $rootScope.searchData.geoBox = undefined;
            }*/
            $rootScope.searchData.userID = $rootScope.user.userID;
            $rootScope.lastSearch = $rootScope.searchData;



            /*HouseService.countAds($rootScope.searchData).then(function(res){
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
            });*/
            $rootScope.searchData.isIncludeCountInResponse = true;
            vm.searchPage(1,function(res){
                $rootScope.searchData.isIncludeCountInResponse = false;
                vm.totalResultCounts = res.data.totalCount;
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
                $timeout(function() {
                    if(vm.totalResultCounts>0)
                        $rootScope.showNotify("Tìm thấy " + vm.totalResultCounts + " kết quả phù hợp",".mapsnotify");
                },100);
                
                if(callback)
                    callback(res);
            })
            // vm.searchPage(1,null);
        }

        //vm.search();

        /*NgMap.getMap('searchmap').then(function(map){
        	vm.map = map; 
            // window.RewayClientUtils.createPlaceAutoComplete(vm.selectPlaceCallback,"searchadd",map);
            vm.PlacesService =  new google.maps.places.PlacesService(map);
            if(vm.placeId){
                vm.PlacesService.getDetails({
                    placeId: vm.placeId
                }, function(place, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                    	vm.place = place;
                        $rootScope.searchData.place = place;
                        $rootScope.searchData.geoBox = undefined;
                        //var map = $scope.map.control.getGMap();
                        var current_bounds = map.getBounds();
                        //$scope.map.center =  
                        $scope.center = "["+place.geometry.location.lat() +"," +place.geometry.location.lng() +"]";
                        if(place.geometry.viewport){
                            //map.fitBounds(place.geometry.viewport);   
                            //$scope.map
                        } else if( !current_bounds.contains( place.geometry.location ) ){
                            var new_bounds = current_bounds.extend(place.geometry.location);
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
        });*/


        vm.init();

		
	});
})();
