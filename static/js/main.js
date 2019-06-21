var socket = io("/play", { transports: ['websocket'], upgrade: false });
var playerName = null;
var ranking = document.getElementById('ranking');

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
        document.getElementById('main-container').style.display = 'block';
        console.log("joined the game");
    } else {
        console.log("Player name taken");
        var alert = document.createElement('div');
        alert.classList.add('alert');
        alert.classList.add('alert-danger');
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

function displayPlayerList (state) {
    var listPlayer = document.getElementById('listPlayer');
    state.players.forEach(player => {
        var li = document.createElement('li');
        li.classList.add('player');
        li.setAttribute('id', 'player_'+player.name);
        li.innerText = player.name;
        listPlayer.appendChild(li);
    });
}

function displayRanking(state) {
    state.players.forEach(player => {
        var li = document.createElement('li');
        li.setAttribute('id', 'player_'+player.name);
        var spanName = document.createElement('span');
        var spanScore = document.createElement('span');
        spanName.classList.add('raking-player-name');
        spanName.innerText = player.name;
        spanScore.classList.add('raking-player-score');
        spanScore.innerText = player.score;
        li.append(spanName);
        li.append(spanScore);
        ranking.appendChild(li);
    })
}

function updateView(state) {
    displayPlayerList(state);
    displayRanking(state);
}
