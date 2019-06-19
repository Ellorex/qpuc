const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    title: String,
    answers: [{
            title: String,
            correct: Boolean
        }]

})

const Question = mongoose.model('question', questionSchema);

module.exports = Question;