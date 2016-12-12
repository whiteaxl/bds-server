(function() {
	'use strict';
	var controllerId = 'MobileHomeCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, $state, HouseService, NewsService, NgMap, $window,$timeout,$location,$localStorage){
		var vm = this;
		/*
		var query = { 
			loaiTin: 0,
		   //giaBETWEEN: [ 0, 9999999 ],
		   soPhongNguGREATER: '0',
		   soTangGREATER: '0',
		   soPhongTamGREATER: '0',
		   dienTichBETWEEN: [ 0, 9999999 ],
		   limit: 200
		   // polygon: []
	   	}*/
	   	// vm.showAskCurrentLocation = false;
	   	var homeDataSearch = {
          timeModified: undefined,
          query: undefined,
          currentLocation : undefined
        }
        if($rootScope.getLastSearch($localStorage)){
			homeDataSearch.query = $rootScope.getLastSearch($localStorage).query;
			homeDataSearch.query.updateLastSearch = false;
		}
     //    $rootScope.currentLocation.lat = 20.9898098;
    	// $rootScope.currentLocation.lon = 105.7098334;
    	homeDataSearch.currentLocation = $rootScope.currentLocation;

        vm.getLocation = function() {
        	/*function fetchHomeData(){
        		var async = require("async");
			  	vm.boSuuTap = [];
			  	var fl = window.RewayUtil.generateHomeSearchSeries(homeDataSearch.query,homeDataSearch.currentLocation,HouseService.findAdsSpatial,function(res){
	      			if(res.data.list && res.data.list.data.length>=5)
	      				vm.boSuuTap.push(res.data.list);
	      			//alert(res.data.length);
	      		});
		        async.series(fl,
		          function(err, results){
		            // alert(results.length);
		            vm.doneSearch = true;
		          }
			    );
        	}*/

		    if (navigator.geolocation) {
		        navigator.geolocation.getCurrentPosition(function(position){
		        	$rootScope.currentLocation.lat = position.coords.latitude;
		        	$rootScope.currentLocation.lon = position.coords.longitude;
					homeDataSearch.currentLocation = $rootScope.currentLocation;
					HouseService.homeDataForApp(homeDataSearch).then(function(res){
						//alert(JSON.stringify(res));
						vm.boSuuTap = [];
						res.data.data.forEach(function(item,index){
							if(item.data.length>0)
								vm.boSuuTap.push(item);
						});
						vm.doneSearch = true;
						$timeout(function() {
		                    $('body').scrollTop(0);
		                },0);						
					});
		        }, function(error){
		        	console.log(error);		        	
		        });
		    } else {
				homeDataSearch.currentLocation = $rootScope.currentLocation;
				HouseService.homeDataForApp(homeDataSearch).then(function(res){
					//alert(JSON.stringify(res));
					vm.boSuuTap = [];
					res.data.data.forEach(function(item,index){
						if(item.data.length>0)
							vm.boSuuTap.push(item);
					});
					vm.doneSearch = true;
					$timeout(function() {
	                    $('body').scrollTop(0);
	                },0);
				});
		    }

		}		

		vm.likeAds = function(event,adsID){
		  event.stopPropagation();
	      if(!$rootScope.user.userID){
	        $scope.$bus.publish({
              channel: 'login',
              topic: 'show login',
              data: {label: "Đăng nhập để lưu BĐS"}
	        });

	        return;
	      }
			if(!$rootScope.user.adsLikes){
				$rootScope.user.adsLikes = [];
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
		vm.showMore = function(index){
			var query =  {};
			//Object.assign( query,vm.boSuuTap[index].query);
			_.assign(query,vm.boSuuTap[index].query);
			query.limit = 20;
			query.duAnID = vm.boSuuTap[index].query.duAnID;
			let pid = query.place?(query.place.placeId || query.place.place_id):undefined;
			if(query.dbLimit)
				query.dbLimit = undefined;
			if(query.dbOrderBy)
				query.dbOrderBy = undefined;
			if(query.dbPageNo)
				query.dbPageNo = undefined;
			// $state.go('msearch',{place: pid,loaiTin: query.loaiTin, loaiNhaDat:query.loaiNhaDat,viewMode: "list", query: query})			
			$rootScope.headerInfo.listMoreFirstTitle = vm.boSuuTap[index].title1;
			$rootScope.headerInfo.listMoreSecondTitle = vm.boSuuTap[index].title2;

			$state.go('mlistMore',{place: pid,loaiTin: query.loaiTin, loaiNhaDat:query.loaiNhaDat,viewMode: "list", query: query})			
			

			//$state.go('msearch', { "place" : $scope.placeSearchId, "loaiTin" : $scope.loaiTin, "loaiNhaDat" : $scope.loaiNhaDat, "viewMode": vm.viewMode}, {location: true});
			//alert('showmore');
		}
		

		vm.init = function(){
			vm.getLocation();
			if($rootScope.currentLocation){
				if($rootScope.lastSearch){
					var queryNearBy = {};
					//nhannc modify to advoid error when Object.assign is not supported 
					//Object.assign(queryNearBy, vm.query);
					_.assign(queryNearBy,vm.query);
					//queryNearBy = JSON.parse(JSON.stringify(vm.query));
					// window.RewayServiceUtil.getDiaChinhKhongDauByGeocode($rootScope.currentLocation.lat
					// 	, $rootScope.currentLocation.lon).then(function(diaChinh){
    	// 				alert(diaChinh);
    	// 			});
					// queryNearBy.place
				}else{

				}

			}else{
				if($rootScope.lastSearch){

				}

			}
		}
		vm.init();

		
	});
})();
