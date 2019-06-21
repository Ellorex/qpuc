var socket = io("/admin", { transports: ['websocket'], upgrade: false });

var inputs = document.getElementsByTagName("input");
var newQuestion = document.getElementById('newQuestion');
var newAnswer1 = document.getElementById('newAnswer1');
var newAnswer2 = document.getElementById('newAnswer2');
var newAnswer3 = document.getElementById('newAnswer3');
var newAnswer4 = document.getElementById('newAnswer4');
var newAnswer1Correct = document.getElementById('newAnswer1Correct');
var newAnswer2Correct = document.getElementById('newAnswer2Correct');
var newAnswer3Correct = document.getElementById('newAnswer3Correct');
var newAnswer4Correct = document.getElementById('newAnswer4Correct');
var radios = document.getElementsByName("radio");

var submitNewQuestion = document.getElementById('submitNewQuestion');
var message = document.getElementById('message');

var selectQuestions = document.getElementById('selectQuestions');
var sendQuestion = document.getElementById('sendQuestion');
var endGame = document.getElementById('endGame');
var verifinput = false;
var verifradios = false;

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

    //check if one radio in checked
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            verifradios = true;
            break;
        }
    }

    // check no field is empty
    if (newQuestion.value != "" && newAnswer1.value != "" && newAnswer2.value != "" && newAnswer3.value != "" && newAnswer4.value != "") {
        verifinput = true;
    }


    if (verifinput && verifradios) {

        //Clear all inputs
        for (var ii = 0; ii < inputs.length; ii++) {
            if (inputs[ii].type == "text") {
                inputs[ii].value = "";
            } else if(inputs[ii].type == "radio") {
                for(var i=0;i<inputs.length;i++)
                inputs[i].checked = false;
            }
        }
        
        message.innerHTML = "<div class='alert alert-success text-center'>La question a bien été enregistrée</div>";
        socket.emit('insertQuestions', question);
    } else if (verifinput && !verifradios) {
        message.innerHTML = "<div class='alert alert-danger text-center'>Merci de sélectionner la bonne réponse</div>"
    } else {
        message.innerHTML = "<div class='alert alert-danger text-center'>Merci de renseigner tous les champs</div>"
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
    endGame.addEventListener('click', (e) => {
        socket.emit('endGame');
    })
});

