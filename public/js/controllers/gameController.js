angular.module('GameController', []).controller('GameController', ['$scope', 'GameService', 'SocketService', function($scope, GameService, SocketService) {
    const NUMBER_OF_CARDS = 13; //52;
    var sendCardsInterval = 0;
    $scope.socket = SocketService.getSocket();

    //TODO: SEND DECK AND CURRENTCARDS TO THE OTHER PLAYER IN THE ROOM

    $scope.desk = [];
    $scope.currentCards = [];

    if (SocketService.getHostStatus() == true) SetUpDeck();

    $scope.PickNextCards = function() {
        $scope.currentCards = [];
        if(deckIsNotEmpty()){
            $scope.currentCards.push(FindCard());
            $scope.currentCards.push(FindCard());
            $scope.currentCards.push(FindCard());
            $scope.currentCards.push(FindCard());
        }
        $scope.socket.emit('currentCards', SocketService.getGameRoomId(), $scope.currentCards);
    };

    $scope.socket.on('newCards', function(cards) {
        console.log('NEW CARDS');
        $scope.$apply(function () {
            $scope.currentCards = cards;
        });
        $scope.socket.emit('stopSendingCards', SocketService.getGameRoomId());
    });

    $scope.socket.on('playerJoinedRoom', function () {
        setUpIntervalToSendCards();
    });

    $scope.socket.on('gotCardsStopSending', function() {
        clearInterval(sendCardsInterval);
    });

    function setUpIntervalToSendCards() {
        sendCardsInterval = setInterval(SendCardsToOtherPlayer, 2000);
    }

    function SendCardsToOtherPlayer() {
        $scope.socket.emit('currentCards', SocketService.getGameRoomId(), $scope.currentCards);
    }

    function SetUpDeck() {
        GameService.getCards()
            .then(function(res) {
                $scope.deck = res.cards;
                console.log('Cards ready, time to play');
                    $scope.PickNextCards();
            }, function() {
                console.log('failed to get cards');
            });
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