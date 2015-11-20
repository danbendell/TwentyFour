var express = require('express')
var http = require('http');

var port = 8080;

var app = express();
app.use(express.static(__dirname + '/public'));

var httpServer = http.Server(app);
httpServer.listen(port, function() {
    console.log('Listening on port - ' + port);
});

var io = require('socket.io').listen(httpServer);

require('./routes')(app); // configure our routes
require('./sockets')(io); // configure the socket