const express = require('express')
const http = require('http')
//const Router = require('./router.js')
const app = express()
const bodyParser = require('body-parser')
const auth = require('./controllers/auth')
const user = require('./controllers/user')
const friends = require('./controllers/friends')
const availability = require('./controllers/availability')
const errorHandler = require('./middleware/errorHandler').errorHandler
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});

var logging = (req, res, next)=>{
	if(req.url === undefined){
		console.log(req)
	}
	console.log("$$$$$$$$$$$$$$$$$$$$$", req.url)
	next()
}
app.use(bodyParser.json({type: '*/*'}))
app.set('json spaces', 2)
app.use('/api/v1/auth', auth)
app.use('/api/v1/user', user)
app.use('/api/v1/user/:userID/friends', requireAuth, friends)
app.use('/api/v1/user/availability', logging, availability)

app.use(errorHandler)
//Router(app)


const port = process.env.PORT || 3090
const server = http.createServer(app);

//This starts the server listening on the following port
const run = server.listen(port);

module.exports = run;
console.log('Server listening on:', port)



//this will connect to database and creeate any needed fields
