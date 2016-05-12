//Written by Stephen Schroeder
//
"use strict"
const rt = require('express').Router();
const tokenCreator = require('../processes/auth_tokenCreator');
const responseModel = require('../models/response_Model');
//All tokens will expire within 30 minutes unless they get new one
//The following function creates a JWT given a User model


rt.post('/local', (req, res, next)=>{
	let user = req.body.username
	let password = req.body.password
	if(!user || !password){
		next()
	}
	tokenCreator(user).then((token)=>{
		let response = responseModel('success', token)
		res.status = 200;
		res.json(response)
	})
}) 

module.exports = rt;



//The following handles local signup
/*exports.localsignup = function(req, res, next){
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
}*/

/*exports.controlledResource = (req, res, next)=>{
	const authUser = req.body.userNameTaken;
	const requestedUser = req.params.user

	if(authUser !== requestedUser){
		return next(errors.unauthorizedAccess)
	}else{
		next()
	}
}*/