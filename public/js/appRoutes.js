angular.module('appRoutes', []).config(['$routeProvider', function($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'partials/mainMenu.html',
            controller: 'MainController'
        })
        .when('/game', {
            templateUrl: 'partials/game.html',
            controller: 'GameController'
        }).when('/:id', {
            templateUrl: 'partials/game.html',
            controller: 'GameController'
        });
}]);