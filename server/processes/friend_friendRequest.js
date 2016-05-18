"use strict"
//Written by Stephen Schroeder

//The following allows user to send friend request
const db = require('../config').DB;
const Friend = db.import('../models/friend_model')
const User = db.import('../models/user_model')
const errors = require('../middleware/errorHandler').Friends
module.exports = function(loggedUsername, requestedUsername){
	return new Promise((resolve, reject)=>{
		console.log("3333333")
		db.sync()
			.then(()=>checkifUserExists(requestedUsername))
			.then(()=>{
				//We create AB/BA enteries below
				Promise.all([
					createFriend(loggedUsername, requestedUsername, "SENT"),
					createFriend(requestedUsername, loggedUsername, "PENDING")])
					.then((requestObj)=>resolve(requestObj))
					.catch((e)=>reject(e))
			}).catch((e)=>reject(e))
	})
}


function checkifCreated(requestObj, created){
		console.log("3333333")
	return new Promise((resolve, reject)=>{
		if(!created){
			return reject(errors.friendRequestAlreadySent);
		}else if(requestObj === null){
			return reject(errors.userDoesNotExist);
		}
		resolve(requestObj)
	})
}


//This may not be neccesary 
function checkifUserExists(username){
		console.log("333333323")
	return new Promise((resolve, reject)=>{
		User.findOne({where:{username: username}}).then((friend)=>{
			console.log("333333323")
			if(friend === null){
				return reject(errors.userDoesNotExist);
			}
			resolve()
		})
	})
}


function createFriend(usernameA, usernameB, status){
		console.log("33333334")
	return new Promise((resolve, reject)=>{
		Friend.findOrCreate({where: {
			usernameone: usernameA,
			usernametwo: usernameB
		}, defaults: {
			status: status
		}})
		.spread((requestObj, created)=>checkifCreated(requestObj,created))
		.then((requestObj)=>resolve(requestObj))
		.catch((e)=>{
			reject(e)
		})

	})
}