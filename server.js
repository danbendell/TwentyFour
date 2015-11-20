/**
 * Created by Manwell on 20/11/2015.
 */
//Lets require/import the HTTP module
var http = require('http');
var express = require('express');

//Lets define a port we want to listen to
var port = 8080;

var app = express();
var router = express.Router();
require('./routes')(router);
app.use('/', router);

app.listen(port);
