var socket = io("/play", { transports: ['websocket'], upgrade: false });
var questionTitle = document.getElementById('questionTitle');
var answersList = document.getElementById('answersList');
var playerName = null;
var listPlayer = document.getElementById('listPlayer');
var submitAnswer = document.getElementById('submitAnswer');
var radios = document.getElementsByName("radio");
var verifradios = false;
var message = document.getElementById('message');
var ranking = null;
var question;

let state = null;
if (document.getElementById('btnPlay')) {
    document.getElementById('btnPlay').addEventListener('click', (e) => {
        playerName = document.getElementById('playerName').value;
        socket.emit('joinGame', playerName);
    })
}

socket.on('joinGame', (success) => {
    if (success) {
        document.getElementById('player-name-form-row').style.display = 'none';
        document.getElementById('main-container').style.display = 'flex';
    } else {
        var alert = document.createElement('div');
        alert.classList.add('alert');
        alert.classList.add('alert-danger');
        alert.classList.add('m-t-30');
        alert.setAttribute('id', 'alert');
        alert.innerText = 'Ce joueur existe déjà. Veuillez choisir un autre nom.';
        document.getElementById('player-name-form-row').append(alert);
    }
});

// emitted once after the player joined the game
socket.on("gameState", s => {
    state = s;
    updateView(state);
});

function displayPlayerList(state) {
    state.players.forEach(player => {
        var li = document.createElement('li');
        li.classList.add('player');
        li.setAttribute('id', 'player_' + player.name);
        li.innerText = player.name;
        listPlayer.appendChild(li);
    });
}

function displayRanking(state) {
    ranking = document.getElementById('ranking');
    state.players.forEach(player => {
        var li = document.createElement('li');
        li.setAttribute('id', 'player_' + player.name);
        var spanName = document.createElement('span');
        var spanScore = document.createElement('span');
        spanName.classList.add('ranking-player-name');
        spanName.innerText = player.name;
        spanScore.classList.add('ranking-player-score');
        spanScore.innerText = player.score;
        li.append(spanName);
        li.append(spanScore);
        ranking.appendChild(li);
    })
}

function updateView(state) {
    listPlayer.innerHTML = "";
    displayPlayerList(state);
    displayRanking(state);
}

socket.on('selectExistingQuestion', data => {
    question = data;
    var answers_str = "";
    questionTitle.innerHTML = data.title;
    var answers = data.answers;

    for (var i = 0; i < answers.length; i++) {

        answers_str += "<div class='col-6 form-check'><input class='form-check-input' type='radio' name='radio' id='" + answers[i]._id + "'> <label class='form-check-label' for='" + answers[i]._id + "'>" + answers[i].title + "</label></div>";
    }
    answersList.innerHTML = answers_str;


});

submitAnswer.addEventListener('click', (e) => {
    message.innerHTML = "";
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            idAnswer = radios[i].id
            verifradios = true;
            break;
        }
    }
    if (verifradios) {
        answers = question.answers;
        for (i = 0; i < answers.length; i++) {
            var indexAnswer;
            if (answers[i]._id == idAnswer) {
                indexAnswer = i;
                // if (answers[i].correct == true) {
                //     message.innerHTML = "<div class='alert alert-success text-center m-t-30'>Bonne réponse</div>"
                // } else {
                //     message.innerHTML = "<div class='alert alert-warning text-center m-t-30'>Mauvaise réponse</div>"
                // }
            }

        }
        socket.emit('sendAnswer', indexAnswer);
    } else {
        message.innerHTML = "<div class='alert alert-danger text-center m-t-30'>Vous n'avez pas entré de réponse</div>"
    }
});

socket.on('answerResult', res => {
    console.log(res)
})



