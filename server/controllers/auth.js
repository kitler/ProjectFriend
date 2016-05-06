//Written by Stephen Schroeder
//

const jwt = require('jsonwebtoken');
const secret = require('../config').jwtSecret;
const Sequelize = require('sequelize'); 
const db = require('../config').DB;
const User = db.import('../models/model')
console.log(User)

//All tokens will expire within 30 minutes unless they get new one
//The following function creates a JWT given a User model 
function tokenCreator(user){
	const cTime = new Date().getTime();
	const exTime = new Date(cTime + 30*60000);
	console.log("username", user)
	return jwt.sign({username: user, iat: cTime}, secret);
}
//The following handles giving the user a JWT token on signin
exports.signin = function(req, res, next){
	console.log(req.body.username)
	res.send({token: tokenCreator(req.body.username)})
}

//The following handles local signup
exports.localsignup = function(req, res, next){
	const email = req.body.email;
	const password = req.body.password;
	const username = req.body.username;
	const name = req.body.name;

	if(!email || !password || !username || !name){
		return res.status(422).send({error: 'You must provide e-mail, username, name, and password'})
	}
	db.sync({logging: console.log}).then(function(){
		User.findOrCreate({where: {username: username}, defaults: {
				email: email,
				password: password,
				name: name
			}}).spread(function(user, created){
				if(!created){
					return res.status(422).send({error: 'Username is in use'});
				}

				res.json({token: tokenCreator(user.username)});
			})
		
			//The following will look for user with matching name
			
		})
}