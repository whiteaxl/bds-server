(function() {
	'use strict';

	var controllerId = 'MobilePostCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, Upload, $state, HouseService, NewsService, RewayCommonUtil, NgMap, $window,$timeout,$location,$localStorage){
		var vm = this;

		vm.ads = {};
		vm.ads.loaiTin = 0;
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
		$scope.location = {};
		$scope.loaiTin = 0;
		$scope.soPhongNgu;
		$scope.soPhongTam;
		$scope.soTang;
		$scope.addressDetail = '';
		vm.showStreetView = false;

		vm.duAn =[];
		vm.diaChinh ={};

		vm.location = {};
		vm.diaChinh = {};
		vm.loaiNhaDatBan = window.RewayListValue.LoaiNhaDatBanWeb;
		vm.loaiNhaDatThue = window.RewayListValue.LoaiNhaDatThueWeb;
		vm.dacTinhNha = window.RewayListValue.DacTinhNha;
		vm.huongNhaList = window.RewayListValue.getNameValueArray(window.RewayListValue.HuongNha);
		$scope.currentYear = new Date().getFullYear();

		$scope.rangeNumber = [];
		for(var i=0;i<8;i++) {
			$scope.rangeNumber.push(i);
		}

		vm.loaiGias = [
				{ value: 1, lable: "Triệu"},
				{ value: 2, lable: "Tỷ" },
				{ value: 3, lable: "Trăm nghìn/m2" },
				{ value: 4, lable: "Triệu/m2" },
				{ value: 0, lable: "Thỏa thuận" }
		];
		vm.loaiGia = { value: 1, lable: "Triệu"};
		$scope.namXayDungList = [
			{ value: $scope.currentYear, lable: $scope.currentYear },
			{ value: $scope.currentYear-1, lable: ($scope.currentYear -1) },
			{ value: $scope.currentYear-2, lable: ($scope.currentYear -2) },
			{ value: $scope.currentYear-3, lable: ($scope.currentYear -3) },
			{ value: $scope.currentYear-4, lable: ($scope.currentYear -4) },
			{ value: $scope.currentYear-5, lable: ($scope.currentYear -5) },
			{ value: $scope.currentYear-6, lable: ($scope.currentYear -6) },
			{ value: $scope.currentYear-7, lable: ($scope.currentYear -7) },
			{ value: $scope.currentYear-8, lable: ($scope.currentYear -8) },
			{ value: $scope.currentYear-9, lable: ($scope.currentYear -9) },
			{ value: $scope.currentYear-8, lable: ($scope.currentYear -10) },
			{ value: $scope.currentYear-8, lable: ($scope.currentYear -11) },
			{ value: $scope.currentYear-8, lable: ($scope.currentYear -12) },
			{ value: $scope.currentYear-8, lable: ($scope.currentYear -13) },
			{ value: $scope.currentYear-8, lable: ($scope.currentYear -14) },
			{ value: $scope.currentYear-8, lable: ($scope.currentYear -15) },
			{ value: $scope.currentYear-8, lable: ($scope.currentYear -16) },
			{ value: $scope.currentYear-8, lable: ($scope.currentYear -17) },
			{ value: $scope.currentYear-8, lable: ($scope.currentYear -18) },
			{ value: $scope.currentYear-8, lable: ($scope.currentYear -19) },
			{ value: $scope.currentYear-8, lable: ($scope.currentYear -20) },
			{ value: $scope.currentYear-8, lable: ($scope.currentYear -21) },
			{ value: $scope.currentYear-8, lable: ($scope.currentYear -23) },
			{ value: $scope.currentYear-8, lable: ($scope.currentYear -24) },
			{ value: $scope.currentYear-8, lable: ($scope.currentYear -25) },
			{ value: $scope.currentYear-8, lable: ($scope.currentYear -26) },
			{ value: $scope.currentYear-8, lable: ($scope.currentYear -27) },
			{ value: $scope.currentYear-8, lable: ($scope.currentYear -28) },
			{ value: $scope.currentYear-8, lable: ($scope.currentYear -29) },
			{ value: $scope.currentYear-8, lable: ($scope.currentYear -30) }
		];

		$(".btn-more .collapse-title").click(function() {
			$(this).parent().hide(), $(".more-box").removeClass("more-box-hide")
		})

		/*
		vm.getDanhMucNamXd = function(){
			$scope.currentYear = new Date().getFullYear();
			$scope.namXayDungList = [];
			let varYear;
			for (var i = 0; i< 100; i++) {
				varYear = { value: $scope.currentYear, lable: $scope.currentYear };
				$scope.namXayDungList.push(varYear);
			}
		}*/

		// autocomplete
		vm.favoriteSearchSource = [
			{
				description: "Vị trí hiện tại",
				location: true,
				class: "ui-autocomplete-category"
			}
		];

		vm.autoCompleteChange = function(event){
			if(vm.autoCompleteText == ''){
				$( "#searchAddPost").autocomplete( "option", "source",vm.favoriteSearchSource);
				$( "#searchAddPost").autocomplete( "search", "" );
			}
			vm.toggleQuickClearAutoComplete();
		}

		vm.showFavorite = function(event){
			if(vm.autoCompleteText == '' || !vm.autoCompleteText){
				$( "#searchAddPost").autocomplete( "option", "source",vm.favoriteSearchSource);
				$( "#searchAddPost").autocomplete( "search", "" );
			}

		}

		//current only remove urlAdr, must delete real file on server
		vm.removeAvatarImg = function(){
			if(vm.ads.image.cover){
				HouseService.deleteFile({fileUrl: vm.ads.image.cover.trim()}).then(function(res){
					console.log(res);
				})
				vm.ads.image.cover = '';
			}
		}

		vm.removeNormalImg = function(img){
			if(vm.ads.image.images){
				if(img){
					//var urlToDelete = img.substring(img.indexOf("web/"), img.length);
					HouseService.deleteFile({fileUrl: img.trim()}).then(function(res){
						console.log(res);
					})
					vm.ads.image.cover = '';
					var removeIndex = vm.ads.image.images.indexOf(img);
					if (removeIndex > -1) {
						vm.ads.image.images.splice(removeIndex, 1);
					}
				}
			}
		}

		vm.mapClick =function(event){
			vm.showStreetView = false;
			//$('#mapsBox').modal("show");
		}
		$scope.chonDiaChinh = function(){
			console.log($scope.listDiaChinh[0]);
			if($scope.listDiaChinh){
				vm.viewPort =  $scope.listDiaChinh[0].viewPort;;
				if(vm.viewPort){
					//$scope.center = [vm.viewport.center.lat,vm.viewport.center.lon];
					var southWest = new google.maps.LatLng(vm.viewPort.southwest.lat, vm.viewPort.southwest.lon);
					var northEast = new google.maps.LatLng(vm.viewPort.northeast.lat, vm.viewPort.northeast.lon);
					var bounds = new google.maps.LatLngBounds(southWest, northEast);

					// move map to viewport
					vm.fullMapPost.fitBounds(bounds);
				}
			}
		}

		vm.autocompleteGoogleSource = function (request, response) {
			console.log(request);
			var options = {
				input: request.term,
				//types: ['(cities)'],
				//region: 'US',
				componentRestrictions: { country: "vn" }
			};
			function callback(predictions, status) {
				var results = [];
				if(predictions){
					console.log(predictions);
					for (var i = 0, prediction; prediction = predictions[i]; i++) {
						results.push(
							{
								description: prediction.description,
								types:  	prediction.types,
								place_id: 	prediction.place_id,
								class: "iconLocation gray"
							}
						);
					}
				}
				response(results);
			}
			var service = new google.maps.places.AutocompleteService();
			service.getPlacePredictions(options, callback);
		}

		vm.autocompleteSource = function (request, response) {
			var results = [];
			$http.get("/api/place/autocomplete?input=" + request.term).then(function(res){
				var predictions = res.data.predictions;
				console.log(predictions);
				if(res.status == '200'){
					for (var i = 0, prediction; prediction = predictions[i]; i++) {
						results.push(
							{
								description: prediction.fullName,
								types:    prediction.placeType,
								viewPort:   prediction.viewport,
								tinh: prediction.tinh,
								huyen: prediction.huyen,
								xa: prediction.xa,
								placeId: prediction.placeId,
								class: "iconLocation gray"
							}
						);
					}
				}
				$scope.listDiaChinh = results;
				response(results);
			});
		}

		vm.keyPress = function(event){
			vm.showFrequentSearch = false;
			$( "#searchAddPost").autocomplete( "option", "source",vm.autocompleteGoogleSource);
			var $ww = $(window).width();


		}

		vm.toggleQuickClearAutoComplete = function(){
			if(vm.autoCompleteText == '' || !vm.autoCompleteText){
				$( "#searchAddPost").autocomplete( "option", "source",vm.favoriteSearchSource);
				$( "#searchAddPost").autocomplete( "search", "" );
				$(".close-search").removeAttr("style");
				$(".input-fr").removeAttr("style");
			}else{
				$(".close-search").show();
				$(".input-fr").css("width", $ww-78);
			}
			// if($(".search").find("input").hasClass("input-fr")){

			//     if($(".input-fr").val().length>0) {
			//         $(".close-search").show();
			//         $(".input-fr").css("width", $ww-78);
			//     }else{
			//         $(".close-search").removeAttr("style");
			//         $(".input-fr").removeAttr("style");
			//     }
			// }
		}

		vm.selectPlaceCallback = function(item){
			console.log(item);
			if(item.lastSearchSeparator==true){
				return;
			}
			vm.item = item;
			if(vm.item.place_id){
				var request = {
					placeId: vm.item.place_id
				};
				var service = new google.maps.places.PlacesService(vm.fullMapPost);
				service.getDetails(request, function(place, status) {
					vm.fullMapPost.fitBounds(place.geometry.viewport);
					vm.location.lat = vm.fullMapPost.getCenter().lat();
					vm.location.lon = vm.fullMapPost.getCenter().lng();
					console.log(vm.location.lat);
					console.log(vm.location.lon);
				});
			}
		}

		vm.selectPlaceCallbackBk = function(item){
			console.log(item);
			if(item.lastSearchSeparator==true){
				return;
			}
			vm.item = item;
			if(vm.item.placeId)
				$rootScope.searchData.placeId = vm.item.placeId;
			vm.keepViewport = false;
			if(item.query){
				vm.place = vm.item.place;
				$scope.searchData = item.query;
				vm.updateDrums();
			}else{
				vm.place = item;
			}
			if(!item.location){
				$scope.searchData.circle = undefined;
			}
			$scope.$apply();
		}
		// end auto

		vm.resetLocation = function(){
			vm.autoCompleteText = "";
			vm.location.lat = $scope.location.lat;
			vm.location.lon = $scope.location.lon;
			vm.toggleQuickClearAutoComplete();
		}

		vm.setDacTinhNha = function( value){
			if(value==0){
				vm.ads.nhaMoiXay = !vm.ads.nhaMoiXay;
			} else if(value==1){
				vm.ads.nhaLoGoc = !vm.ads.nhaLoGoc;
			} else if(value==2){
				vm.ads.otoDoCua = !vm.ads.otoDoCua;
			} else if(value==3){
				vm.ads.nhaKinhDoanhDuoc = !vm.ads.nhaKinhDoanhDuoc;
			} else if(value==4){
				vm.ads.noiThatDayDu = !vm.ads.noiThatDayDu;
			} else if(value==5){
				vm.ads.chinhChuDangTin = !vm.ads.chinhChuDangTin;
			}
		}
		vm.isActiveClass = function(value){
			if(value==0){
				return vm.ads.nhaMoiXay;
			} else if(value==1){
				return vm.ads.nhaLoGoc;
			} else if(value==2){
				return vm.ads.otoDoCua;
			} else if(value==3){
				return vm.ads.nhaKinhDoanhDuoc;
			} else if(value==4){
				return vm.ads.noiThatDayDu;
			} else if(value==5){
				return vm.ads.chinhChuDangTin;
			}
		}
		vm.getCurrentLocation = function() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position){
					console.log(position);
					$rootScope.currentLocation.lat = position.coords.latitude;
					$rootScope.currentLocation.lon = position.coords.longitude;
					$scope.currentLocation = $rootScope.currentLocation;
					vm.location.lat = $rootScope.currentLocation.lat;
					vm.location.lon = $rootScope.currentLocation.lon;
					$scope.location.lat = $rootScope.currentLocation.lat;
					$scope.location.lon = $rootScope.currentLocation.lon;
					vm.getDiaChinhInDb(vm.location.lat,vm.location.lon);
					vm.marker.coords.lat = vm.location.lat;
					vm.marker.coords.lon = vm.location.lon;
				}, function(error){
					console.log(error);
				});
			} else {
			}
		}

		//get place in danh muc dia chinh
		//dung voi post-get
		vm.getDiaChinhInDbPostGet = function(lat, lon){
			vm.getGeoCode(lat, lon, function(res){
				if(res.data.results){
					var places = res.data.results;
					var newPlace = places[0];
					for (var i=0; i<places.length; i++) {
						var xa = window.RewayPlaceUtil.getXa(places[i]);
						if (xa != '') {
							newPlace = places[i];
							break;
						}
					}
					var tinh = window.RewayPlaceUtil.getTinh(newPlace);
					var huyen = window.RewayPlaceUtil.getHuyen(newPlace);
					var xa = window.RewayPlaceUtil.getXa(newPlace);
					var diaChinh = {};
					vm.location.tinh = tinh;
					vm.location.huyen = huyen;
					vm.location.xa = xa;
					diaChinh.tinhKhongDau = window.RewayUtil.locDau(tinh);
					diaChinh.huyenKhongDau = window.RewayUtil.locDau(huyen);
					diaChinh.xaKhongDau = window.RewayUtil.locDau(xa);
					var placeType = 'T';
					if (diaChinh.huyenKhongDau)
						placeType = 'H';
					if (diaChinh.xaKhongDau)
						placeType = 'X';
					var diaChinhDto = {
						tinhKhongDau: diaChinh.tinhKhongDau,
						huyenKhongDau: diaChinh.huyenKhongDau,
						xaKhongDau: diaChinh.xaKhongDau,
						placeType: placeType
					}
					HouseService.getPlaceByDiaChinhKhongDau(diaChinhDto).then(function(res){
						if(res){
							vm.diaChinh = res.data.diaChinh;
							vm.duAn = res.data.duAn;
							vm.ads.place.diaChi = vm.diaChinh.fullName;
							vm.ads.place.diaChinh.codeTinh = vm.diaChinh.tinh;
							vm.ads.place.diaChinh.codeHuyen = vm.diaChinh.huyen;
							vm.ads.place.diaChinh.codeXa = vm.diaChinh.xa;
							vm.ads.place.diaChinh.tinh = vm.location.tinh;
							vm.ads.place.diaChinh.huyen = vm.location.huyen;
							vm.ads.place.diaChinh.xa = vm.location.xa;
							vm.ads.place.geo.lat = vm.location.lat;
							vm.ads.place.geo.lon = vm.location.lon;
							console.log(vm.diaChinh);
							console.log(vm.duAn);
						}
					});
				}
			})
		}

		vm.getGeoCodePostGet = function(lat, lon, callback){
			console.log($localStorage.relandToken );
			var url = "https://maps.googleapis.com/maps/api/geocode/json?" +
				"key=AIzaSyDhk9mOXjM79P7ceOceYSCxQO-o9YXCR3A" +
				"&latlng=" + lat + ',' + lon;
			$http.post(url).then(function(res){
				console.log(res);
				callback(res);
				//console.log(res.data.results[0]);
			});
		}

		//get place in danh muc dia chinh
		//dung voi fetch
		vm.getDiaChinhInDb = function(lat, lon, isInit){
			vm.getGeoCode(lat, lon, function(res){
				if(res.results){
					var places = res.results;
					var newPlace = places[0];
					for (var i=0; i<places.length; i++) {
						var xa = window.RewayPlaceUtil.getXa(places[i]);
						if (xa != '') {
							newPlace = places[i];
							break;
						}
					}
					var tinh = window.RewayPlaceUtil.getTinh(newPlace);
					var huyen = window.RewayPlaceUtil.getHuyen(newPlace);
					var xa = window.RewayPlaceUtil.getXa(newPlace);
					var diaChinh = {};
					vm.location.tinh = tinh;
					vm.location.huyen = huyen;
					vm.location.xa = xa;
					diaChinh.tinhKhongDau = window.RewayUtil.locDau(tinh);
					diaChinh.huyenKhongDau = window.RewayUtil.locDau(huyen);
					diaChinh.xaKhongDau = window.RewayUtil.locDau(xa);
					var placeType = 'T';
					if (diaChinh.huyenKhongDau)
						placeType = 'H';
					if (diaChinh.xaKhongDau)
						placeType = 'X';
					var diaChinhDto = {
						tinhKhongDau: diaChinh.tinhKhongDau,
						huyenKhongDau: diaChinh.huyenKhongDau,
						xaKhongDau: diaChinh.xaKhongDau,
						placeType: placeType
					}
					HouseService.getPlaceByDiaChinhKhongDau(diaChinhDto).then(function(res){
						if(res){
							vm.diaChinh = res.data.diaChinh;
							vm.duAn = res.data.duAn;
							vm.ads.place.diaChi = vm.diaChinh.fullName;
							vm.ads.place.diaChinh.codeTinh = vm.diaChinh.tinh;
							vm.ads.place.diaChinh.codeHuyen = vm.diaChinh.huyen;
							vm.ads.place.diaChinh.codeXa = vm.diaChinh.xa;
							vm.ads.place.diaChinh.tinh = vm.location.tinh;
							vm.ads.place.diaChinh.huyen = vm.location.huyen;
							vm.ads.place.diaChinh.xa = vm.location.xa;
							vm.ads.place.geo.lat = vm.location.lat;
							vm.ads.place.geo.lon = vm.location.lon;

							vm.autoCompleteText = vm.diaChinh.fullName;
							if(!isInit)
								$("#duAnLbl").text("");
							console.log(vm.diaChinh);
							console.log(vm.duAn);
						}
					});
				}
			})
		}

		vm.getGeoCode = function(lat,lon,callback){
			var url = "https://maps.googleapis.com/maps/api/geocode/json?" +
				"key=AIzaSyAnioOM0qiWwUoCz8hNS8B2YuzKiYYaDdU" +
				"&latlng=" + lat + ',' + lon;

			return fetch(url)
				.then(response => response.json())
				.then(function (data) {
					console.log(data );
					callback(data);
				})
				.catch(e => e);
		}

		vm.showFullMap =function(){
			vm.showStreetView = false;
			$('#mapsBoxPost').modal("show");
		}

		vm.initMapData = function(){
			$('#mapsBoxPost').on('show.bs.modal', function (e) {
				$timeout(function() {
					if(!vm.fullMapPost){
						vm.fullMapPost = NgMap.initMap('fullMapPost');
						/*var infoWnd = new google.maps.InfoWindow({
							content :  "<font color='#FF0000'>Vị trí lựa chọn</font>",
							position : vm.fullMapPost.getCenter(),
							backgroundColor: 'rgb(57,57,57)',
							borderWidth: 1,
							borderColor: '#2c2c2c',
							disableAutoPan: true
						});
						infoWnd.open(vm.fullMapPost);
						*/
						google.maps.event.addListener(vm.fullMapPost, "click", function(event) {
							vm.location.lat = event.latLng.lat();
							vm.location.lon = event.latLng.lng();
							console.log("------------lat: " + vm.location.lat);
							console.log("------------lon: " + vm.location.lon);
						});

						google.maps.event.addListener(vm.fullMapPost, "center_changed", function() {
							// infoWnd.setContent("<font color='#FF0000'>Vị trí lựa chọn</font>");
							// infoWnd.setPosition(vm.fullMapPost.getCenter());
							// infoWnd.open(vm.fullMapPost);
							vm.location.lat = vm.fullMapPost.getCenter().lat();
							vm.location.lon = vm.fullMapPost.getCenter().lng();
							vm.getDiaChinhInDb(vm.location.lat, vm.location.lon, true);

							console.log("------------lat: " + vm.location.lat);
							console.log("------------lon: " + vm.location.lon);
						});
					}
					/*
					 vm.fullMapPost.getStreetView().setVisible(vm.showStreetView);
					 if(vm.showStreetView == true){
					 console.log("------------show.bs.modal----3------");
					 vm.fullMapPost.getStreetView().setPosition(vm.ads.streetviewLatLng);
					 // vm.showStreetView = false;
					 }*/
				},300);
			});
		}

		vm.initPost = function() {
			//vm.getDanhMucNamXd();
			$("#projectBoxPost .type-list li a").click(function(){
				$(".project-box .collapse-title span label").html($(this).html());
			});
			vm.initMapData();
			initDataPost();
			

			RewayCommonUtil.placeAutoCompletePost(vm.selectPlaceCallback, "searchAddPost");
			$(".btn-more .collapse-title").click(function() {
				$(this).parent().hide(), $(".more-box").removeClass("more-box-hide")
			})



			//vm.updateDrumsPost();

			$(".post").animate({
				right: 0
			}, 120);
			$("body").addClass("bodySearchShow");
			$(".post").scrollTop(0);
			$(".post-footer").addClass("fixed");
			overlay(".overlay");

			Hammer.plugins.fakeMultitouch();
			$("select#yearBuild").drum({
				onChange : function (selected) {
					$("#" + selected.id + "_value").html($(selected).find(":selected").html());
					if(selected.id=="yearBuild"){
						vm.ads.namXayDung = selected.value;
					}
				}
			});
		}
		function initDataPost(){
			if(vm.adsID){
				HouseService.getUpdateAds({adsID: vm.adsID}).then(function(res){
					console.log("-------------------------initData with adsId--------");
					vm.ads = res.data.data;
					console.log(vm.ads);
					if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(function(position){
							console.log(position);
							$rootScope.currentLocation.lat = position.coords.latitude;
							$rootScope.currentLocation.lon = position.coords.longitude;
							$scope.currentLocation = $rootScope.currentLocation;

						}, function(error){
							console.log(error);
						});
					} else {
						console.log("------------not navigator.geolocation----------------");
					}
					if(vm.ads.place.geo){
						vm.location.lat = vm.ads.place.geo.lat;
						vm.location.lon = vm.ads.place.geo.lon;
						$scope.location.lat = vm.ads.place.geo.lat;
						$scope.location.lon = vm.ads.place.geo.lon;
						vm.getDiaChinhInDb(vm.location.lat,vm.location.lon, true);

					}
					if(vm.ads.place.diaChinh.duAn){
						$("#duAnLbl").text(vm.ads.place.diaChinh.duAn.length > 30? vm.ads.place.diaChinh.duAn.substring(0,30) + "..." : vm.ads.place.diaChinh.duAn);
					}

					if(vm.ads.loaiTin==0){
						vm.loaiNhaDat = vm.loaiNhaDatBan;
					}else{
						vm.loaiNhaDat = vm.loaiNhaDatThue;
					}

					if(vm.ads.loaiNhaDat){
						$scope.loaiNhaDat = vm.ads.loaiNhaDat;
					}

					if(vm.ads.loaiNhaDat){
						if(vm.ads.loaiTin == 0){
							for(var i=0; i<vm.loaiNhaDatBan.length; i++){
								if(parseInt(vm.loaiNhaDatBan[i].value) == vm.ads.loaiNhaDat){
									$("#loaiNhaLbl").text(vm.loaiNhaDatBan[i].lable > 30? vm.loaiNhaDatBan[i].lable.substring(0,30) + "..." : vm.loaiNhaDatBan[i].lable);
									break;
								}
							}
						}else {
							for(var i=0; i<vm.loaiNhaDatThue.length; i++){
								if(parseInt(vm.loaiNhaDatThue[i].value) == vm.ads.loaiNhaDat){
									$("#loaiNhaLbl").text(vm.loaiNhaDatThue[i].lable > 30? vm.loaiNhaDatThue[i].lable.substring(0,30) + "..." : vm.loaiNhaDatThue[i].lable);
									break;
								}
							}
						}
					}

					if(vm.ads.huongNha){
						for(var i=0; i<vm.huongNhaList.length; i++){
							if(parseInt(vm.huongNhaList[i].value) == parseInt(vm.ads.huongNha)){
								$("#huongNhaLbl").text(vm.huongNhaList[i].lable > 30? vm.huongNhaList[i].lable.substring(0,30) + "..." : vm.huongNhaList[i].lable);
								break;
							}
						}
					}



					if(vm.ads.gia >= 1000){
						vm.gia = vm.ads.gia/1000;
						vm.gia = Math.round(vm.gia * 1000)/1000;
						vm.loaiGia = vm.loaiGias[1];
						$("#lblGiaPost").text(vm.gia + " Tỷ");
					} else if(vm.ads.gia < 1000 && vm.ads.gia >-1){
						vm.gia = vm.ads.gia;
						vm.loaiGia = vm.loaiGias[0];
						$("#lblGiaPost").text(vm.gia + " Triệu");
					} else{
						vm.gia = null;
						vm.loaiGia = vm.loaiGias[4];
						$("#lblGiaPost").text("Thỏa thuận");
					}

					var lienHeTxt = null;
					if(vm.ads.lienHe.tenLienLac && vm.ads.lienHe.tenLienLac.trim().length > 0){
						lienHeTxt = vm.ads.lienHe.tenLienLac;
					}
					if(vm.ads.lienHe.phone && vm.ads.lienHe.phone.trim().length > 0){
						if(lienHeTxt.trim().length > 0){
							lienHeTxt = lienHeTxt + '-' + vm.ads.lienHe.phone;
						} else{
							lienHeTxt = vm.ads.lienHe.phone;
						}
					}
					$("#lienHeLbl").text(lienHeTxt);

					for(var i=0; i <$scope.namXayDungList.length; i++){
						if($scope.namXayDungList[i].value == parseInt(vm.ads.namXayDung)){
							$("select#yearBuild").drum('setIndex', i);
							$("#yearBuild_value").text(vm.ads.namXayDung);
							break;
						}

					}

				});
			} else{
				vm.ads.image = {};
				vm.ads.image.cover = '';
				vm.ads.image.images = [];

				vm.ads.place={
					diaChi: '',
					diaChinh: {
						codeTinh: '',
						codeHuyen: '',
						codeXa: '',
						codeDuAn: '',
						tinh: '',
						huyen :'',
						xa: '',
						duAn: ''
					},
					geo: {lat: '', lon: ''}
				}
				vm.ads.lienHe={
					showTenLienLac: true,
					showPhone: true,
					showEmail: true,
				};

				vm.ads.chiTiet = '';
				vm.ads.nhaMoiXay = false;
				vm.ads.nhaLoGoc = false;
				vm.ads.otoDoCua = false;
				vm.ads.nhaKinhDoanhDuoc = false;
				vm.ads.noiThatDayDu = false;
				vm.ads.chinhChuDangTin = false;
				if($rootScope.user){
					if($rootScope.user.userName)
						vm.ads.lienHe.tenLienLac = $rootScope.user.userName;
					if($rootScope.user.phone)
						vm.ads.lienHe.phone = $rootScope.user.phone;
					if($rootScope.user.userEmail)
						vm.ads.lienHe.email = $rootScope.user.userEmail;
				}
				vm.selectLoaiTin($scope.loaiTin);
				vm.getCurrentLocation();
			}
		}
		/*
		 var setDrumValues = function(select, value){
		 var options = select[0].options;
		 console.log("---------setDrumValues-----------");
		 console.log("---------1-----------");
		 console.log(options);

		 for(var i =0;i<options.length;i++){
		 console.log(i);
		 console.log(options[i]);
		 if(options[i].value==value){
		 console.log("---vao----");
		 select.drum('setIndex', i);
		 $("#"+select.attr("id") + "_value").html(options[i].label);
		 break;
		 }
		 }

		 }



		 vm.updateDrumsPost = function(){
		 //set years drum
		 var yearXd = vm.ads.namXayDung;
		 var yearXdElm = $("select#yearBuild");
		 console.log("----------updateDrumsPost---------");
		 console.log("----------1---------");
		 console.log(yearXdElm);
		 setDrumValues(yearXdElm, yearXd);
		 }
		 */

		vm.dangTin = function(isValid){

			if (isValid) {
				console.log("--------------dangTin----------------");
				if(vm.ads.place.diaChi){
					if(vm.ads.place.diaChiChiTiet){
						vm.ads.place.diaChi = vm.ads.place.diaChiChiTiet + ", " + vm.ads.place.diaChi;
					}
				}
				if($rootScope.user){
					vm.ads.dangBoi = {};
					if($rootScope.user.userName){
						vm.ads.dangBoi.name = $rootScope.user.userName;
					}
					if($rootScope.user.phone){
						vm.ads.dangBoi.name = $rootScope.user.phone;
					}
					if($rootScope.user.userEmail){
						vm.ads.dangBoi.email = $rootScope.user.userEmail;
					}
					if($rootScope.user.userID){
						vm.ads.dangBoi.userID = $rootScope.user.userID;
					}
				}

				vm.ads.duongTruocNha = parseFloat(vm.ads.duongTruocNha);
				vm.ads.matTien = parseFloat(vm.ads.matTien);
				vm.ads.huongNha = parseFloat(vm.ads.huongNha);

				if(vm.gia)
					vm.gia = parseFloat(vm.gia);
				if(vm.ads.dienTich)
					vm.ads.dienTich = parseFloat(vm.ads.dienTich);

				if(vm.loaiGia.value==0){
					vm.ads.gia = -1;
					vm.ads.giaM2 = -1;
				} else if(vm.loaiGia.value == 1){
					vm.ads.gia = vm.gia;
					var giaM2 =  vm.ads.gia/vm.ads.dienTich;
					giaM2 = parseFloat(giaM2);
					vm.ads.giaM2 = Math.round(giaM2 * 1000)/1000;
				} else if(vm.loaiGia.value == 2){
					vm.ads.gia = vm.gia * 1000;
					var giaM2 =  vm.ads.gia/vm.ads.dienTich;
					giaM2 = parseFloat(giaM2);
					vm.ads.giaM2 = Math.round(giaM2 * 1000)/1000;
				} else if(vm.loaiGia.value == 3){
					vm.ads.giaM2 = vm.gia/10;
					var gia = vm.ads.giaM2 * vm.ads.dienTich;
					gia =  parseFloat(gia);
					vm.ads.gia = Math.round(gia * 1000)/1000;
				} else if(vm.loaiGia.value == 4){
					vm.ads.giaM2 = vm.gia;
					var gia = vm.ads.giaM2 * vm.ads.dienTich;
					gia =  parseFloat(gia);
					vm.ads.gia = Math.round(gia * 1000)/1000;
				}

				console.log("------------danTin-------------1-------------");
				console.log(vm.ads);

				var adsDto = JSON.stringify(vm.ads);

				HouseService.postAds(adsDto).then(function(res){
					console.log("------------HouseService.postAds-------------");
					console.log(res);
					$state.go('madsMgmt');
				})
			} else {
				console.log("--------------invalid----------------");
				console.log(angular.element('input.ng-invalid').first());
				angular.element('input.ng-invalid').first().focus();
			}

		}

		vm.selectLoaiTin = function(loaiTin){
			console.log("--------------selectLoaiTin----------------");
			$scope.loaiTin = loaiTin;
			if(loaiTin==0){
				vm.loaiNhaDat = vm.loaiNhaDatBan;
			}else{
				vm.loaiNhaDat = vm.loaiNhaDatThue;
			}

			if(vm.ads.loaiTin != loaiTin){
				vm.ads.loaiTin = loaiTin;
				vm.ads.loaiNhaDat = 0;
				$scope.loaiNhaDat = null;
				$("#loaiNhaLbl").text("Bất kỳ");
			}
		}

		vm.selectLoaiNhaDat = function(lnd){
			vm.ads.loaiNhaDat = parseFloat(lnd.value);
			if(vm.ads.loaiTin==0){
				if(vm.ads.loaiNhaDat == 0){
					$scope.loaiNhaDat = null;
				} else{
					$scope.loaiNhaDat = vm.ads.loaiNhaDat;
				}
				$("#loaiNhaLbl").text(lnd.lable);
			} else{
				if(vm.ads.loaiNhaDat == 0){
					$scope.loaiNhaDat = null;
				} else{
					$scope.loaiNhaDat = vm.ads.loaiNhaDat;
				}
				$("#loaiNhaLbl").text(lnd.lable);
			}

		}

		vm.selectLoaiNhaDat(vm.loaiNhaDatBan[0]);

		vm.selectHuongNha = function(hn){
			vm.ads.huongNha = hn.value;
			$("#huongNhaLbl").text(hn.lable);
		}

		vm.selectLoaiGia = function(lg){
			vm.loaiGia = lg;
			if(vm.loaiGia.value==0){
				vm.ads.gia = -1;
				vm.ads.giaM2 = -1;
				$("#giaTienPost").prop("readonly", true);
				$("#lblGiaPost").text(vm.loaiGia.lable);
			}else{
				$("#giaTienPost").prop("readonly", false);
				if(vm.gia && vm.gia > 0){
					vm.gia = parseFloat(vm.gia);
					$("#lblGiaPost").text(vm.gia + " " + vm.loaiGia.lable);
					if(vm.loaiGia.value == 1){
						vm.ads.gia = vm.gia;
						var giaM2 =  vm.ads.gia/vm.ads.dienTich;
						giaM2 = parseFloat(giaM2);
						vm.ads.giaM2 = Math.round(giaM2 * 1000)/1000;
					} else if(vm.loaiGia.value == 2){
						vm.ads.gia = vm.gia * 1000;
						var giaM2 =  vm.ads.gia/vm.ads.dienTich;
						giaM2 = parseFloat(giaM2);
						vm.ads.giaM2 = Math.round(giaM2 * 1000)/1000;
					} else if(vm.loaiGia.value == 3){
						vm.ads.giaM2 = vm.gia/10;
						var gia = vm.ads.giaM2 * vm.ads.dienTich;
						gia =  parseFloat(gia);
						vm.ads.gia = Math.round(gia * 1000)/1000;
					} else if(vm.loaiGia.value == 4){
						vm.ads.giaM2 = vm.gia;
						var gia = vm.ads.giaM2 * vm.ads.dienTich;
						gia =  parseFloat(gia);
						vm.ads.gia = Math.round(gia * 1000)/1000;
					}
				}
			}
		}

		vm.changeGiaTien = function(){
			if(vm.loaiGia.value==0){
				vm.ads.gia = -1;
				vm.ads.giaM2 = -1;
				$("#lblGiaPost").text(vm.loaiGia.lable);
			} else {
				$("#lblGiaPost").text(vm.gia + " " + vm.loaiGia.lable);
				vm.gia = parseFloat(vm.gia);
				if(vm.loaiGia.value == 1){
					vm.ads.gia = vm.gia;
					var giaM2 =  vm.ads.gia/vm.ads.dienTich;
					giaM2 = parseFloat(giaM2);
					vm.ads.giaM2 = Math.round(giaM2 * 1000)/1000;
				} else if(vm.loaiGia.value == 2){
					vm.ads.gia = vm.gia * 1000;
					var giaM2 =  vm.ads.gia/vm.ads.dienTich;
					giaM2 = parseFloat(giaM2);
					vm.ads.giaM2 = Math.round(giaM2 * 1000)/1000;
				} else if(vm.loaiGia.value == 3){
					vm.ads.giaM2 = vm.gia/10;
					var gia = vm.ads.giaM2 * vm.ads.dienTich;
					gia =  parseFloat(gia);
					vm.ads.gia = Math.round(gia * 1000)/1000;
				} else if(vm.loaiGia.value == 4){
					vm.ads.giaM2 = vm.gia;
					var gia = vm.ads.giaM2 * vm.ads.dienTich;
					gia =  parseFloat(gia);
					vm.ads.gia = Math.round(gia * 1000)/1000;
				}
			}
		}

		vm.selectDuAn = function(da){
			vm.ads.place.diaChinh.codeDuAn = da.duAn;
			vm.ads.place.diaChinh.duAn = da.fullName;
			$("#duAnLbl").text(da.placeName.length > 30? da.placeName.substring(0,30) + "..." : da.placeName);
			console.log(vm.ads.place.diaChinh.codeDuAn);
		}

		vm.setSoPhongNgu = function (value) {
			console.log(vm.ads.namXayDung);
			vm.ads.soPhongNgu = value;
			console.log(vm.ads.soPhongNgu);
			if(vm.ads.soPhongNgu && (vm.ads.soPhongNgu != $scope.soPhongNgu)){
				$scope.soPhongNgu = '';
			}
		}
		vm.setSoTang = function (value) {
			vm.ads.soTang = value;
			console.log(vm.ads.soTang);
			if(vm.ads.soTang && (vm.ads.soTang != $scope.soTang)){
				$scope.soTang = '';
			}
		}

		vm.setSoPhongTam = function (value) {
			vm.ads.soPhongTam = value;
			console.log(vm.ads.soPhongTam);
			if(vm.ads.soPhongTam && (vm.ads.soPhongTam != $scope.soPhongTam)){
				$scope.soPhongTam = '';
			}
		}

		vm.toggleShowTenLL = function () {
			vm.ads.lienHe.showTenLienLac = !vm.ads.lienHe.showTenLienLac;

		}

		vm.toggleShowPhone = function () {
			vm.ads.lienHe.showPhone = !vm.ads.lienHe.showPhone;

		}

		vm.toggleShowEmail = function () {
			vm.ads.lienHe.showEmail = !vm.ads.lienHe.showEmail;

		}

		vm.changeLienHeLbl = function(hn){
			var lienHeTxt = '';
			if(vm.ads.lienHe.tenLienLac && vm.ads.lienHe.tenLienLac.trim().length > 0){
				lienHeTxt = vm.ads.lienHe.tenLienLac;
			}
			if(vm.ads.lienHe.phone && vm.ads.lienHe.phone.trim().length > 0){
				if(lienHeTxt.trim().length > 0){
					lienHeTxt = lienHeTxt + '-' + vm.ads.lienHe.phone;
				} else{
					lienHeTxt = vm.ads.lienHe.phone;
				}
			}
			$("#lienHeLbl").text(lienHeTxt);
		}

		vm.spinner = function(event, box, item){
			var me = event.target;
			me = $(me).closest('a')
			if(me.parent().find($(box)).hasClass(item)) {
				me.parent().find($(box)).removeClass(item);
				me.find("i").addClass("iconUpOpen").removeClass("iconDownOpen");
			}
			else {
				me.parent().find($(box)).addClass(item);
				me.find("i").addClass("iconDownOpen").removeClass("iconUpOpen");
			}
		}


		$timeout(function() {
			vm.initPost();
		},300);

		$scope.uploadFiles = function (files) {
			var async = require("async");
			if($rootScope.isLoggedIn()==false){
				$scope.$bus.publish({
					channel: 'login',
					topic: 'show login',
					data: {label: "Đăng nhập để lưu BĐS"}
				});
				return;
			}

			$scope.files = files;
			if (files && files.length) {

				async.forEach(files,function(myFile){
					var fileName = myFile.name;
					console.log(fileName);
					fileName = fileName.substring(fileName.lastIndexOf("."), fileName.length);
					fileName = "Ads_" + $rootScope.user.userID + "_" + new Date().getTime() + fileName;

					Upload.upload({
						url: '/api/upload',
						data: {files: myFile, filename : fileName}
					}).then(function (resp) {
						console.log('Success ' + resp.config.data.files.name + 'uploaded. Response: ' + resp.data);

						$timeout(function() {
							var fileUrl = location.protocol;
							fileUrl = fileUrl.concat("//").concat(window.location.host).concat(resp.data.file.url);

							console.log("----fileUrl: " + fileUrl);
							if(vm.ads.image.cover.trim().length == 0){
								vm.ads.image.cover = fileUrl;
							} else{
								vm.ads.image.images.push(fileUrl);
							}
						},100);

					}, function (resp) {
						console.log('Error status: ' + resp.status);
					}, function (evt) {
						var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
						console.log('progress: ' + progressPercentage + '% ' + evt.config.data.files.name);
					});
				}, function(err){
					if(err){throw err;}
					console.log("processing all elements completed");
				});
			}
		};
	});
})();
