var Question = require('./models/model');
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
    });
};