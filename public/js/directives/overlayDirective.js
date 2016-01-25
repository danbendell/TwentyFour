angular.module('OverlayDirective', []).directive('overlayDirective', function () {
    return {
        restrict: 'E', //E = element, A = attribute, C = class, M = comment
        scope: {
            winnerOfRound: '=',
            waitingForOpposition: '=',
            settingUpGame: '=',
            roundSkipped: '=',
            solution: '='
        },
        templateUrl: 'partials/overlay.html',
        replace: true,
        controller: 'overlayController',
        link: function ($scope, element, attrs) {
        }
    }
});