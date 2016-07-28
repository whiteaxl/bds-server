(function() {
	'use strict';
	var controllerId = 'MainCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, $state, HouseService, NewsService, NgMap, $window,$timeout,$location,$q){
		var vm = this;
		//nhannc
		$scope.loaiTin = 0;
		$scope.loaiNhaDat;
		$scope.listCategory = [];
		$scope.placeSearchId='ChIJoRyG2ZurNTERqRfKcnt_iOc';
		init();
		initHotAds();
		//alert("placeSearchId: " + $scope.placeSearchId);

		$scope.$bus.subscribe({
            channel: 'user',
            topic: 'logged-in',
            callback: function(data, envelope) {
                //console.log('add new chat box', data, envelope);
                initHotAds();
            }
        });

		$scope.goToPageSearch = function(loaiTin, loaiBds){
			if(loaiTin)
				$scope.loaiTin = loaiTin;
			if(loaiBds)
				$scope.loaiNhaDat = loaiBds;
			if($scope.loaiNhaDat == '0')
				$scope.loaiNhaDat = null;

			console.log("$scope.loaiTin: " + $scope.loaiTin);
			console.log("$scope.loaiNhaDat: " + $scope.loaiNhaDat);
			console.log("$scope.placeId: " + $scope.placeSearchId);
			$state.go('search', { "place" : $scope.placeSearchId, "loaiTin" : $scope.loaiTin, "loaiNhaDat" : $scope.loaiNhaDat }, {location: true});
		}
		$scope.goToPageNews = function(rootCatId){
			console.log("--goToPageNews---rootCatId: " + rootCatId);
			$state.go('news',{"rootCatId" : rootCatId});
		}
		vm.selectPlaceCallback = function(place){
			$scope.searchPlaceSelected = place;
			$scope.placeSearchId = place.place_id;
		}
		$scope.setLoaiTin = function(loaiTin){
			$scope.loaiTin = loaiTin;
		}

		//End nhannc
		vm.getAllAds = function(){
			HouseService.getAllAds().then(function(res){
				vm.sellingHouses = res.data;
				$scope.markers = [];
				for(var i = 0; i < res.data.length; i++) {
		    		var ads = res.data[i];
		    		if(res.data[i].map)
		    			$scope.markers.push(res.data[i].map.marker);
				}
			});
		}
		vm.goDetail = function(cat, index){
			$state.go('detail', { "adsID" : cat.list[index].adsID}, {location: true});
		}

		$scope.$on('$viewContentLoaded', function(){
			//addCrudControls
			$timeout(function() {
				window.DesignCommon.adjustPage();
			},0);
			if($state.current.data)
				$rootScope.bodyClass = $state.current.data.bodyClass
			// window.onresize = function() {
			//     window.DesignCommon.resizePage();
			// }
		});

		vm.formatLabel = function(model){
			if(model)
				return model.formatted_address;
		};

		vm.showMoreCat = function(cat){
			$state.go('topview', { "tinhKhongDau" : cat.query.diaChinh.tinhKhongDau, "huyenKhongDau" : cat.query.diaChinh.huyenKhongDau, "ngayDaDang" : cat.query.ngayDaDang }, {location: true});

			// cat.query.pageNo = cat.query.pageNo + 1;
			// HouseService.findAdsSpatial(cat.query).then(function(res){							
			// 	cat.list = res.data.list;	
			// 	if(cat.list.length ==0)
			// 		cat.hasMore = false;
			// });
		};


		function init(){
			//nhannc
			$scope.loaiNhaDatBan = window.RewayListValue.LoaiNhaDatBanWeb;
			$scope.loaiNhaDatThue = window.RewayListValue.LoaiNhaDatThueWeb;
			$scope.loaiNhaDatCanMua = window.RewayListValue.LoaiNhaDatCanMuaWeb;
			$scope.loaiNhaDatCanThue = window.RewayListValue.LoaiNhaDatCanThueWeb;
			/*
			console.log("---------nhannc--------------listCategory");
			NewsService.findRootCategory().then(function(res){
				var result = [];
				if(res.data.list){
					for (var i = 0; i < res.data.list.length; i++) {
						$scope.listCategory.push({value: res.data.list[i].cat_id, lable: res.data.list[i].cat_name});
					}
				}
				console.log("---------listCategory: " + $scope.listCategory.length);
				console.log($scope.listCategory);
			});*/

			//NhanNc add menu Tin tuc
			console.log("---------nhannc--------------initHomeCtrl");
			if(!menuHasContainsNewsCategory()){
				var danhMucCategory =  {
					label: "Tin tức",
					value: {},
					visible: true,
					items: []
				};

				NewsService.findRootCategory().then(function(res){
					if(res.data.list){
						$scope.listCat = [];
						angular.forEach(res.data.list, function (myItem) {
							//var deferred = $q.defer();
							var cat = {};
							/*
							setTimeout(function () {
								deferred.resolve(myItem);
								console.log('long-running operation inside forEach loop done');
							}, 2000);*/
							cat.value = {menuType : 1, rootCatId : myItem.cat_id};
							cat.label = myItem.cat_name;
							var data = {
								catId : myItem.cat_id
							};
							NewsService.findCategoryByParentId(data).then(function(res) {
								if(res.data.list){
									cat.items = [];
									for (var i = 0; i < res.data.list.length; i++) {
										cat.items.push({value: {menuType : 1, rootCatId : res.data.list[i].cat_id}, label: res.data.list[i].cat_name});
									}
								}
							})
							$scope.listCat.push(cat);
						});
						if($scope.listCat.length >0){
							for (var i = 0; i < $scope.listCat.length; i++) {
								danhMucCategory.items.push($scope.listCat[i]);
							}
						}
						$rootScope.menuitems.push(danhMucCategory);
						console.log($rootScope.menuitems);
					}
				});
			}
			//NhanNc add menu Tin tuc

			NgMap.getMap().then(function(map){
	        	// $scope.map = {center: {latitude: 16.0439, longitude: 108.199 }, zoom: 10 , control: {},fit: true};
	        	window.RewayClientUtils.createPlaceAutoComplete(vm.selectPlaceCallback,"autoCompleteHome",map);
	        	$scope.PlacesService =  new google.maps.places.PlacesService(map);
	        	$scope.PlacesService.getDetails({
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
						        });

        	});
			//end nhannc
			$scope.map = {center: {latitude: 16.0439, longitude: 108.199 }, zoom: 10 , control: {}};
			$scope.options = {scrollwheel: false,labelContent: 'gia'};
			$scope.markerCount = 3;
			$scope.markers = [];
			$scope.initData = window.initData;
			//$scope.hot_ads_cat = window.hot_ads_cat;
			$scope.ads_list = window.testData;
			$scope.bodyClass= "page-home";
			for(var i = 0; i < $scope.ads_list.length; i++) { 
	    		var ads = $scope.ads_list[i];
	    		if(ads.place){
	    			if(ads.place.geo){
		    			ads.map={
		    				center: {
								latitude: 	ads.place.geo.lat,
								longitude: 	ads.place.geo.lon
							},
		    				marker: {
								id: i,
								coords: {
									latitude: 	ads.place.geo.lat,
									longitude: 	ads.place.geo.lon
								},
								options: {
									//labelContent : ads.gia,
									icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+ ads.gia+ '|FF0000|000000'
								},
								data: 'test'
							},
							options:{
								scrollwheel: false
							},
							zoom: 14	
		    			}
		    			$scope.map.center = {latitude: ads.map.center.latitude, longitude: ads.map.center.longitude };
		    			$scope.markers.push(ads.map.marker);
		    					
					}
	    		}
			}

		}

		function menuHasContainsNewsCategory() {
			for (var i = 0; i < $rootScope.menuitems.length; i++) {
				if ($rootScope.menuitems[i].label == "Tin tức") {
					return true;
				}
			}
			return false;
		}

		$scope.getClass = function(i){
			var colArr = ["col col-40", "col col-35", "col col-25"];
			var reverse = false;	
			var j = Math.floor(i/3);
			if(j==0){
				return colArr[i%3];
			}else if(j==1){
				return colArr[((i%3)+1)%3];
			}else {
				return colArr[((i%3)+2)%3];
			}
			/*var reverse = false;	
			var j = Math.floor(i/2);

			if(i%2==0){
				if(j%2==0)					
					return "col col-40";
				else
					return "col col-60";
			}else{
				if(j%2==0)					
					return "col col-60";
				else
					return "col col-40";	
			}*/
		}

		
		function initHotAds(){
			console.log("---------------------initHotAds ---------------");
			$scope.hot_ads_cat =[];
			$timeout(function() {
				if($rootScope.user && $rootScope.user.userID && $rootScope.user.lastSearch){
					var lastSearch = $rootScope.user.lastSearch;	
					if(lastSearch){
						for(var i=0;i<3;i++){
							$scope.hot_ads_cat.push( {
								name: "",
								location: "",
								list: [{type: "Ads"},{type: "Ads"},{type: "Ads"},{type: "Ads"},{type: "Ads"},{type: "Ads"}]
							});	
						}
						var searchDataCungLoai = {
							"loaiTin": lastSearch.loaiTin,
							"loaiNhaDat": lastSearch.loaiNhaDat, 
							"limit": 9,
							"soPhongNguGREATER": 0,
				  			"soPhongTamGREATER": 0,
				  			"soTangGREATER": 0,
							"diaChinh": lastSearch.diaChinh,
							"geoBox": lastSearch.geoBox,
							"updateLastSearch": false,
						  	"orderBy": "ngayDangTinDESC",
						  	"pageNo": 1
						};
						HouseService.findAdsSpatial(searchDataCungLoai).then(function(res){
							if(lastSearch.loaiNhaDat==0 ){
								$scope.hot_ads_cat[0].name = "Bất động sản mới đăng";
							}else{
								$scope.hot_ads_cat[0].name = window.RewayListValue.getLoaiNhaDatForDisplayNew(lastSearch.loaiTin,lastSearch.loaiNhaDat) + " mới đăng";
							}
							$scope.hot_ads_cat[0].list = res.data.list;	
							$scope.hot_ads_cat[0].query = searchDataCungLoai;	
							$scope.hot_ads_cat[0].hasMore = res.data.list.length>0;

						});
						var giaBETWEEN = lastSearch.giaBETWEEN;
						var searchDataNgangGia = {
							"loaiTin": lastSearch.loaiTin,
							"loaiNhaDat": 0, 
							"limit": 9,
							"soPhongNguGREATER": 0,
				  			"soPhongTamGREATER": 0,
				  			"soTangGREATER": 0,
				  			"giaBETWEEN": giaBETWEEN,
							"diaChinh": lastSearch.diaChinh,
							"geoBox": lastSearch.geoBox,
						  	"orderBy": "ngayDangTinDESC",
						  	
						  	"pageNo": 1
						};
						var searchDataDuoiGia = {
							"loaiTin": lastSearch.loaiTin,
							"loaiNhaDat": 0, 
							"limit": 9,
							"soPhongNguGREATER": 0,
				  			"soPhongTamGREATER": 0,
				  			"soTangGREATER": 0,
				  			"giaBETWEEN": giaBETWEEN,
							"diaChinh": lastSearch.diaChinh,
							"geoBox": lastSearch.geoBox,
						  	"orderBy": "ngayDangTinDESC",
						  	
						  	"pageNo": 1
						};

						if(giaBETWEEN && !(giaBETWEEN[1]> 99999999999 && giaBETWEEN[0]==0)){
							var mean = (giaBETWEEN[0] + giaBETWEEN[1])/2;
							giaBETWEEN[0] = mean - mean*0.1;
							giaBETWEEN[1] = mean + mean * 0.1;
							searchDataNgangGia.giaBETWEEN = giaBETWEEN;
							HouseService.findAdsSpatial(searchDataNgangGia).then(function(res){							
								if(searchDataNgangGia.loaiTin == 0){
									$scope.hot_ads_cat[1].name = "Bất động sản giá từ " + giaBETWEEN[0]/1000  + " đến "+ giaBETWEEN[1]/1000 + " tỷ";
								}else{
									$scope.hot_ads_cat[1].name = "Bất động sản giá từ " + giaBETWEEN + " đến "+ giaBETWEEN[1] + " triệu/tháng";								
								}
								
								$scope.hot_ads_cat[1].list = res.data.list;	
								$scope.hot_ads_cat[1].query = searchDataNgangGia;
								$scope.hot_ads_cat[1].hasMore = res.data.list.length>0;
							});
							searchDataDuoiGia.giaBETWEEN[0] = 0;
							searchDataDuoiGia.giaBETWEEN[1] = mean;
							HouseService.findAdsSpatial(searchDataDuoiGia).then(function(res){							
								if(searchDataDuoiGia.loaiTin==0){
									$scope.hot_ads_cat[2].name = "Bất động giá dưới " + mean/1000 + " tỷ";
								}else{
									$scope.hot_ads_cat[2].name = "Bất động giá dưới " + mean + " triệu/tháng";								
								}
								
								$scope.hot_ads_cat[2].list = res.data.list;	
								$scope.hot_ads_cat[2].query = searchDataDuoiGia;
								$scope.hot_ads_cat[2].hasMore = res.data.list.length>0;
							});
						}else{
							if($rootScope.user.lastViewAds){
								HouseService.detailAds({adsID: $rootScope.user.lastViewAds}).then(function(res){
									if(res.data.status == 0){
										giaBETWEEN[0] = res.data.ads.gia - res.data.ads.gia*0.1;
										giaBETWEEN[1] = res.data.ads.gia + res.data.ads.gia*0.1;
										searchDataNgangGia.giaBETWEEN = giaBETWEEN;
										$scope.hot_ads_cat[1].name = "Bất động ngang giá " + res.data.ads.giaFmt;
										HouseService.findAdsSpatial(searchDataNgangGia).then(function(res){							
											$scope.hot_ads_cat[1].list = res.data.list;	
											$scope.hot_ads_cat[1].query = searchDataNgangGia;
											$scope.hot_ads_cat[1].hasMore = res.data.list.length>0;
										});
										searchDataDuoiGia.giaBETWEEN[0] = 0;
										searchDataDuoiGia.giaBETWEEN[1] = res.data.ads.gia;
										$scope.hot_ads_cat[2].name = "Bất động giá dưới " + res.data.ads.giaFmt;
										HouseService.findAdsSpatial(searchDataDuoiGia).then(function(res){							
											$scope.hot_ads_cat[2].list = res.data.list;	
											$scope.hot_ads_cat[2].query = searchDataDuoiGia;
											$scope.hot_ads_cat[2].hasMore = res.data.list.length>0;
										});


									}
								});
							}
							// giaBETWEEN = [1000000000, 2000000000]
						}
						
						


					}
				}else{
					for(var i=0;i<4;i++){
						$scope.hot_ads_cat.push( {
							name: "",
							location: "",
							list: [{type: "Ads"},{type: "Ads"},{type: "Ads"},{type: "Ads"},{type: "Ads"},{type: "Ads"}]
						});	
					}
					
					HouseService.findAdsAndDuanForHomePage({limit:9}).then(function(res){
						$scope.hot_ads_cat[0].name = res.data.list[0].name;
						$scope.hot_ads_cat[0].type = res.data.list[0].type;
						$scope.hot_ads_cat[0].location = res.data.list[0].location;
						$scope.hot_ads_cat[0].list = res.data.list[0].list;
						$scope.hot_ads_cat[1].name = res.data.list[1].name;
						$scope.hot_ads_cat[1].type = res.data.list[1].type;
						$scope.hot_ads_cat[1].location = res.data.list[1].location;
						$scope.hot_ads_cat[1].list = res.data.list[1].list;					
						//Array.prototype.push.apply($scope.hot_ads_cat, res.data.list);
						//console.log(res);
					});	
					//var ngayDaDang = Date.today().add(-700).days();
					var searchNhaXemNhieuNhatTaiHanoi = {
						"loaiTin": 0,
						"loaiNhaDat": 0, 
						"limit": 6,
						"soPhongNguGREATER": 0,
			  			"soPhongTamGREATER": 0,
			  			"soTangGREATER": 0,
			  			"ngayDaDang": 300,
						"diaChinh": {
							tinh: "ha-noi"
						},				
					  	"orderBy": "luotXemDESC",
					  	"pageNo": 1
					};
					HouseService.findAdsSpatial(searchNhaXemNhieuNhatTaiHanoi).then(function(res){										
						$scope.hot_ads_cat[2].name = "Bất động sản xem nhiều nhất tại Hà Nội";				
						$scope.hot_ads_cat[2].list = res.data.list;
						$scope.hot_ads_cat[2].query = searchNhaXemNhieuNhatTaiHanoi;
						$scope.hot_ads_cat[2].hasMore = res.data.list.length>0;
					});	
					var searchNhaXemNhieuNhatTaiHcm = {
						"loaiTin": 0,
						"loaiNhaDat": 0, 
						"limit": 6,
						"soPhongNguGREATER": 0,
			  			"soPhongTamGREATER": 0,
			  			"soTangGREATER": 0,
			  			"ngayDaDang": 300,
						"diaChinh": {
							tinh: "ho-chi-minh"
						},				
					  	"orderBy": "luotXemDESC",
					  	"pageNo": 1
					};
					HouseService.findAdsSpatial(searchNhaXemNhieuNhatTaiHcm).then(function(res){					
						$scope.hot_ads_cat[3].name = "Bất động sản xem nhiều nhất tại thành phố Hồ Chí Minh";				
						$scope.hot_ads_cat[3].list = res.data.list;		
						$scope.hot_ads_cat[3].query = searchNhaXemNhieuNhatTaiHcm;	
						$scope.hot_ads_cat[3].hasMore = res.data.list.length>0;										
					});	
				}	

				/*var searchDiaChinh = {
					tinh: "ha-noi",
					huyen: "hoan-kiem"
				}
				if(lastSearch && lastSearch.diaChinh){
					searchDiaChinh = lastSearch.diaChinh;
				}
				var searchLogoGiamGia = {
					"loaiTin": lastSearch.loaiTin,
					"loaiNhaDat": lastSearch.loaiNhaDat, 
					"limit": 10,
					"soPhongNguGREATER": 0,
		  			"soPhongTamGREATER": 0,
		  			"soTangGREATER": 0,
					"diaChinh": lastSearch.diaChinh,
					"geoBox": lastSearch.geoBox,
					"updateLastSearch": false,
				  	"orderBy": "ngayDangTinDESC",
				  	"pageNo": 1
				}	*/
				// data = {
				// 	"gia": 800,
				// 	"limit": 4
				// };

				// $scope.hot_ads_cat = [];

				// HouseService.findBelowPriceAds(data).then(function(res){
				// 	var resultBelow = [];
				// 	if(res.data.list){
				// 		for (var i = 0; i < res.data.list.length; i++) {
				// 			resultBelow.push(res.data.list[i].default);
				// 		}
				// 		$scope.hot_ads_cat.push({
				// 			name: "Nhà dưới mức giá 800 triệu",
				// 			location: "Hà Nội",
				// 			list: resultBelow
				// 		})
				// 	}
				// 	console.log("HouseService.findBelowPriceAds: " + resultBelow.length);
				// 	console.log(resultBelow);
				// });

				// var data = {
				// 	"ngayDangTin": '25-04-2016',
				// 	"limit": 4
				// };
				// console.log("getRecentBds + data: " + data);
				// HouseService.findRencentAds(data).then(function(res){
				// 	var result = [];
				// 	if(res.data.list){
				// 		for (var i = 0; i < res.data.list.length; i++) {
				// 			result.push(res.data.list[i].default);
				// 		}
				// 		$scope.hot_ads_cat.push({
				// 			name: "Bất động sản mới đăng",
				// 			location: "Hà Nội",
				// 			list: result
				// 		})
				// 	}
				// 	console.log("HouseService.findRencentAds: " + result.length);
				// 	console.log(result);
				// });
			},0);

			

		}
		vm.getLocation = function () {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(vm.showPosition);
			} else {
				alert("Geolocation is not supported by this browser.");
			}
		}
		vm.showPosition =  function(position) {
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;
			//$scope.map.center.latitude = lat;
			//$scope.map.center.longitude = lng;
			var marker = {
				id: $scope.markerCount,
				coords: {
					latitude: lat,
					longitude: lng
				},
				options: {
					labelContent : 'You are here'
				},
				data: 'restaurant'
			}
			$scope.markers.push(marker);
			$scope.markerCount = $scope.markerCount + 1;
			$scope.$digest();
		}

		if($state.current.name == "resetPassword"){
			var token =  $location.search().token;			
			$scope.$bus.publish({
              channel: 'login',
              topic: 'show login',
              data: {label: "Đăng nhập để chat", token: token}
	        });
		}

	});

	// /* @ngInject */
	// function MainCtrl() {
		
	// }
})();
