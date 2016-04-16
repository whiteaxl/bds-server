(function() {
	'use strict';
	var controllerId = 'MainCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope,$http, $scope,$state,HouseService){
		var vm = this;
		init();
		//vm.initData = initData;
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
		
		$scope.$on('$viewContentLoaded', function(){
			//addCrudControls
			window.DesignCommon.adjustPage();
			if($state.current.data)
				$scope.bodyClass = $state.current.data.bodyClass
			// window.onresize = function() {
			//     window.DesignCommon.resizePage();
			// }
		});
		
		
		/*$scope.markers = [{
			id: 0,
			coords: {
				latitude: 10.762622,
				longitude: 106.660172
			},
			data: 'restaurant'
		}, {
			id: 1,
			coords: {
				latitude: 21.033333,
				longitude: 105.849998
			},
			data: 'house'
		}, {
			id: 2,
			coords: {
				latitude: 16.0439,
				longitude: 108.199
			},
			data: 'hotel'
		}];*/
		var _selected;
  		$scope.selected = undefined;
  		$scope.selected = undefined;
  $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
  		$scope.getLocation = function(val) {
    return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: val,
        sensor: false
      }
    }).then(function(response){
      return response.data.results.map(function(item){
        return item.formatted_address;
      });
    });
  };
$scope.ngModelOptionsSelected = function(value) {
    if (arguments.length) {
      _selected = value;
    } else {
      return _selected;
    }
  };

  $scope.modelOptions = {
    debounce: {
      default: 500,
      blur: 250
    },
    getterSetter: true
  };
		vm.createHouse = function(desc,seller,email){
        	vm.getLocation();
        	return;
        	HouseService.createHouse(desc,seller,email).then(function(res){
				//vm.sellingHouses = res.data;
				alert(res.data);
			});
			//alert("done");

		}
		vm.detailHouse = function(){
			alert('todo');

		}
		function init(){
			$scope.map = {center: {latitude: 16.0439, longitude: 108.199 }, zoom: 10 , control: {}};
			$scope.options = {scrollwheel: false,labelContent: 'gia'};
			$scope.markerCount = 3;
			$scope.markers = [];
			$scope.initData = window.initData;
			$scope.hot_ads_cat = window.hot_ads_cat;
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

	});

	// /* @ngInject */
	// function MainCtrl() {
		
	// }
})();
