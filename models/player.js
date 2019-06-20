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
        if (score) this.score = parseInt(score);
    }
}

module.exports = Player;