const redis = require("../db/redis");
const playersService = require("./players");

function getAnswerKey(name) {
    return name + "_anwsers";
}

class PlayerAnswersService {
    /**
     * @param {string} name Player name
     * @param {number} answerIndex Index of the answer (starting at 0)
     * @param {number} answerTime Time the player took to give the answer (in seconds)
     */
    setPlayerAnswer(name, answer, answerTime) {
        return new Promise((resolve, reject) => {
            redis.hmset(getAnswerKey(name), "answer", answer, "time", answerTime,
            (err, result) => {
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
    getPlayerAnswer(name) {
        return new Promise((resolve, reject) => {
            redis.hgetall(getAnswerKey(name), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }

                const answers = [];
                for (let i = 0; i < result.length; i += 2) {
                    const key = result[i];
                    console.log(key);
                }
                resolve(answers);
            });
        });
    }

    clearPlayerAnswers() {
        return new Promise((resolve, reject) => {
            playersService.getPlayers().then(players => {
                redis.del(players.map(x => x.name), (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve();
                });
            });
        });
    }
}

module.exports = new PlayerAnswersService();