const express = require('express')
const http = require('http')
const Router = require('./router.js')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json({type: '*/*'}))
Router(app)

const port = process.env.PORT || 3090
const server = http.createServer(app);

//This starts the server listening on the following port
const run = server.listen(port);

module.exports = run;
console.log('Server listening on:', port)



//this will connect to database and creeate any needed fields
