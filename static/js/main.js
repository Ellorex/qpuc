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
var idAnswer;
var displayCountdown = document.getElementById('displayCountdown');
var playerName = document.getElementById('playerName');
var displayPlayerName = document.getElementById('displayPlayerName');

let state = null;
if (document.getElementById('btnPlay')) {
    document.getElementById('btnPlay').addEventListener('click', (e) => {
        playerName = playerName.value;
        socket.emit('joinGame', playerName);
    })
}

socket.on('joinGame', (success) => {
    console.log('joingame')
    if (success) {
        console.log('if success')
        displayPlayerName.innerHTML = "Bienvenue " + playerName;
        document.getElementById('player-name-form-row').style.display = 'none';
        document.getElementById('main-container').style.display = 'flex';
    } else {
        console.log('if not')
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

function displayPlayerList(players) {
    console.log("displayPlayerList", players);
    listPlayer.innerHTML = "";
    players.forEach(player => {
        var li = document.createElement('li');
        li.classList.add('player');
        var spanName = document.createElement('span');
        spanName.classList.add('ranking-player-name');
        spanName.innerText = player.name;
        var spanScore = document.createElement('span');
        spanScore.classList.add('ranking-player-score');
        spanScore.innerText = player.score;
        li.setAttribute('id', 'player_' + player.name);
        li.append(spanName);
        li.append(spanScore);
        listPlayer.appendChild(li);
    });
}

if (document.getElementById('btnDisconnection')) {
    var btnDisconnection = document.getElementById('btnDisconnection');

    btnDisconnection.addEventListener('click', (e) => {
        socket.disconnect();
        document.getElementById('player-name-form-row').style.display = 'block';
        document.getElementById('main-container').style.display = 'none';
    })
}

function updateView(state) {
    displayPlayerList(state.players);
}
socket.on("countdown", countdownSec => {
    animCountDown(countdownSec);
    function animCountDown(countdownSec) {
        displayCountdown.innerHTML = "Début du jeu dans : " + countdownSec + "s !";
        setTimeout(() => {
            countdownSec = countdownSec - 1;
            if (countdownSec == 0) {
                displayCountdown.innerHTML = "";
            }
            if (countdownSec > 0) {
                animCountDown(countdownSec);
            }
        }, 1000)
    }
})

socket.on('selectExistingQuestion', data => {
    submitAnswer.disabled = false;
    message.innerHTML = "";
    question = data;
    var answers_str = "";
    questionTitle.innerHTML = data.title;
    var answers = data.answers;

    for (var i = 0; i < answers.length; i++) {

        answers_str += "<div class='col-6 form-check'><input class='form-check-input' type='radio' name='radio' id='" + answers[i]._id + "'> <label class='form-check-label' for='" + answers[i]._id + "'>" + answers[i].title + "</label></div>";
    }
    answersList.innerHTML = answers_str;


});

socket.on("leaderboard", players => {
    displayPlayerList(players);
})

submitAnswer.addEventListener('click', (e) => {
    message.innerHTML = "";

    for (var i = 0; i < radios.length; i++) {
        radios[i].disabled = true;
    }
    submitAnswer.disabled = true;

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
    if (res._id == idAnswer) {
        message.innerHTML = "<div class='alert alert-success text-center m-t-30'>Bonne réponse</div>"
    } else {
        message.innerHTML = "<div class='alert alert-warning text-center m-t-30'>Mauvaise réponse ! La bonne réponse était : " + res.title + "</div>"
    }
})
