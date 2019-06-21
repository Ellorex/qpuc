const playersService = require("./players");
const playerAnswersService = require("./player-answers");

class GameState {
    /** Round duration in seconds */
    roundDuration = 30;

    gameEnded = false;
    /**
     * @type {Question}
     */
    currentQuestion;
    roundEnded = true;
    roundStartTs = -1;

    players = playersService;
    playerAnswers = playerAnswersService;
    anyCorrectAnswer = false;

    get timeLeft() {
        if (this.roundEnded) {
            return 0;
        }

        return Date.now() - this.roundStartTs;
    }

    /**
     * @callback startRoundCallback
     */
    /**
     * Starts a new round with a new question
     * @param {Question} question
     * @param {startRoundCallback} onRoundEnd Called when the round ends
     */
    async startRound(question, onRoundEnd) {
        if (!this.roundEnded) {
            return;
        }

        await this.playerAnswers.clearPlayerAnswers();
        this.currentQuestion = question;
        this.anyCorrectAnswer = false;
        this.roundEnded = false;
        this.roundStartTs = Date.now();

        setTimeout(() => {
            this.roundEnd().then(() => {
                if (onRoundEnd) {
                    onRoundEnd();
                }
            });
        }, this.roundDuration * 1000);
    }

    async roundEnd() {
        if (this.roundEnded) {
            return;
        }
        this.roundEnded = true;

        const answers = await this.playerAnswers.getAllAnswers();
        const promises = [];
        for (let playerAnswer of answers) {
            const player = playerAnswer.player;
            player.score += playerAnswer.points;
            const promise = this.players.updatePlayerScore(player.name, player.score);
            promises.push(promise);
            console.log(playerAnswer);
        }

        // wait for all score updates requests to complete
        await Promise.all(promises);
    }

    /**
     *
     * @param {string} name
     * @param {number} answer Answer index
     */
    async setPlayerAnswer(name, answer) {
        if (this.roundEnded || answer < 0 || answer >= currentQuestion.answers.length) {
            return;
        }

        // check if the player already answered
        if (await this.playerAnswers.getPlayerAnswer(name)) {
            return;
        }

        const answerTime = Date.now() - this.roundStartTs;
        const correct = currentQuestion.answers[answer].correct;
        let points = correct ? 1 : -1;
        if (correct && !this.anyCorrectAnswer) {
            this.anyCorrectAnswer = true;
            points += 1;
        }

        this.playerAnswers.setPlayerAnswer(name, answer, correct, answerTime, points);
    }

    async getPlayerAnswers() {
        const answers = await this.playerAnswers.getAllAnswers();
        return answers.map(x => { x.player.name, x.isCorrect, x.points})
    }

    async getState() {
        const question = this.currentQuestion ? {
            title: this.currentQuestion.title,
            answers: this.currentQuestion.answers.map(x => { x.title })
        } : null;
        return {
            players: await this.players.getPlayers(),
            answers: await this.getPlayerAnswers(),
            question,
            timeLeft: this.timeLeft
        };
    }

    removePlayer(name) {
        return Promise.all([
            this.players.removePlayer(name),
            this.playerAnswers.removePlayerAnswer(name)
        ]);
    }
}

module.exports = new GameState();