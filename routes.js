const animateurRoutes = (app) => {
    app.get('/mj', (req, res) => {
        res.sendFile(__dirname+'/static/admin.html');
    })
}

const participantRoutes = (app) => {
    app.get('/', (req, res) => {
        res.sendFile(__dirname+'/static/index.html');
    })
}

module.exports = {
    animateurRoutes,
    participantRoutes
}