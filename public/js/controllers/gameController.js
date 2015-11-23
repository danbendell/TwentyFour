angular.module('GameController', []).controller('GameController', ['$scope', 'GameService', function($scope, GameService) {
    const NUMBER_OF_CARDS = 13; //52;
    $scope.desk = [];
    $scope.currentCards = [];

    GameService.getCards()
        .then(function(res) {
            $scope.deck = res.cards;
            console.log('Cards ready, time to play');
            $scope.PickNextCards();
        }, function() {
            console.log('failed to get cards');
        });

    $scope.PickNextCards = function() {
        $scope.currentCards = [];
        if(deckIsNotEmpty()){
            $scope.currentCards.push(FindCard());
            $scope.currentCards.push(FindCard());
            $scope.currentCards.push(FindCard());
            $scope.currentCards.push(FindCard());
        }
        else {

        }
    };

    function FindCard() {
        var position = Math.round(Math.random() * $scope.deck.length) - 1;
        position = checkIfCardPositionValid(position);
        var card = $scope.deck[position];
        $scope.deck.splice(position, 1);
        return card;
    }

    //Using Math.round(Random) will return a -1 on the last card, need to force it to return a zero.
    function checkIfCardPositionValid(position) {
        if(position >= 0) return position;
        else return 0;
    }

    function deckIsNotEmpty() {
        if($scope.deck.length > 0) return true;
        return false;
    }
}]);