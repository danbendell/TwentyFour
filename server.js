var http = require('http');
var express = require('express');

var port = 8080;

var app = express();
app.use(express.static(__dirname + '/public'));

require('./routes')(app); // configure our routes

app.listen(port);