angular.module('GameController', []).controller('GameController', ['$scope', '$rootScope', 'GameService', 'SocketService', function($scope, $rootScope, GameService, SocketService) {
    const NUMBER_OF_CARDS = 52;
    const POSSIBLE = 'possible';
    const IMPOSSIBLE = 'impossible';
    var sendCardsInterval = 0;
    $scope.countdown = 10;
    $scope.waitingForOpposition = false;
    $scope.settingUpGame = false;
    $scope.gameInProgress = false;
    $scope.endOfRound = false;
    $scope.endOfGame = false;
    $scope.winnerOfRound = false;
    $scope.roundSkipped = false;
    $scope.playerQuit = false;

    $scope.playerDetails;

    if (SocketService.getHostStatus() == true) {
        $scope.waitingForOpposition = true;
    } else {
        $scope.settingUpGame = true;
    }

    $scope.socket = SocketService.getSocket();
    $scope.deck = [];
    $scope.tempDeck = [];
    $scope.combinations = [];
    $scope.solution = [];
    $scope.currentCards = [];

    if (SocketService.getHostStatus() == true) {
        SetUpDeck();
        getCombinations();
    }

    $scope.PickNextCards = function() {
        $scope.endOfRound = false;
        $scope.currentCards = [];
        $scope.tempDeck = $scope.deck.slice(0);
        if(deckIsNotEmpty()){
            $scope.currentCards.push(FindCard());
            $scope.currentCards.push(FindCard());
            $scope.currentCards.push(FindCard());
            $scope.currentCards.push(FindCard());
        } else {
            console.log("Deck Empty");
            GameOver();
            return;
        }

        if(combinationIsPossible()) {
            console.log("All good");
            console.log('emitting new cards');
            console.log($scope.currentCards);
            if($scope.waitingForOpposition == false) {
                SendCardsToOtherPlayer();
            } else {
                console.log("WAIT SCREEN IS UP");
            }
        } else {
            console.log("Bad combo");
            $scope.deck = $scope.tempDeck.slice(0);
            if($scope.deck.length <= 4) {
                console.log("Can't complete the last hand!!!");
                GameOver();
            } else {
                $scope.PickNextCards();
            }
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

    $scope.socket.on('newCards', function(cards, deck, solution) {
        if(cards != [] && deck != []) {
            $scope.$apply(function () {
                $scope.currentCards = cards;
                $scope.deck = deck;
                $scope.solution = solution;
            });
            $scope.socket.emit('stopSendingCards', SocketService.getGameRoomId());
        }
    });

    $scope.socket.on('playerJoinedRoom', function () {
        console.log("PLAYER JOINED");
        $scope.waitingForOpposition = false;
        $scope.settingUpGame = true;
        if(SocketService.getHostStatus()) {
            if($scope.deck.length != 0 && $scope.currentCards.length != 0) {
                setUpIntervalToSendCards();
            } else {
                SetUpDeck();
            }
        }
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
        if($scope.deck.length > 0) {
            $scope.$apply(function() {
                if(player.id == SocketService.getPlayerId()) {
                    $scope.winnerOfRound = true;
                }
                $scope.endOfRound = true;
            });
            $scope.$broadcast("startCountdown", {});
        } else {
            GameOver();
        }

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
            if($scope.deck.length == 0) {
                GameOver();
            } else {
                $scope.$apply(function() {
                    $scope.roundSkipped = true;
                    $scope.endOfRound = true;
                });
                $scope.socket.emit('roundSkipped', SocketService.getGameRoomId());
                $rootScope.$broadcast("startCountdown", {});
            }
        }
    });

    $scope.socket.on("showFinalScore", function() {
        console.log("GAME OVER");
        $scope.$apply(function() {
            $scope.endOfRound = true;
            $scope.endOfGame = true;
        });
    });

    $scope.socket.on("playerLeftTheGame", function() {
        $scope.$apply(function() {
            $scope.endOfRound = true;
            $scope.playerQuit = true;
        });
    });

    function GameOver() {
        $scope.socket.emit('gameOver', SocketService.getGameRoomId());
    }

    function combinationIsPossible() {
        var possible = false;
        var comparisonArray = $scope.currentCards.slice(0);
        comparisonArray = comparisonArray.sort(function(a, b) {
            return a.numericValue - b.numericValue;
        });
        var startPosition = GameService.getOptimalStartPosition(comparisonArray[0].numericValue);
        for(var i = startPosition; i < $scope.combinations.length; i++) {
            if(comparisonArray[0].numericValue == $scope.combinations[i].valueOne &&
                comparisonArray[1].numericValue == $scope.combinations[i].valueTwo &&
                comparisonArray[2].numericValue == $scope.combinations[i].valueThree &&
                comparisonArray[3].numericValue == $scope.combinations[i].valueFour) {
                    if($scope.combinations[i].solution == POSSIBLE) {
                        possible = true;
                        console.log($scope.combinations[i].answer);
                        $scope.solution = $scope.combinations[i].answer;
                        return possible;
                    } else {
                        return possible;
                    }
            }
        }
        return possible;
    }


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
        console.log("SENDING CARDS");
        $scope.socket.emit('currentCards', SocketService.getGameRoomId(), $scope.currentCards, $scope.deck, $scope.solution);
    }

    function SetUpDeck() {
        GameService.getCards()
            .then(function(res) {
                $scope.deck = res.cards;
                console.log('Cards ready, time to play');
            }, function() {
                console.log('failed to get cards');
            });
    }

    function getCombinations() {
        GameService.getCombinations()
            .then(function(res) {
                $scope.combinations = res.combinations;
                console.log('Got Combination Array');
                $scope.PickNextCards();
            }, function() {
                console.log('failed to get combinations');
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