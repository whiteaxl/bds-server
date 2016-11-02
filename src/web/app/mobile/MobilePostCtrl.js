(function() {
	'use strict';
	var controllerId = 'MobilePostCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, Upload, $state, HouseService, NewsService, NgMap, $window,$timeout,$location,$localStorage){
		var vm = this;
		vm.ads = {};
		$scope.count = 0;
		$scope.uploadDir = '//web//upload';
		vm.init = function(){
			vm.initData();
			$(".post").animate({
				right: 0
			}, 120);
			$("body").addClass("bodySearchShow");
			$(".post").scrollTop(0);
			$(".post-footer").addClass("fixed");
			overlay(".overlay");
		}
		vm.initData = function(){
			console.log('--------innitData-------------------' );
			vm.ads.image = {};
			vm.ads.image.cover = '';
			vm.ads.image.images = [];
		}
		vm.init();



		$scope.uploadFiles = function (files) {
			console.log('--------uploadFiles---------------------' );
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
				for (var i = 0; i < files.length; i++){
					$scope.count = i;
					var fileName = files[i].name;
					fileName = fileName.substring(fileName.lastIndexOf("."), fileName.length);
					fileName = "Ads_" + $rootScope.user.userID + "_" + new Date().getTime() + fileName;

					Upload.upload({
						url: '/api/upload',
						data: {files: files[i], filename : fileName}
					}).then(function (resp) {
						console.log('Success ' + resp.config.data.files.name + 'uploaded. Response: ' + resp.data);


						$timeout(function() {
							var fileUrl = location.protocol;
							fileUrl = fileUrl.concat("//").concat(window.location.host).concat(resp.data.file.url);

							console.log("----fileUrl: " + fileUrl);
							if(($scope.count == 0) && (vm.ads.image.cover.trim().length == 0)){
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

				}
			}
		};
	});
})();
