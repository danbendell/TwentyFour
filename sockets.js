module.exports = function(io) {

    var GameData = {
        players: [],
        gameRooms: []
    };

    io.on('connection', function(socket){
        socket.emit('connected', {id: socket.id});

        socket.on('createNewGame', function(player) {
            var isHost = true;
            var gameId = NewGameID();
            CreateNewPlayer(player, socket, isHost, gameId);
            CreateNewGame(socket, gameId);
        });

        socket.on('playerJoinGame', function(roomData, player) {
            var isHost = false;
            CreateNewPlayer(player, socket, isHost, roomData.roomId);
            PlayerJoinGame(socket, roomData);
        });

        socket.on('getOpenGameRooms', function(){
            GetOpenGameRooms(socket);
        });

        socket.on('currentCards', function(gameId, cards, deck, solution) {
            io.sockets.in(gameId).emit('newCards', cards, deck, solution);
        });

        socket.on('stopSendingCards', function(gameId) {
            io.sockets.in(gameId).emit('gotCardsStopSending');
        });

        socket.on('gameReady', function(gameId) {
            var gameDetails = getGameDetails(gameId);
           io.sockets.in(gameId).emit('beginGame', gameDetails);
        });

        socket.on('pass', function(gameId) {
            var player = getPlayerDetails(socket);
            var gameDetails = getGameDetails(gameId);
            player.passed = true;
            io.sockets.in(gameId).emit('playerPassed', player, gameDetails);
        });

        socket.on('roundSkipped', function(gameId) {
            var gameDetails = resetForNextRound(gameId);
            io.sockets.in(gameId).emit("newPlayerDetails", gameDetails);
        });

        socket.on('disconnect', function() {
            RemovePlayer(socket);
        });

        socket.on('equationSolved', function(gameId) {
            console.log("EquationSolved, send out new cards");
            var gameDetails = getGameDetails(gameId);
            var player = getPlayerDetails(socket);
            player.score ++;
            console.log(GameData.players);
            io.sockets.in(gameId).emit('aPlayerHasAnsweredCorrectly', player, gameDetails);
        })
    });

    function PlayerJoinGame(socket, roomData) {
        roomData.mySocketId = socket.id;
        // Join the room
        socket.join(roomData.roomId);

        console.log("Client joining - " + roomData.roomId);
        setGameRoomToFull(roomData);

        //console.log('Sending game rooms');
        //GetOpenGameRooms(socket);

        // Emit an event notifying the clients that the player has joined the room.
        socket.emit('joinRoom', getPlayerDetails(socket));
        io.sockets.in(roomData.roomId).emit('playerJoinedRoom');
    }

    function NewGameID() {
        return (Math.random() * 100000) | 0;
    }

    function CreateNewGame(socket, thisGameId) {
        console.log('Creating new Game');

        var roomData = {
            roomId: thisGameId,
            status: 1
        };

        GameData.gameRooms.push(roomData);

        var gameInfo = {
            gameId: thisGameId,
            mySocketId: socket.id
        };
        socket.emit('newGameCreated', gameInfo, getPlayerDetails(socket));
        console.log("Host joining - " + thisGameId.toString());
        socket.join(thisGameId.toString());
    }

    function CreateNewPlayer(player, socket, isHost, gameRoomId) {
        //Player.id, Player.name, Player.isHost, Player.score
        player.id = socket.id;
        player.isHost = isHost;
        player.gameRoomId = gameRoomId;
        player.score = 0;
        player.passed = false;
        GameData.players.push(player);
    }

    function resetPassedValues(gameId) {
        var gameDetails = [];
        for (var i = 0; i < GameData.players.length; i++) {
            if (GameData.players[i].gameRoomId == gameId) {
                GameData.players[i].passed = false;
                gameDetails.push(GameData.players[i]);
            }
        }
        return gameDetails;
    }

    function resetForNextRound(gameId) {
        var gameDetails = getGameDetails(gameId);
        gameDetails = resetPassedValues(gameId);
        return gameDetails;
    }

    function getPlayerDetails(socket) {
        for (var i = 0; i < GameData.players.length; i++) {
            if(GameData.players[i].id == socket.id) {
                return GameData.players[i];
            }
        }
    }

    function RemovePlayer(socket) {
        for (var i = 0; i < GameData.players.length; i++) {
            if(GameData.players[i].id == socket.id) {
                GameData.players.splice(i, 1);
                break;
            }
        }
    }

    function getGameDetails(gameId) {
        var gameDetails = [];
        for (var i = 0; i < GameData.players.length; i++) {
            if (GameData.players[i].gameRoomId == gameId) {
                gameDetails.push(GameData.players[i]);
            }
        }
        return gameDetails;
    }

    function GetOpenGameRooms(socket) {
        socket.emit('gameRoomList', GameData.gameRooms);
    }

    function setGameRoomToFull(roomData) {
        for (var i = 0; i < GameData.gameRooms.length; i++) {
            if (GameData.gameRooms[i].roomId == roomData.roomId) {
                GameData.gameRooms[i].status = 0;
            }
        }
    }
};