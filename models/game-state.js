const { Players } = require("./players");

class GameState {
    /** @type { Players } */
    players = new Players;
}

module.exports = new GameState();