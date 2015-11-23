angular.module('GameController', []).controller('GameController', ['$scope', 'GameService', function($scope, GameService) {
    console.log('loading game controller');

    GameService.getCards()
        .then(function(res) {
            console.log(res.cards);
            $scope.deck = res.cards;
        }, function() {
            console.log('failed to get cards');
        });
}]);