(function() {
	'use strict';
	var controllerId = 'MobileListAdsCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, $state, HouseService, NewsService, NgMap, $window,$timeout,$location,$localStorage){
		var vm = this;		
    vm.pageSize = 25;
    
    vm.resetResultList = function(){
      vm.currentPage = 0;
      // vm.lastPageNo = 0;
      vm.startPageNo = 0;
      vm.currentPageEnd =0;
      vm.currentPageStart=0;
      vm.ads_list = [];
    }

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
    vm.prev = function(){
      if(vm.currentPage>=2){
          vm.currentPage = vm.currentPage-1;
          vm.searchPage(vm.currentPage);
          vm.setNextPrevButton();
      }
    }
    vm.next = function(){
        if(vm.totalResultCounts>0 && vm.totalResultCounts > (vm.currentPage)*vm.pageSize){
          vm.currentPage = vm.currentPage+1;
          vm.searchPage(vm.currentPage);
          vm.setNextPrevButton();          
        }

    }
    vm.setNextPrevButton = function(){
      if(vm.currentPage == vm.lastPageNo || vm.totalResultCounts ==0){
          vm.nextPage = false;          
      }else{
          vm.nextPage = true;
      }
      if(vm.currentPage >1){
          vm.prevPage = true;
      }else{
          vm.prevPage = false;
      }
    }
    vm.searchPage = function(i, callBack){
      vm.searchData.pageNo = i; 
      vm.doneSearch = false;     
      HouseService.findAdsSpatial(vm.searchData).then(function(res){
        vm.resetResultList();
        vm.adsList = res.data.list;
        vm.doneSearch = true;
        vm.currentPageStart = vm.pageSize*(vm.searchData.pageNo-1) + 1
        vm.currentPageEnd = vm.currentPageStart + res.data.list.length -1;
        vm.currentPage = vm.searchData.pageNo;
        vm.setNextPrevButton();
        $('body').scrollTop(0);
        if(callBack)
          callBack(res);
      }); 
    }
    vm.init = function(){
        vm.doneSearch = false;
        vm.currentPage = 1;
        if($state.params.query){
          vm.searchData = $state.params.query;
          vm.searchData.isIncludeCountInResponse = true;
          vm.searchData.limit = vm.pageSize;
          vm.searchData.updateLastSearch = false;
          // HouseService.findAdsSpatial(vm.searchData).then(function(res){
          //   vm.resetResultList();
          //   vm.adsList = res.data.list;
          //   vm.doneSearch = true;
          //   vm.currentPageStart = vm.pageSize*($rootScope.searchData.pageNo-1) + 1
          //   vm.currentPageEnd = vm.currentPageStart + res.data.list.length -1;
          //   vm.currentPage = $rootScope.searchData.pageNo;
          //   vm.setNextPrevButtonClass();
          // }); 
          vm.searchPage(1, function(res){
            vm.searchData.isIncludeCountInResponse = false;
            vm.totalResultCounts = res.data.totalCount;
            if(vm.totalResultCounts>0){
              vm.currentPage = 1;
              vm.lastPageNo = Math.ceil(vm.totalResultCounts/vm.pageSize);
              vm.currentPageStart = 1;
              vm.currentPageEnd = vm.currentPageStart + res.data.list.length -1;
            } else{
              vm.currentPage = 0;
              vm.lastPageNo = 0;
              vm.startPageNo = 0;
            }  
            vm.setNextPrevButton();          
          });   
        }            
    }
    vm.init();

		
	});
})();
