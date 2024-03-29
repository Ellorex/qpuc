const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const routes = require('./routes');
const sockets = require('./sockets');
const redis = require("./db/redis");

var app = express();
var port = 8080;
app.use(express.static(__dirname + '/static'));

mongoose.connect('mongodb://localhost:27017/qpuc', {useNewUrlParser: true}).then(() => {
    redis.flushall();
    routes.routes(app);
    var server = app.listen(port, () => {console.log('Listen PORT :' + port)});
    var io = socketio(server);
    sockets(io);
});
