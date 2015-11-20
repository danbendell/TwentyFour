/**
 * Created by Manwell on 20/11/2015.
 */
var myApp = angular.module('myApp', [
    'ngRoute',
    'mainControllers'
]);

myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/CreatePlayer', {
        templateUrl: 'partials/createPlayer.html',
        controller: 'mainControllers'
    }).otherwise({
        redirectTo: '/'
    });
}]);