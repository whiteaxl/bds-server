(function() {
	'use strict';
	var controllerId = 'DangTinCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope,$http, $scope,$state,HouseService,NgMap,$window,$timeout,Upload){
		var vm = this;
		vm.loaiNhaDatBan = window.RewayListValue.LoaiNhaDatBanWeb;
		vm.soPhongNguList = window.RewayListValue.getNameValueArray(window.RewayListValue.SoPhongNgu);
		vm.soPhongTamList = window.RewayListValue.getNameValueArray(window.RewayListValue.SoPhongTam);
		vm.soTangList = window.RewayListValue.getNameValueArray(window.RewayListValue.SoTang);
		vm.huongNhaList = window.RewayListValue.getNameValueArray(window.RewayListValue.HuongNha);
		//vm.soTang = vm.soTangList[0];
		vm.ads = {
			soPhongNgu: vm.soPhongNguList[0],
			soPhongTam: vm.soPhongTamList[0],
			soTang: vm.soTangList[0],
			huongNha: vm.huongNhaList[0],
			status: 1,
			place:{
				diaChi: undefined
			},
			images: [
				{
					url: "/web/asset/img/reland_house_large.jpg",
					name: "Ảnh đại diện"
				}
			]
		};
		vm.center = "Hanoi Vietnam";
		vm.markers = [];
		NgMap.getMap().then(function(map){
			window.RewayClientUtils.createPlaceAutoComplete(vm.selectPlaceCallback,"autocomplete",map);
        	$scope.PlacesService =  new google.maps.places.PlacesService(map);
        	$scope.map = map;
		});

		
		vm.getMapPos = function(event){
			var marker = {
    				id: -1,
    				coords: {latitude: event.latLng.lat(), longitude: event.latLng.lng()},
    				content: 'you are here'
    		}
    		vm.markers = [];
    		vm.markers.push(marker);
		}
		vm.selectPlaceCallback = function(place){
			$scope.searchPlaceSelected = place;
    		$scope.placeSearchId = place.place_id;
    		vm.diaChinh = window.RewayPlaceUtil.getDiaChinhFromGooglePlace(place);
    		vm.center = "[" + place.geometry.location.lat() + ", " + place.geometry.location.lng() + "]";
    		vm.ads.place.diaChi = place.formatted_address;
    		$scope.$apply();
		}

		vm.dangTin = function(){

		}
		vm.catchImageFile = function (file){
	    	if(!file)
	    		return false;
	        var filetype = file.type.substring(0,file.type.indexOf('/'));
			if (filetype == "image") {
				return true;
			}else{
				return false;
			}		
	    }
	    vm.addImage = function(file){
	    	if(vm.ads.images.length==1 && vm.ads.images[0].url == "/web/asset/img/reland_house_large.jpg"){
	    		vm.ads.images[0].url = file.url;
	    		vm.ads.images[0].name = file.name;
	    	}else{
	    		vm.ads.images.push(file);
	    	}
	    }
	    vm.removeImage =function(index){
	    	vm.ads.images.splice(index,1);
	    }

		vm.uploadFiles = function (files) {
	        vm.files = files;
	        //var msg = $scope.getMessage();
	        if (files && files.length) {
	        	for (var i = 0; i < files.length; i++){
	        		var isImageFile = vm.catchImageFile(files[i]);	     	        		
	        		Upload.upload({
			            url: '/api/upload',
			            data: {file: files[i], filename: files[i].name}
			        }).then(function (resp) {
			            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
			            vm.addImage(resp.data.file);
			        }, function (resp) {
			            console.log('Error status: ' + resp.status);
			        }, function (evt) {
			            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
			        });
	        		
	        	}            
	        }
	    };

	});
})();