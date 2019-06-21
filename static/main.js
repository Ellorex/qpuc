var socket = io("/play", { transports: ['websocket'], upgrade: false });
var playerName = null;

let state = null;

document.getElementById('btnPlay').addEventListener('click', (e) => {
    playerName = document.getElementById('playerName').value;
    socket.emit('joinGame', playerName);
})

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

function updateView(state) {

}