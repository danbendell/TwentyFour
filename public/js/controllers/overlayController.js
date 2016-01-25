angular.module('OverlayController', []).controller('overlayController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.countdown = 10;
    $scope.solutionVisable = false;
    $scope.$on("startCountdown", function(event, data) {
        startCountdown();
    });

    $scope.showSolution = function() {
        $scope.solutionVisable = true;
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