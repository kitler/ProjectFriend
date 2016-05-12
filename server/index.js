const express = require('express')
const http = require('http')
const Router = require('./router.js')
const app = express()
const bodyParser = require('body-parser')
const auth = require('./controllers/auth')
const user = require('./controllers/user')
const errorHandler = require('./middleware/errorHandler').errorHandler

app.use(bodyParser.json({type: '*/*'}))

app.use('/api/v1/auth', auth)
app.use('/api/v1/user', user)

app.use(errorHandler)
//Router(app)

const port = process.env.PORT || 3090
const server = http.createServer(app);

//This starts the server listening on the following port
const run = server.listen(port);

module.exports = run;
console.log('Server listening on:', port)



//this will connect to database and creeate any needed fields
