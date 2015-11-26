module.exports = function(io) {

    var GameData = {
        players: [],
        gameRooms: []
    };

    io.on('connection', function(socket){
        socket.emit('connected', {id: socket.id});
        //console.log('User Connected');

        socket.on('createNewGame', function(player) {
            var isHost = true;
            var gameId = NewGameID();
            CreateNewPlayer(player, socket, isHost, gameId);
            CreateNewGame(socket, gameId);
        });

        socket.on('playerJoinGame', function(data, player) {
            var isHost = false;
            CreateNewPlayer(player, socket, isHost, data.gameId.roomId);
            PlayerJoinGame(socket, data);
        });

        socket.on('getOpenGameRooms', function(){
            GetOpenGameRooms(socket);
        });

        socket.on('getHostCurrentCards', function() {

        });

        socket.on('message', function(msg) {
            console.log('user - ' + msg);
        });

        socket.on('disconnect', function() {
            RemovePlayer(socket);
            //console.log('user disconnected');
        });
    });

    function PlayerJoinGame(socket, data) {
        data.mySocketId = socket.id;
        // Join the room
        socket.join(data.gameId);

        setGameRoomToFull(data.gameId);
        console.log('Sending game rooms');
        GetOpenGameRooms(socket);
        // Emit an event notifying the clients that the player has joined the room.
        io.sockets.in(data.gameId).emit('playerJoinedRoom', getPlayerDetails(socket));
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
        socket.join(thisGameId.toString());
    }

    function CreateNewPlayer(player, socket, isHost, gameRoomId) {
        //Player.id, Player.name, Player.isHost
        player.id = socket.id;
        player.isHost = isHost;
        player.gameRoomId = gameRoomId;
        GameData.players.push(player);
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