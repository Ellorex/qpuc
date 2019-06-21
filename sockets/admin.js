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

                    gameState.getPlayerAnswers().then(answers => {
                        playNs.to("room1").emit("answerResult", gameState.getCorrectAnswer());
                        playNs.to("room1").emit("playerAnswers", answers);
                    });
                });
            }).then(() => {
                // remove correct property from answers
                const answers = question.answers.map(x => {
                    return {
                        _id: x._id,
                        title: x.title
                    };
                });
                playNs.to("room1").emit('selectExistingQuestion', {
                    title: question.title,
                    answers: answers
                });
            });
        }, countdownSec * 1000);
    });

    client.on("endGame", () => {
        gameState.endGame();
        playNs.to("room1").emit("gameEnded");
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