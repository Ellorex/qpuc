const routes = (app) => {
    app.get('/mj', (req, res) => {
        res.sendFile(__dirname+'/static/admin.html');
    })
    app.get('/', (req, res) => {
        res.sendFile(__dirname+'/static/index.html');
    })
}

module.exports = {
    routes
}