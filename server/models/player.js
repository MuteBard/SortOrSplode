const mongoose = require("mongoose")
const Schema = mongoose.Schema;


const playerSchema = new Schema({
    id: { type: String, unique: true, lowercase : true},
    name : String,
    rank : String,
    score : Number
})

const modelClass = mongoose.model('player', playerSchema)

module.exports = modelClass