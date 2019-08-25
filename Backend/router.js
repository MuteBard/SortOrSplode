
module.exports = function(app){
    //any request coming in, must pass our requireAuth function and then it can proceed to the request handler
    app.get('/', (req, res) => {
        res.send({test : 'success'})
    })

    app.get('/good', (req, res) => {
        res.send({isGood : true})
    })
}
