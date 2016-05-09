//Handle all routes here
const auth = require('./controllers/auth')

const passportService = require('./services/passport')
const passport = require('passport')
const friends = require('./processes/friends.js')
const avail = require('./processes/availability.js')
//const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session:false});
const requireAuth = passport.authenticate('jwt', {session: false});
module.exports = function(app){
	//see if a user with the given email exists
	//app.get('/', requireAuth, function(req, res){
	//	res.send({message: 'Super secret code is ABC1234'})
	//})
	//app.post('/signup', Auth.signup)

	app.post('/auth/local/signin', requireSignin, auth.signin);
	app.post('/auth/local/signup', auth.localsignup);


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
	app.post('/user/availability', requireAuth, avail.addAvailability)

	//get possible matches
	//post send request to hang
	//put decline request to hang
	//put accept request to hang
	app.get('/user/availability', requireAuth, avail.getPossibleMatches)

	//get pending friends requests

	//make friend request

	//accept friends request

	//decline friends request

	app.use(function(err, req, res, next) {
  		//do logging and user-friendly error message display
  		console.log('Here')
  		res.status(err.code).send({status:err.code, message: err.error, type:'internal'});
	})

	//app.post('/signin', requireSignin, Auth.signin)
}


