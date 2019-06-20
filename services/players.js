const redis = require("../db/redis");

const PLAYERS_KEY = "players";

class PlayersService {
    /**
     * @param { string } name
     * @returns { boolean } returns false if the player already exists
     */
    async addPlayer(name) {
        if (await this.getPlayer(name)) {
            return false;
        }

        return new Promise((resolve, reject) => {
            console.log("added player " + name);
            redis.zadd(PLAYERS_KEY, 0, name, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }

    /**
     * @param { string } name
     */
    removePlayer(name) {
        return new Promise((resolve, reject) => {
            redis.zrem(PLAYERS_KEY, name, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }

    /**
     * @param { string } name
     * @returns {Promise<Player>|Promise<undefined>}
     */
    getPlayer(name) {
        return new Promise((resolve, reject) => {
            redis.zscore(PLAYERS_KEY, name, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!result) {
                    resolve(undefined);
                    return;
                }

                const player = new Player(name);
                player.points = result;
                resolve(player);
            });
        });
    }

    /**
     *
     * @param { string } name
     * @param { number } score
     */
    async updatePlayerScore(name, score) {
        const player = await this.getPlayer(name);
        if (!player) {
            throw new Error(`Player '${player}' does not exist`);
        }

        return new Promise((resolve, reject) => {
            redis.zadd(PLAYERS_KEY, name, score, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }

    /**
     * @returns {Promise<Player[]>}
     */
    getPlayers() {
        return new Promise((resolve, reject) => {
            redis.zrange(PLAYERS_KEY, 0, -1, "WITHSCORES", (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }

                const players = [];
                for (let i = 0; i < result.length; i += 2) {
                    const name = result[i];
                    const score = result[i + 1];
                    players.push(new Player(name, score));
                }
                resolve(players);
            });
        });
    }
}

module.exports = new PlayersService();