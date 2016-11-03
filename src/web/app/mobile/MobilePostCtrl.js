(function() {
	'use strict';
	var controllerId = 'MobilePostCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, Upload, $state, HouseService, NewsService, NgMap, $window,$timeout,$location,$localStorage){
		var vm = this;
		vm.ads = {};
		$scope.loaiTin = 0;
		$scope.soPhongNgu;
		$scope.soPhongTam;
		$scope.soTang;
		$scope.currentYear = new Date().getFullYear();
		vm.loaiNhaDatBan = window.RewayListValue.LoaiNhaDatBanWeb;
		vm.loaiNhaDatThue = window.RewayListValue.LoaiNhaDatThueWeb;
		vm.huongNhaList = window.RewayListValue.getNameValueArray(window.RewayListValue.HuongNha);
		vm.namXayDungList1 = [$scope.currentYear,$scope.currentYear - 1, $scope.currentYear - 2, $scope.currentYear - 3,
			$scope.currentYear - 4, $scope.currentYear - 5, $scope.currentYear - 6, $scope.currentYear - 7,
			$scope.currentYear - 8, $scope.currentYear - 9
		];

		$(".btn-more .collapse-title").click(function() {
			$(this).parent().hide(), $(".more-box").removeClass("more-box-hide")
		})
		$scope.namXayDungList = [
			{
				value: "19810101",
				lable: "Bất kỳ"
			},
			{
				value: Date.today().add(-1).days().toString('yyyyMMdd'),
				lable: "1 ngày"
			},
			{
				value: Date.today().add(-2).days().toString('yyyyMMdd'),
				lable: "2 ngày"
			},
			{
				value: Date.today().add(-3).days().toString('yyyyMMdd'),
				lable: "3 ngày"
			},
			{
				value: Date.today().add(-5).days().toString('yyyyMMdd'),
				lable: "5 ngày"
			},
			{
				value: Date.today().add(-7).days().toString('yyyyMMdd'),
				lable: "7 ngày"
			},
			{
				value: Date.today().add(-14).days().toString('yyyyMMdd'),
				lable: "14 ngày"
			},
			{
				value: Date.today().add(-30).days().toString('yyyyMMdd'),
				lable: "30 ngày"
			},
			{
				value: Date.today().add(-90).days().toString('yyyyMMdd'),
				lable: "90 ngày"
			}
		];

		$scope.upDateList = function(){
			console.log("------------upDateList-------");
			vm.namXayDungList = [
				{
					value: "19810101",
					lable: "Bất kỳ"
				},
				{
					value: Date.today().add(-1).days().toString('yyyyMMdd'),
					lable: "1 ngày"
				},
				{
					value: Date.today().add(-2).days().toString('yyyyMMdd'),
					lable: "2 ngày"
				},
				{
					value: Date.today().add(-3).days().toString('yyyyMMdd'),
					lable: "3 ngày"
				},
				{
					value: Date.today().add(-5).days().toString('yyyyMMdd'),
					lable: "5 ngày"
				},
				{
					value: Date.today().add(-7).days().toString('yyyyMMdd'),
					lable: "7 ngày"
				},
				{
					value: Date.today().add(-14).days().toString('yyyyMMdd'),
					lable: "14 ngày"
				},
				{
					value: Date.today().add(-30).days().toString('yyyyMMdd'),
					lable: "30 ngày"
				},
				{
					value: Date.today().add(-90).days().toString('yyyyMMdd'),
					lable: "90 ngày"
				}
			];
		}

		vm.initPost = function() {
			initDataPost();
			$(".btn-more .collapse-title").click(function() {
				$(this).parent().hide(), $(".more-box").removeClass("more-box-hide")
			})

			vm.updateDrumsPost();

			$(".post").animate({
				right: 0
			}, 120);
			$("body").addClass("bodySearchShow");
			$(".post").scrollTop(0);
			$(".post-footer").addClass("fixed");
			overlay(".overlay");

			Hammer.plugins.fakeMultitouch();
			$("select.drum").drum({
				onChange : function (selected) {
					console.log("------------drum-aaaaaaaaaaaaaaa---------");
					console.log(selected);
					$("#" + selected.id + "_value").html($(selected).find(":selected").html());
					let array = JSON.parse(selected.value);
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
			vm.ads.namXayDung = $rootScope.searchData.ngayDangTinGREATER;
		}

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

		vm.initPost();

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
