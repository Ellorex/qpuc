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
var message = document.getElementById('message');

var selectQuestions = document.getElementById('selectQuestions');
var sendQuestion = document.getElementById('sendQuestion');
var verif = false;

submitNewQuestion.addEventListener('click', (e) => {

    if (newQuestion.value != "" && newAnswer1.value != "" && newAnswer2.value != "" && newAnswer3.value != "" && newAnswer4.value != "") {
        verif = true;
    }

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
    if (verif) {
        console.log('ok');
        message.innerHTML = "La question a bien été enregistrée";
        socket.emit('insertQuestions', question);
    } else {
        message.innerHTML = "Merci de renseigner tous les champs"
    }


})

socket.on('loadQuestions', data => {

    var res = [];
    var options_str = '<option value="">-- Sélectionner une question --</option>';

    // Create array of questions
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            res.push(data[i]);
        }
    }

    // Insert titles in select
    for (var i = 0; i < res.length; i++) {
        options_str += '<option value="' + res[i].title + '">' + res[i].title + '</option>';
    }
    selectQuestions.innerHTML = options_str;

    // Emit selected question
    sendQuestion.addEventListener('click', (e) => {
        var selectedQuestion = res.find(r => r.title == selectQuestions.value);
        if (selectedQuestion) {
            console.log('emit');

            socket.emit('selectExistingQuestion', selectedQuestion);
        }

    });
});

