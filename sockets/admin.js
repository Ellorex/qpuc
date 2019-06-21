var Question = require('../models/model');
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

    client.on('selectExistingQuestion', data => {
        console.log(data)
        playNs.emit('selectExistingQuestion', data);
    })
}

/**
 * @function
 * @param {SocketIO.Server} io
 */
module.exports = (io) => {
    const ns = io.of("admin");
    ns.on("connection", onConnection);
};