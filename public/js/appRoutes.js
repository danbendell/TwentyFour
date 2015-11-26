angular.module('appRoutes', []).config(['$routeProvider', function($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'partials/mainMenu.html',
            controller: 'MainController'
        })
        .when('/nerds', {
            templateUrl: 'partials/nerd.html',
            controller: 'NerdController'
        })
        .when('/game', {
            templateUrl: 'partials/game.html',
            controller: 'GameController'
        }).when('/:id', {
            templateUrl: 'partials/game.html',
            controller: 'GameController'
        });
}]);