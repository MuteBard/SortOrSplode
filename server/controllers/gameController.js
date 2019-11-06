const Player = require('../models/player')

exports.saveScore = (req, res, next) => {
    const player = new Player({
        name: req.body.name,
        rank : req.body.rank,
        score: req.body.score
    })

    //save user data
    player.save(err => {
        if (err){ return next(err); }
        getTopScores(res)
    });
}

exports.retriveScores = (req, res, next) => {
    getTopScores(res)
}

let checkIfNameExists = () => {
    Player.findOne({name : player.name }, (err, dbplayer) => {
        if(player.score > dbplayer.score){
            dbplayer.score = player.score
        }
    })
}

let getTopScores = (res) => {
    Player.find().sort('-score').limit(10).exec((err, players) => {
        let playerMap = {}
        players.forEach(player => {
            playerMap[player._id] = player
        })
        res.send(playerMap)
     })
}


