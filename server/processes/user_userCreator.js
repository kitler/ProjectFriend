//Written by Stephen Schroeder
//The following is responsible for creating a new user
//(username, password, email, name, dob)=>Promise[res(user object), rej(err)]
"use strict"
const tokenCreator = require('./auth_tokenCreator')
const Sequelize = require('sequelize'); 
const db = require('../config').DB;
const User = db.import('../models/user_model')
const errors = require('../errors').Auth;


module.exports = function(username, password, email, name, dob){
	return new Promise((resolve, rej)=>{
		db.sync().then(function(){
			User.findOrCreate({where: {username: username}, defaults: {
					email: email,
					password: password,
					name: name,
					DOB: dob
			}}).spread(function(user, created){
				if(!created){
						return rej(errors.userNameTaken);
				}
				tokenCreator(user.username).then((token)=>{
					console.log(username)
					let user = {
						name: username,
						password: 'omitted',
						email: email,
						dob: dob,
						token: token
					}
					console.log('S########## creating')

					return resolve(user);
				})
			}).catch(function(e){
					return rej(e)
			})	
		})
	})
}