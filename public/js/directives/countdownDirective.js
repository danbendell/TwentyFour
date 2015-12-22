angular.module('CountdownDirective', []).directive('countdownDirective', function () {
    return {
        restrict: 'E', //E = element, A = attribute, C = class, M = comment
        scope: {
            winnerOfRound: '='
        },
        templateUrl: 'partials/overlay.html',
        replace: true,
        controller: 'countdownController',
        link: function ($scope, element, attrs) {
        }
    }
});