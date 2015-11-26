angular.module('MainController', []).controller('MainController', ['$scope', '$location', '$rootScope', 'SocketService', function($scope, $location, $rootScope, SocketService) {
    $scope.socket = SocketService.getSocket();
    $scope.gameRooms = [];
    $scope.intervalTime = 0;

    $scope.HostGame = function() {
        var player = {
            id: '',
            name: $scope.username
        };
        $scope.socket.emit('createNewGame', player);
    };

    $scope.socket.on('gameRoomList', function(GameRooms) {
        $scope.$apply(function () {
            $scope.gameRooms = GameRooms;
        });
    });

    $scope.JoinGame = function(roomID) {
        var data = {
          gameId:  roomID
        };
        var player = {
            id: '',
            name: $scope.username
        };
        $scope.socket.emit('playerJoinGame', data, player);
    };

}]);