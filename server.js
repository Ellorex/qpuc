const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const routes = require('./routes');
const sockets = require('./sockets');

var app = express();
var server = app.listen(8080);

var io = socketio(server);
sockets(io);

app.use(express.static('./static'));

routes.animateurRoutes(app);
routes.participantRoutes(app);