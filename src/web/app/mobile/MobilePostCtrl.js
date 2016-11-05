(function() {
	'use strict';

	var controllerId = 'MobilePostCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, Upload, $state, HouseService, NewsService, NgMap, $window,$timeout,$location,$localStorage){
		var vm = this;

		var chicago = new google.maps.LatLng(41.850033, -87.6500523);
		vm.click = function() {
			vm.map.setCenter(chicago);
		};
		vm.ads = {};
		$scope.loaiTin = 0;
		$scope.soPhongNgu;
		$scope.soPhongTam;
		$scope.soTang;
		vm.showStreetView = false;
		$scope.currentYear = new Date().getFullYear();
		vm.loaiNhaDatBan = window.RewayListValue.LoaiNhaDatBanWeb;
		vm.loaiNhaDatThue = window.RewayListValue.LoaiNhaDatThueWeb;
		vm.dacTinhNha = window.RewayListValue.DacTinhNha;
		vm.huongNhaList = window.RewayListValue.getNameValueArray(window.RewayListValue.HuongNha);
		$scope.namXayDungList = [
			{ value: $scope.currentYear, lable: "Năm " + $scope.currentYear },
			{ value: $scope.currentYear-1, lable: "Năm " + ($scope.currentYear -1) },
			{ value: $scope.currentYear-2, lable: "Năm " + ($scope.currentYear -2) },
			{ value: $scope.currentYear-3, lable: "Năm " + ($scope.currentYear -3) },
			{ value: $scope.currentYear-4, lable: "Năm " + ($scope.currentYear -4) },
			{ value: $scope.currentYear-5, lable: "Năm " + ($scope.currentYear -5) },
			{ value: $scope.currentYear-6, lable: "Năm " + ($scope.currentYear -6) },
			{ value: $scope.currentYear-7, lable: "Năm " + ($scope.currentYear -7) },
			{ value: $scope.currentYear-8, lable: "Năm " + ($scope.currentYear -8) },
			{ value: $scope.currentYear-9, lable: "Năm " + ($scope.currentYear -9) }
		];

		$(".btn-more .collapse-title").click(function() {
			$(this).parent().hide(), $(".more-box").removeClass("more-box-hide")
		})

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

		vm.showFullMap =function(){
			console.log("------------showFullMap----------");
			vm.showStreetView = false;
			$('#mapsBoxPost').modal("show");
		}

		vm.initMapData = function(){
			$('#mapsBoxPost').on('show.bs.modal', function (e) {
				$timeout(function() {
					console.log("----------post--show modal- new123----------");
					if(!vm.fullMapPost){
						console.log("------------show.bs.modal-----1-----");
						vm.fullMapPost = NgMap.initMap('fullMapPost');
						console.log("------------show.bs.modal----2------");
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
			initDataPost();
			vm.initMapData();
			$(".btn-more .collapse-title").click(function() {
				$(this).parent().hide(), $(".more-box").removeClass("more-box-hide")
			})

			NgMap.getMap().then(function(map) {
				vm.fullMapPost = map;
			});

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
			console.log('--------innitData-------------------' );
			vm.ads.image = {};
			vm.ads.image.cover = '';
			vm.ads.image.images = [];
			vm.ads.loaiTin = 0;
			vm.ads.lienHe={
				showTenLienLac: false,
				showPhone: false,
				showEmail: false
			};
			vm.ads.chiTiet = '';
			vm.ads.nhaMoiXay = false;
			vm.ads.nhaLoGoc = false;
			vm.ads.otoDoCua = false;
			vm.ads.nhaKinhDoanhDuoc = false;
			vm.ads.noiThatDayDu = false;
			vm.ads.chinhChuDangTin = false;
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


		vm.selectLoaiTin = function(loaiTin){
			console.log('--------selectLoaiTin-------------------' );
			$scope.loaiTin = loaiTin;
			vm.ads.loaiTin = loaiTin;
			if(vm.ads.loaiTin==0){
				vm.loaiNhaDat = vm.loaiNhaDatBan;
			}else{
				vm.loaiNhaDat = vm.loaiNhaDatThue;
			}
		}
		vm.selectLoaiTin($scope.loaiTin);

		vm.selectLoaiNhaDat = function(lnd){
			vm.ads.loaiNhaDat = [lnd.value];
			$("#loaiNhaLbl").text(lnd.lable);
		}

		vm.selectHuongNha = function(hn){
			vm.ads.huongNha = [hn.value];
			$("#huongNhaLbl").text(hn.lable);
		}

		vm.setSoPhongNgu = function (value) {
			console.log("-----setSoPhongNgu-----");
			console.log(vm.ads.namXayDung);
			vm.ads.soPhongNgu = value;
			console.log(vm.ads.soPhongNgu);
			if(vm.ads.soPhongNgu && (vm.ads.soPhongNgu != $scope.soPhongNgu)){
				$scope.soPhongNgu = '';
			}
		}
		vm.setSoTang = function (value) {
			console.log("-----setSoTang-----");
			vm.ads.soTang = value;
			console.log(vm.ads.soTang);
			if(vm.ads.soTang && (vm.ads.soTang != $scope.soTang)){
				$scope.soTang = '';
			}
		}

		vm.setSoPhongTam = function (value) {
			console.log("-----setSoPhongTam-----");
			vm.ads.soPhongTam = value;
			console.log(vm.ads.soPhongTam);
			if(vm.ads.soPhongTam && (vm.ads.soPhongTam != $scope.soPhongTam)){
				$scope.soPhongTam = '';
			}
		}

		vm.toggleShowTenLL = function () {
			vm.ads.lienHe.showTenLienLac = !vm.ads.lienHe.showTenLienLac;
			console.log("------------toggleShowTenLL: " + vm.ads.lienHe.showTenLienLac);

		}

		vm.toggleShowPhone = function () {
			vm.ads.lienHe.showPhone = !vm.ads.lienHe.showPhone;
			console.log("------------toggleShowPhone: " + vm.ads.lienHe.showPhone);

		}

		vm.toggleShowEmail = function () {
			vm.ads.lienHe.showEmail = !vm.ads.lienHe.showEmail;
			console.log("------------toggleShowEmail: " + vm.ads.lienHe.showEmail);

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
		},0);

		$scope.uploadFiles = function (files) {
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
				angular.forEach(files, function (myFile) {
					var fileName = myFile.name;
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
				});
			}
		};
	});
})();
