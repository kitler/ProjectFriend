//Handle all routes here
const auth = require('./controllers/auth')

const passportService = require('./services/passport')
const passport = require('passport')
const friends = require('./processes/friends.js')

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

	app.get('/', function(req, res){
		res.send("YAY")
	})
	//get current friends list


	//get pending friends requests

	//make friend request

	//accept friends request

	//decline friends request



	//app.post('/signin', requireSignin, Auth.signin)
}


