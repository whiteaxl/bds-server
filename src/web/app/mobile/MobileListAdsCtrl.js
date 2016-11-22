(function() {
	'use strict';
	var controllerId = 'MobileListAdsCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, $state, HouseService, NewsService, NgMap, $window,$timeout,$location,$localStorage){
		var vm = this;		
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
        vm.goDetail = function(event,i){
            $state.go('mdetail', { "adsID" : vm.adsList[i].adsID}, {location: true});
        }
        vm.init = function(){
            vm.doneSearch = false;
            if($state.params.query){
                vm.searchData = $state.params.query;
                vm.searchData.isIncludeCountInResponse = false;
                vm.searchData.limit = 200;
                vm.searchData.updateLastSearch = false;

                HouseService.findAdsSpatial(vm.searchData).then(function(res){
                    vm.adsList = res.data.list;
                    vm.doneSearch = true;
                });    
            }            
        }
        vm.init();

		
	});
})();
