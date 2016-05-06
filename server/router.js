//Handle all routes here
const auth = require('./controllers/auth')

const passportService = require('./services/passport')
const passport = require('passport')

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

	app.get('/user/activefriends', requireAuth, function(req, res){
		res.send("YAY"+ req.user)
	})

	//get current friends list


	//get pending friends requests

	//make friend request

	//accept friends request

	//decline friends request



	//app.post('/signin', requireSignin, Auth.signin)
}


