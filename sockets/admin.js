const gameState = require("../services/game-state");
const Question = require('../models/model');

/**
 * @param {SocketIO.Socket} client
 */
function onConnection(client) {
    const playNs = client.server.of("play");

    // send questions on connection
    Question.find({}).exec().then(questions => {
        client.emit('loadQuestions', questions);
    });

    client.on('insertQuestions', data => {
        var question = new Question(data);
        question.save().then(data => {
            return Question.find({}).exec();
        }).then(questions => {
            client.nsp.emit('loadQuestions', questions);
        });
    });

    client.on('selectExistingQuestion', question => {
        console.log(question);
        if (!gameState.roundEnded) {
            return;
        }

        const countdownSec = 3;
        playNs.to("room1").emit("countdown", countdownSec);
        setTimeout(() => {
            gameState.startRound(question, () => {
                gameState.players.getPlayers().then(players => {
                    playNs.to("room1").emit("roundEnded");
                    playNs.to("room1").emit("leaderboard", players);
                });
            }).then(() => {
                // remove correct prop from answers
                for (let answer of question.answers) {
                    delete answer.correct;
                }
                playNs.to("room1").emit('selectExistingQuestion', question);
            });
        }, countdownSec * 1000);
    });
}


/**
 * @function
 * @param {SocketIO.Server} io
 */
module.exports = (io) => {
    const ns = io.of("admin");
    ns.on("connection", onConnection);
};