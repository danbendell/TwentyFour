angular.module('MainController', []).controller('MainController', function($scope) {
    var socket;
    $scope.buttonClickingTime = function() {
        if (socket == undefined) socket = io();
        socket.emit('message', $scope.name);
    };
});