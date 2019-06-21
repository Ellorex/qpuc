const redis = require("../db/redis");
const playersService = require("./players");
const Player = require("../models/player");

function getAnswerKey(name) {
    return name + "_anwsers";
}

/**
 * @typedef PlayerAnswer
 * @property {Player} player
 * @property {number} answer Index of the answer
 * @property {number} answerTime Index of the answer (starting at 0)
 * @property {number} isCorrect
 * @property {number} points Score change
 */

class PlayerAnswersService {
    /**
     * @param {string} name Player name
     * @param {number} answerIndex Index of the answer (starting at 0)
     * @param {number} answerTime Time the player took to give the answer (in seconds)
     * @param {number} points Score change
     * @returns {PlayerAnswer}
     */
    setPlayerAnswer(name, answer, isCorrect, answerTime, points) {
        return new Promise((resolve, reject) => {
            redis.hmset(getAnswerKey(name), "answer", answer, "time", answerTime, "isCorrect", isCorrect, "points", points,
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

                if (!result) {
                    resolve(null);
                    return;
                }

                result.points = parseInt(result.points);
                resolve(result);
            });
        });
    }

    /**
     * @returns {Promise<PlayerAnswer[]>}
     */
    async getAllAnswers() {
        const players = await playersService.getPlayers();
        const answers = [];
        for (let player of players) {
            const answer = await this.getPlayerAnswer(player.name);
            if (!answer) {
                continue;
            }
            
            answer.player = player;
            answers.push(answer);
        }
        return answers;
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