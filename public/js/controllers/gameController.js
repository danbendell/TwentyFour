angular.module('GameController', []).controller('GameController', ['$scope', '$rootScope', 'GameService', 'SocketService', function($scope, $rootScope, GameService, SocketService) {
    const NUMBER_OF_CARDS = 52;
    var sendCardsInterval = 0;
    $scope.countdown = 5;
    $scope.waitingForOpposition = false;
    $scope.settingUpGame = false;
    $scope.gameInProgress = false;
    $scope.endOfRound = false;
    $scope.winnerOfRound = false;
    $scope.roundSkipped = false;

    $scope.playerDetails;

    if (SocketService.getHostStatus() == true) {
        $scope.waitingForOpposition = true;
    } else {
        $scope.settingUpGame = true;
    }

    $scope.socket = SocketService.getSocket();
    $scope.deck = [];
    $scope.currentCards = [];

    if (SocketService.getHostStatus() == true) SetUpDeck();

    $scope.PickNextCards = function() {
        $scope.endOfRound = false;
        $scope.currentCards = [];
        if(deckIsNotEmpty()){
            $scope.currentCards.push(FindCard());
            $scope.currentCards.push(FindCard());
            $scope.currentCards.push(FindCard());
            $scope.currentCards.push(FindCard());
        }
        console.log('emitting new cards');
        console.log($scope.currentCards);
        if($scope.waitingForOpposition == false) {
            SendCardsToOtherPlayer();
        }
    };

    $scope.$on("startNextRound", function(event, data) {
        console.log('Starting next round');
        setPlayersDetails();
        if(SocketService.getHostStatus() == true) $scope.PickNextCards();
        $scope.$apply(function() {
            $scope.winnerOfRound = false;
            $scope.endOfRound = false;
            $scope.roundSkipped = false;
        });
    });

    $scope.socket.on('newCards', function(cards, deck) {
        $scope.$apply(function () {
            $scope.currentCards = cards;
            $scope.deck = deck;
        });
        $scope.socket.emit('stopSendingCards', SocketService.getGameRoomId());
    });

    $scope.socket.on('playerJoinedRoom', function () {
        $scope.waitingForOpposition = false;
        $scope.settingUpGame = true;
        setUpIntervalToSendCards();
    });

    $scope.socket.on('gotCardsStopSending', function() {
        clearInterval(sendCardsInterval);
        if (SocketService.getHostStatus() == true && $scope.gameInProgress == false) {
            $scope.socket.emit('gameReady', SocketService.getGameRoomId());
        }
    });

    $scope.socket.on('aPlayerHasAnsweredCorrectly', function(player, gameDetails) {
        console.log('END OF ROUND');
        $scope.playerDetails = gameDetails;
        setPlayersDetails();
        $scope.$apply(function() {
            if(player.id == SocketService.getPlayerId()) {
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

    $scope.socket.on('beginGame', function(gameDetails) {
        console.log('BeginGame');
        $scope.$apply(function() {
            $scope.playerDetails = gameDetails;
            setPlayersDetails();

            $scope.waitingForOpposition = false;
            $scope.settingUpGame = false;
            $scope.gameInProgress = true;
        });
    });

    $scope.socket.on('newPlayerDetails', function(gameDetails) {
        $scope.$apply(function() {
            $scope.playerDetails = gameDetails;
        });
    });

    $scope.socket.on("playerPassed", function(player, gameDetails) {
        if(player.isHost){
            if($scope.hostName != "Passed") {
                rubberBandAnimation('div[name=hostDetails]');
            }
            $scope.$apply(function() {
                $scope.hostName = "Passed";
                $scope.hostScore = "";
            });
        } else {
            if($scope.playerName != "Passed") {
                rubberBandAnimation('div[name=playerDetails]');
            }
            $scope.$apply(function() {
                $scope.playerName = "Passed";
                $scope.playerScore = "";
            });
        }

        $scope.playerDetails = gameDetails;
        if($scope.playerDetails[0].passed && $scope.playerDetails[1].passed) {
            $scope.$apply(function() {
                $scope.roundSkipped = true;
                $scope.endOfRound = true;
            });
            $scope.socket.emit('roundSkipped', SocketService.getGameRoomId());
            $rootScope.$broadcast("startCountdown", {});
        }
    });

    function rubberBandAnimation(elementName) {
        $(elementName).addClass('animated rubberBand').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(elementName).removeClass('animated rubberBand');
        });
    }

    function setPlayersDetails() {
        for(var i = 0; i <  $scope.playerDetails.length; i++) {
            if( $scope.playerDetails[i].isHost) {
                $scope.hostName = $scope.playerDetails[i].name;
                $scope.hostScore = $scope.playerDetails[i].score;
            } else {
                $scope.playerName = $scope.playerDetails[i].name;
                $scope.playerScore = $scope.playerDetails[i].score;
            }
        }
    }


    function setUpIntervalToSendCards() {
        sendCardsInterval = setInterval(SendCardsToOtherPlayer, 2000);
    }

    function SendCardsToOtherPlayer() {
        $scope.socket.emit('currentCards', SocketService.getGameRoomId(), $scope.currentCards, $scope.deck);
    }

    function SetUpDeck() {
        GameService.getCards()
            .then(function(res) {
                $scope.deck = res.cards;
                console.log('Cards ready, time to play');
                    $scope.PickNex2tCards();
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