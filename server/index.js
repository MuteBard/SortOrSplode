const http = require("http")
const express = require("express")
const cors = require("cors")
const bodyparser = require("body-parser")
const mongoose = require("mongoose")
const router = require("./router")

mongoose.connect('mongodb://localhost:27017/sos', {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

const app = express()
app.use(cors())
app.use(bodyparser.json({type : '*/*'}))
router(app)

const port = process.env.PORT || 3000
const server = http.createServer(app)
server.listen(port)
console.log('Server listening on:', port)
