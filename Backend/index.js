const MongoClient = require('mongodb').MongoClient;
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors')
const router = require('./router')

// Connection URL
const uri = 'mongodb://localhost:27017';
const databaseName = 'sortorsplode'

// DB Setup
const client = new MongoClient(uri , { useNewUrlParser: true, useUnifiedTopology: true});
client.connect(err => {
    console.log("Connected Sucessfully")
    const db = client.db(databaseName);
    let users = db.collection("users")
    let layouts = db.collection("layouts")
    // let tests = db.collection("tests")

    // print(tests)
    client.close();
});

// let populateTests = (tests) => {
//     tests.insertOne({hello : "world"})
// }

// let print = (tests) => {
//     tests.find().forEach((doc) => {
//         console.log(doc)
//     })
// }

// App Setup
// Middleware, any incoming request is going to be passed into these
// App.use() registers them as middleware

app.use(cors())
app.use(bodyParser.json({ type: '*/*' })) //parsed the body as if it were json no matter the type of the incoming request
router(app)

// Server Setup
const port = process.env.PORT || 5000
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port)

