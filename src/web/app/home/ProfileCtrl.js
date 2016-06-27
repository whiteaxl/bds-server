(function() {
	'use strict';
	var controllerId = 'ProfileCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope,$http, $scope,$state,HouseService,Upload,NgMap,$window,$timeout){
		var vm = this;
		vm.viewMap = false;
		$scope.chat_visible = true;
		$scope.$on('$viewContentLoaded', function(){
			$timeout(function() {
				window.DesignCommon.adjustPage();
			},0);
			if($state.current.data){
				$rootScope.bodyClass = "page-home";
			}
		});	
		vm.init = function(){
			vm.userID = $state.params.userID;
			HouseService.profile({userID: vm.userID}).then(function(res){
				if(res.data.success == true){
					vm.user = res.data.user;	
					vm.original =  angular.copy(vm.user);
				}				
			});
		}

		vm.init();

		vm.prepareUpdateProfileData = function(){
			return {
				newPass: vm.newPass,
				userID: vm.user.id,
				email: vm.user.email,
				phone: vm.user.phone,
				fullName: vm.user.fullName,
				diaChi: vm.user.diaChi,
				avatar: vm.user.avatar
			};
		}


		vm.updateProfile = function(callback){
			var data = vm.prepareUpdateProfileData();
			HouseService.updateProfile(data).then(function(res){
				console.log(JSON.stringify(res));
				vm.edit = false;
				if(callback)
					callback(res);
			});
		}
		vm.reset = function(){
			//$('#form-register').reset();
			vm.user = angular.copy(vm.original);
			vm.edit = false;
		}
		vm.uploadFile = function(file){
			var data = vm.prepareUpdateProfileData();
			// var ft = vm.catchFile(files[i]);
   //  		var isImageFile = (ft == "image");
    		
    		Upload.upload({
	            url: '/api/upload',
	            data: {files: file}
	        }).then(function (resp) {
	            console.log('Success ' + resp.config.data.files.name + 'uploaded. Response: ' + resp.data);
	            //here we need to emit message
	            // if(ft == "image")
	            // 	vm.sendImage(resp.data.image_file);
	            // else
	            vm.user.avatar = resp.data.file.url;
	            vm.updateProfile(function(res){
	            	$('[data-close="avatar"]').click();
	            });

	        }, function (resp) {
	            console.log('Error status: ' + resp.status);
	        }, function (evt) {
	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	            //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
	        });	        
		}


	});

})();