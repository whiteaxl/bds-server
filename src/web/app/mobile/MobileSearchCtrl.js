(function() {
	'use strict';
	var controllerId = 'MobileSearchCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope, $http, $scope, $state, HouseService, NewsService, NgMap, $window,$timeout,$location){
		var vm = this;
		vm.soPhongNguList = window.RewayListValue.getNameValueArray(window.RewayListValue.SoPhongNgu);
		vm.soPhongTamList = window.RewayListValue.getNameValueArray(window.RewayListValue.SoPhongTam);
		vm.soTangList = window.RewayListValue.getNameValueArray(window.RewayListValue.SoTang);
		vm.huongNhaList = window.RewayListValue.getNameValueArray(window.RewayListValue.HuongNha);
		vm.radiusInKmList = window.RewayListValue.getNameValueArray(window.RewayListValue.RadiusInKm);
		vm.sortOptions = window.RewayListValue.sortHouseOptions;
		vm.sortBy = vm.sortOptions[0].value;
		vm.price_min = 0;
		vm.price_max = window.RewayListValue.filter_max_value.value;
		vm.dien_tich_min = 0;
		vm.dien_tich_max = window.RewayListValue.filter_max_value.value;
		vm.zoomMode = "auto";

		vm.searchData = {
			"loaiTin": vm.loaiTin,
			"loaiNhaDat": vm.loaiNhaDat, 
			"loaiNhaDats": [],
		  	"giaBETWEEN": [vm.price_min,vm.price_max],
		  	"khoangGia": vm.khoangGia, 
		  	"khoangDienTich": vm.khoangDienTich,
		  	"soPhongNguGREATER": vm.soPhongNguList[0].value,
		  	"soPhongTamGREATER": vm.soPhongTamList[0].value,
		  	"soTangGREATER": vm.soTangList[0].value,
		  	"dienTichBETWEEN": [0,vm.dien_tich_max],
		  	"huongNha": vm.huongNhaList[0].value,
		  	"huongNhas": [],
		  	"radiusInKm": 2,
		  	"userID": $rootScope.user.userID,
		  	//"geoBox": [  vm.map.getBounds().H.j,  vm.map.getBounds().j.j ,vm.map.getBounds().H.H, vm.map.getBounds().j.H],
		  	"limit": vm.pageSize,
		  	"orderBy": vm.sortOptions[0].value,
		  	"pageNo": 1
		}

		
	});
})();
