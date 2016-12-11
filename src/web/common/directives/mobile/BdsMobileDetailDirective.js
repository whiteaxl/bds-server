angular.module('bds').directive('bdsDetail', ['$timeout', function ($timeout) {
    var def = {
        restrict: 'E',
        scope: {adsId: '@adsId'},
        terminal: true,
        templateUrl: "/web/common/directives/mobile/bds-mobile-detail.tpl.html",
        replace: 'true',
        controller: 'MobileDetailCtrl',
        controllerAs: "mdt",
        bindToController: true,
        link: function(scope, elm, attrs){
            console.log("after render");
            /*$timeout(function() {
                //alert(scope.chatbox.hidden);
                if(scope.chatbox.hidden){
                    angular.element("#"+scope.chatbox.position+"-chat-header").closest("div").find('.chat').slideToggle(300, 'swing');
                    angular.element("#"+scope.chatbox.position+"-chat-header").closest("div").find('.chat-message-counter').slideToggle(300, 'swing');    
                }
            }, 0);*/
            //alert('ssss');
        }
    };
    return def;
}]);