const playersService = require("./players");
const playerAnswersService = require("./player-answers");

class GameState {
    players = playersService;
    currentRound = playerAnswersService;
}

module.exports = new GameState();