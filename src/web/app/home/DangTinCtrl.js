(function() {
	'use strict';
	var controllerId = 'DangTinCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope,$http, $scope,$state,HouseService,NgMap,$window,$timeout){
		var vm = this;
		vm.loaiNhaDatBan = window.RewayListValue.LoaiNhaDatBanWeb;
		vm.soPhongNguList = window.RewayListValue.getNameValueArray(window.RewayListValue.SoPhongNgu);
		vm.soPhongTamList = window.RewayListValue.getNameValueArray(window.RewayListValue.SoPhongTam);
		vm.soTangList = window.RewayListValue.getNameValueArray(window.RewayListValue.SoTang);
		vm.ads = {
			soPhongNgu: vm.soPhongNguList[0],
			soPhongTam: vm.soPhongTamList[0],
			soTang: vm.soTangList[0]
		};
	});
})();