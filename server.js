const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');

var app = express();
var server = app.listen(8080);

var io = socketio(server);

app.use(express.static('./static'));