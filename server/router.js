//Handle all routes here
const auth = require('./controllers/auth')
const response = require('./controllers/response')
const passportService = require('./services/passport')
const passport = require('passport')
const friends = require('./processes/friends.js')
const avail = require('./processes/availability.js')
//const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session:false});
const requireAuth = passport.authenticate('jwt', {session: false});
const errorHandler = require('./errors').errorHandler
module.exports = function(app){
	//see if a user with the given email exists
	//app.get('/', requireAuth, function(req, res){
	//	res.send({message: 'Super secret code is ABC1234'})
	//})
	//app.post('/signup', Auth.signup)

	app.post('/auth/local/signin', requireSignin, auth.signin, response.send);
	app.post('/auth/local/signup', auth.localsignup, response.send);


	//signup

	//google signin

	//signout

	//=====friends=====
	//accepts username in body

	app.post('/user/friends/add', requireAuth, friends.sendAddRequest)
	app.post('/user/friends/accept', requireAuth, friends.acceptRequest)
	app.post('/user/friends/decline', requireAuth, friends.declineRequest)
	app.get('/user/friends', requireAuth, friends.getFriends)
	app.get('/user/friends/pending', requireAuth, friends.getPending)

	app.get('/', function(req, res){
		res.send("YAY")
	})
	//get current friends list


	////======Availability======
	app.post('/user/availability', requireAuth, avail.addAvailability, response.send)

	//get possible matches
	//post send request to hang
	//put decline request to hang
	//put accept request to hang
	app.post('/user/availability/list', requireAuth, avail.getPossibleMatches, response.send)

	//get pending friends requests

	//make friend request

	//accept friends request

	//decline friends request

	app.use(errorHandler)

	//app.post('/signin', requireSignin, Auth.signin)
}


