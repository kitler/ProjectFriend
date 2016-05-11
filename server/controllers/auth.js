//Written by Stephen Schroeder
//
"use strict"
const jwt = require('jsonwebtoken');
const secret = require('../config').jwtSecret;
const Sequelize = require('sequelize'); 
const db = require('../config').DB;
const badRequest = require('../config').badRequest;
const User = db.import('../models/user_model')
console.log(User)
const errors = require('../errors').Auth

//All tokens will expire within 30 minutes unless they get new one
//The following function creates a JWT given a User model 
function tokenCreator(user){
	const cTime = new Date().getTime();
	const exTime = new Date(cTime + 30*60000);
	return jwt.sign({username: user, iat: cTime}, secret);
}
//The following handles giving the user a JWT token on signin
exports.signin = function(req, res, next){
	let user = req.user
	req.status = 200;
	req.data = {token: tokenCreator(user.username)};
	next()
}

//The following handles local signup
exports.localsignup = function(req, res, next){
	const email = req.body.email;
	const password = req.body.password;
	const username = req.body.username;
	const name = req.body.name;
	const DOB = req.body.DOB

	if(!email || !password || !username || !name|| !DOB){
		return next(errors.missingSignUpParameters)
	}
	db.sync().then(function(){
		User.findOrCreate({where: {username: username}, defaults: {
				email: email,
				password: password,
				name: name,
				DOB: DOB
			}}).spread(function(user, created){
				if(!created){
					return next(422, errors.userNameTaken)
				}

				req.data = {token: tokenCreator(user.username)};
				next()
			}).catch(function(e){
				return next(e)
			})
		
			//The following will look for user with matching name
			
		})
}

exports.controlledResource = (req, res, next)=>{
	const authUser = req.body.userNameTaken;
	const requestedUser = req.params.user

	if(authUser !== requestedUser){
		return next(errors.unauthorizedAccess)
	}else{
		next()
	}
}