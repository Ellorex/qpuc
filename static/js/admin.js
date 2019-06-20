var socket = io({ transports: ['websocket'], upgrade: false });

var newQuestion = document.getElementById('newQuestion');
var newAnswer1 = document.getElementById('newAnswer1');
var newAnswer2 = document.getElementById('newAnswer2');
var newAnswer3 = document.getElementById('newAnswer3');
var newAnswer4 = document.getElementById('newAnswer4');
var newAnswer1Correct = document.getElementById('newAnswer1Correct');
var newAnswer2Correct = document.getElementById('newAnswer2Correct');
var newAnswer3Correct = document.getElementById('newAnswer3Correct');
var newAnswer4Correct = document.getElementById('newAnswer4Correct');

var submitNewQuestion = document.getElementById('submitNewQuestion');

var selectQuestions = document.getElementById('selectQuestions');

submitNewQuestion.addEventListener('click', (e) => {
    var question = {
        title: newQuestion.value,
        answers: [{
            title: newAnswer1.value,
            correct: newAnswer1Correct.checked
        },
        {
            title: newAnswer2.value,
            correct: newAnswer2Correct.checked
        },
        {
            title: newAnswer3.value,
            correct: newAnswer3Correct.checked
        },
        {
            title: newAnswer4.value,
            correct: newAnswer4Correct.checked
        }]
    }
    socket.emit('insertQuestions', question)

})

socket.on('loadQuestions', data => {
    
    var res = [];
    var options_str = "";

    if(data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            res.push(data[i].title)
        }
    }

    for (var i = 0; i < res.length; i++)  {
        options_str += '<option value="' + res[i] + '">' + res[i] + '</option>';
    }

    selectQuestions.innerHTML = options_str
})