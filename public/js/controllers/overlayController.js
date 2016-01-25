angular.module('OverlayController', []).controller('overlayController', ['$scope', '$rootScope', 'SocketService', function($scope, $rootScope, SocketService) {
    $scope.countdown = 10;
    $scope.solutionVisable = false;
    $scope.socket = SocketService.getSocket();

    $scope.$on("startCountdown", function(event, data) {
        startCountdown();
    });

    $scope.showSolution = function() {
        $scope.solutionVisable = true;
    };

    $scope.returnToMainMenu = function() {
        $scope.socket.emit("playerLeftRoom", SocketService.getGameRoomId(), SocketService.getPlayerId());
        SocketService.MoveToMenuScreen();
    };

    function startCountdown() {
        var interval = setInterval(function() {
            $scope.$apply(function() {
                $scope.countdown--;
            });
            if ($scope.countdown == 0) {
                $scope.countdown = 10;
                $rootScope.$broadcast('startNextRound', {});
                clearInterval(interval);
            }
        }, 1000);
    }

}]);