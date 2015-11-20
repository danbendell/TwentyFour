angular.module('MainController', []).controller('MainController', function($scope) {
    var socket;
    $scope.buttonClickingTime = function() {
        console.log('do the thing');
        socket = io();
    };

});