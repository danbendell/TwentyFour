angular.module('SocketService', []).factory('SocketService', ['$rootScope', '$location', function($rootScope, $location) {
    var socket = io();
    var gameRoomId = 0;
    var hostStatus = false;
    var intervalTime = 0;
    var playerId = 0;

    socket.on('connected', function(data) {
        console.log(data.id);
        playerId = data.id;
        clearInterval(intervalTime);
        intervalTime = setInterval(SearchForOpenGameRooms, 5000);
    });

    socket.on('newGameCreated', function (config, player) {
        SetGameRoomId(player.gameRoomId);
        setHostStatus(player.isHost);
        clearInterval(intervalTime);
        MoveToGameScreen();
    });

    socket.on('joinRoom', function(player) {
        SetGameRoomId(player.gameRoomId);
        setHostStatus(player.isHost);
        clearInterval(intervalTime);
        MoveToGameScreen();
    });

    function MoveToGameScreen() {
        $rootScope.$apply(function() {
            $location.path("/game");
        });
    }

    function MoveToMenuScreen() {
        $location.path("/");
    }

    function SearchForOpenGameRooms() {
        console.log('searching for games');
        socket.emit('getOpenGameRooms');
    }

    function SetGameRoomId(roomId) {
        gameRoomId = roomId;
    }

    function getGameRoomId() {
        return gameRoomId;
    }

    function setHostStatus(isHost) {
        hostStatus = isHost;
    }

    function getHostStatus() {
        return hostStatus;
    }

    function getSocket() {
        return socket;
    }

    function getPlayerId() {
        return playerId;
    }

    return {
        getGameRoomId: getGameRoomId,
        getHostStatus: getHostStatus,
        getSocket: getSocket,
        getPlayerId: getPlayerId,
        MoveToMenuScreen: MoveToMenuScreen
    }
}]);
