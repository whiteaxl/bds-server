(function() {
	'use strict';
	var controllerId = 'LoginCtrl';
	angular.module('bds').controller(controllerId,function ($rootScope,$http, $scope,$state,HouseService,NgMap,$window){
		var vm = this;
		
		vm.email = "";
		vm.password = "";
		vm.email="";
		vm.signin = function(){
			var loginForm = $('#form-login');
			if (loginForm.valid()) {
			  // If the form is invalid, submit it. The form won't actually submit;
			  // this will just cause the browser to display the native HTML5 error messages.
				alert("register/signin with email " + vm.email + " password " + vm.password);
			}
			vm.password = "";
			vm.email = "";
		}


	});

})();