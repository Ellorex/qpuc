const gameState = require("../services/game-state");

const ROOM_NAME = "room1";

/**
 * @param {SocketIO.Socket} client
 */
function onConnection(client) {
    let playerName;

    client.on('joinGame', name => {
        gameState.players.addPlayer(name).then(success => {
            console.log("added player", success);
            client.emit("joinGame", success);
            if (success) {
                playerName = name;
                console.log(name + " joined the game");
                client.join(ROOM_NAME);
                gameState.getState().then(state => {
                    client.emit("gameState", state);
                    client.to(ROOM_NAME).emit('playerJoined', name);
                    client.to(ROOM_NAME).emit("leaderboard", state.players);
                });
            }
        });
    });

    client.on("sendAnswer", answerIndex => {
        gameState.setPlayerAnswer(playerName, answerIndex);
    });

    client.on('disconnect', reason => {
        if (!playerName) {
            return;
        }

        console.log(`Player ${playerName} left the game`);

        gameState.removePlayer(playerName).then(() => {
            return gameState.players.getPlayers();
        }).then(players => {
            client.nsp.to(ROOM_NAME).emit("playerLeft", playerName);
            client.nsp.to(ROOM_NAME).emit("leaderboard", players);
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