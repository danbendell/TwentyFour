angular.module('CountdownController', []).controller('countdownController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.countdown = 5;

    $scope.$on("startCountdown", function(event, data) {
        startCountdown();
    });

    function startCountdown() {
        var interval = setInterval(function() {
            $scope.$apply(function() {
                $scope.countdown--;
            });
            if ($scope.countdown == 0) {
                $scope.countdown = 5;
                console.log('sending broadcast');
                $rootScope.$broadcast('startNextRound', {});
                clearInterval(interval);
            }
        }, 1000);
    }
}]);