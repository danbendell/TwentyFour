angular.module('GameController', []).controller('GameController', ['$scope', 'GameService', 'SocketService', function($scope, GameService, SocketService) {
    const NUMBER_OF_CARDS = 13; //52;
    $scope.socket = SocketService.getSocket();

    //TODO: SEND DECK AND CURRENTCARDS TO THE OTHER PLAYER IN THE ROOM

    $scope.desk = [];
    $scope.currentCards = [];

    SetUpDeck();

    $scope.PickNextCards = function() {
        console.log(SocketService.getGameRoomId());
        $scope.socket.emit('nextCards', SocketService.getGameRoomId());
        $scope.currentCards = [];
        if(deckIsNotEmpty()){
            $scope.currentCards.push(FindCard());
            $scope.currentCards.push(FindCard());
            $scope.currentCards.push(FindCard());
            $scope.currentCards.push(FindCard());
        }
    };

    $scope.socket.on('sendingNewCards', function() {
       console.log('NEW CARDS');
    });

    function SetUpDeck() {
        GameService.getCards()
            .then(function(res) {
                $scope.deck = res.cards;
                console.log('Cards ready, time to play');
                if (SocketService.getHostStatus() == true) {
                    $scope.PickNextCards();
                } else {
                    GetCardsFromHost();
                }
            }, function() {
                console.log('failed to get cards');
            });
    }

    function GetCardsFromHost() {
        $scope.socket.emit('getHostCurrentCards');
    }

    function FindCard() {
        var position = Math.round(Math.random() * $scope.deck.length) - 1;
        position = checkIfCardPositionValid(position);
        var card = $scope.deck[position];
        removeCardFromDeck(position);
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

    function removeCardFromDeck(position) {
        $scope.deck.splice(position, 1);
    }
}]);