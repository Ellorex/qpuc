var socket = io({ transports: ['websocket'], upgrade: false });
var playerName = null;

document.getElementById('btnPlay').addEventListener('click', (e) => {
    playerName = document.getElementById('playerName').value;
    socket.emit('checkPlayerName', playerName);
})

socket.on('checkPlayerName', (isExistPlayerName) => {
    if (!isExistPlayerName) {
        document.getElementById('player-name-form-row').style.display = 'none';
        document.getElementById('main-container').style.display = 'block';
    } else {
        var alert = document.createElement('div');
        alert.classList.add('alert');
        alert.classList.add('alert-danger');
        alert.setAttribute('id', 'alert');
        alert.innerText = 'Ce joueur existe déjà. Veuillez choisir un autre nom.';
        document.getElementById('player-name-form-row').appendChild(alert);
        
    }
});
