angular.module('appRoutes', []).config(['$routeProvider', function($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'partials/player.html',
            controller: 'MainController'
        })
        .when('/nerds', {
            templateUrl: 'partials/nerd.html',
            controller: 'NerdController'
        })
        .when('/game', {
            templateUrl: 'partials/game.html',
            controller: 'GameController'
        });
}]);