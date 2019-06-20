var Question = require('./models/model');
var playersService = require('./services/players');

module.exports = (io) => {
    io.on('connection', client => {
        Question.find({}).exec().then(data => {
            io.emit('loadQuestions', data);
        });
        client.on('insertQuestions', data => {
            var question = new Question(data);
            question.save()
                .then(data => {
                    Question.find({}).exec()
                        .then(data => {
                            io.emit('loadQuestions', data)
                        })
                })

        })

        client.on('selectExistingQuestion', data => {
            client.broadcast.emit('selectExistingQuestion', data);
        })

        client.on('checkPlayerName', name => {
            console.log('receved checkPlayerName : ' + name);
            playersService.getPlayer(name).then(isPlayerNameExist => {
                if (!isPlayerNameExist) {
                    io.emit('checkPlayerName', isPlayerNameExist);
                }
            });
        })
    });
};