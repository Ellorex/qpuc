const gameState = require("../services/game-state");

const ROOM_NAME = "room1";

/**
 * @param {SocketIO.Socket} client
 */
function onConnection(client) {
    client.on('joinGame', name => {
        gameState.players.addPlayer(name).then(success => {
            console.log("added player", success);
            client.emit("joinGame", success);
            if (success) {
                console.log(name + "joined the game");
                client.join(ROOM_NAME);
                const state = await gameState.getState();
                client.to(ROOM_NAME).emit("gameState", state);
                client.broadcast.to(ROOM_NAME).emit('playerJoined', name);
            }
        });
    });
}

/**
 * @function
 * @param {SocketIO.Server} io
 */
module.exports = (io) => {
    const ns = io.of("play");
    ns.on("connection", onConnection);
}