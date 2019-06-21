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
                    client.nsp.to(ROOM_NAME).emit("gameState", state);
                    client.to(ROOM_NAME).emit('playerJoined', name);
                });
            }
        });
    });

    client.on("sendAnswer", answerIndex => {
        gameState.setPlayerAnswer(playerName, answerIndex).then(() => {
            return gameState.getPlayerAnswers();
        }).then(answers => {
            client.nsp.to(ROOM_NAME).emit("playerAnswers", answers);
        });
    });

    client.on('disconnect', reason => {
        if (!playerName) {
            return;
        }

        gameState.removePlayer(playerName).then(() => {
            client.nsp.to(ROOM_NAME).emit("playerLeft", playerName);
            console.log(`Player ${playerName} left the game`);
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