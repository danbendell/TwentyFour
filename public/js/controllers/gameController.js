angular.module('GameController', []).controller('GameController', ['$scope', 'GameService', 'SocketService', function($scope, GameService, SocketService) {
    const NUMBER_OF_CARDS = 13; //52;
    var sendCardsInterval = 0;
    $scope.countdown = 5;
    $scope.waitingForOpposition = false;
    $scope.settingUpGame = false;
    $scope.gameInProgress = false;
    $scope.endOfRound = false;
    $scope.winnerOfRound = false;

    if (SocketService.getHostStatus() == true) {
        $scope.waitingForOpposition = true;
    } else {
        $scope.settingUpGame = true;
    }

    $scope.socket = SocketService.getSocket();

    $scope.desk = [];
    $scope.currentCards = [];

    if (SocketService.getHostStatus() == true) SetUpDeck();

    $scope.PickNextCards = function() {
        $scope.endOfRound = false;
        $scope.currentCards = [];
        console.log($scope.currentCards);
        if(deckIsNotEmpty()){
            $scope.currentCards.push(FindCard());
            $scope.currentCards.push(FindCard());
            $scope.currentCards.push(FindCard());
            $scope.currentCards.push(FindCard());
        }
        console.log('emitting new cards');
        console.log($scope.currentCards);
        if($scope.waitingForOpposition == false) {
            $scope.socket.emit('currentCards', SocketService.getGameRoomId(), $scope.currentCards);
        }
    };

    $scope.$on("startNextRound", function(event, data) {
        console.log('Starting next round');
        if(SocketService.getHostStatus() == true) $scope.PickNextCards();
        $scope.$apply(function() {
            $scope.winnerOfRound = false;
            $scope.endOfRound = false;
        });
    });

    $scope.socket.on('newCards', function(cards) {
        console.log('NEW CARDS');
        $scope.$apply(function () {
            $scope.currentCards = cards;
        });
        $scope.socket.emit('stopSendingCards', SocketService.getGameRoomId());
    });

    $scope.socket.on('playerJoinedRoom', function () {
        $scope.waitingForOpposition = false;
        $scope.settingUpGame = true;
        console.log('playerJoinedRoom');
        setUpIntervalToSendCards();
    });

    $scope.socket.on('gotCardsStopSending', function() {
        clearInterval(sendCardsInterval);
        if (SocketService.getHostStatus() == true && $scope.gameInProgress == false) {
            $scope.socket.emit('gameReady', SocketService.getGameRoomId());
        }
    });

    $scope.socket.on('aPlayerHasAnsweredCorrectly', function(player) {
        console.log('END OF ROUND');
        console.log(player.id);
        console.log(SocketService.getPlayerId());
        $scope.$apply(function() {
            if(player.id == SocketService.getPlayerId()) {
                console.log('WINNER OF ROUND');
                $scope.winnerOfRound = true;
            }
            $scope.endOfRound = true;
        });
        $scope.$broadcast("startCountdown", {});
    });

    $scope.socket.on('newCardsFromHost', function() {
        console.log('Getting new cards');
       if(SocketService.getHostStatus()) {
           $scope.PickNextCards();
       }
    });

    $scope.socket.on('beginGame', function() {
        console.log('BeginGame');
        $scope.$apply(function() {
            $scope.waitingForOpposition = false;
            $scope.settingUpGame = false;
            $scope.gameInProgress = true;
        });
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