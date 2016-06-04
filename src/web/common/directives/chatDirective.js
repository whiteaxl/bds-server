angular.module('bds').directive('bdsChat', ['$timeout', function ($timeout) {
    var def = {
        restrict: 'E',
        scope: {visible: "=visible", useremail: "=useremail", right: "=right", chatbox: "=chatbox"},
        terminal: true,
        templateUrl: "/web/common/directives/chatTemplate.html",
        replace: 'true',
        controller: 'ChatCtrl',
        controllerAs: "chat",
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