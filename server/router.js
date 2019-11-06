const gameController = require('./controllers/gameController')


module.exports = function(app){
    app.get('/topscores',gameController.retriveScores)
    app.post('/gameover', gameController.saveScore)
}


