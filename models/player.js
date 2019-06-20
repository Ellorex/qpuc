const playersService = require("../services/players");

class Player {
    /** @type { string } */
    name;

    /** @type { number } */
    score;

    /**
     * @param { string } name
     * @param { number } score
     */
    constructor(name, score) {
        if (name) this.name = name;
        if (score) this.score = score;
    }

    /**
     * @returns {Promise<number>|Promise<null>}
     */
    async getScore() {
        const player = await playersService.getPlayer(this.name);
        if (!player) {
            return null;
        }

        this.score = player.score;
        return player.score;
    }

    /**
     * @param { number } score
     */
    async updateScore(score) {
        await playersService.updatePlayerScore(this.name, score);
        this.score = score;
    }
}

module.exports = Player;