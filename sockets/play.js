const gameState = require("../services/game-state");

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
                client.nsp.emit('playerJoined', name);
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