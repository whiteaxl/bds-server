angular.module('bds').directive('bdsChat', ['$timeout', function ($timeout) {
    var def = {
        restrict: 'E',
        scope: {visible: "=visible", useremail: "=useremail", right: "=right", chatbox: "=chatbox"},
        terminal: true,
        templateUrl: "/web/common/directives/chatTemplate.html",
        replace: 'true',
        controller: 'ChatCtrl',
        controllerAs: "chat"
    };
    return def;
}]);