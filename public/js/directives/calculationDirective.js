angular.module('CalculationDirective', []).directive('calculationDirective', function () {
    return {
        restrict: 'E', //E = element, A = attribute, C = class, M = comment
        scope: {
            currentCards: '=',
            socket: '='
        },
        templateUrl: 'partials/calculationArea.html',
        replace: true,
        controller: 'CalculationController',
        link: function ($scope, element, attrs) {
        }
    }
});