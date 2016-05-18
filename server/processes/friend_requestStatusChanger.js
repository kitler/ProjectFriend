
const db = require('../config').DB;
const Friend = db.import('../models/friend_model')
const User = db.import('../models/user_model')
const errors = require('../middleware/errorHandler').Friends
const checkIfPending = require('./friend_checkIfPending');
const async = require('async')
module.exports = function(loggedUser, requestedUser, status){
	return new Promise((resolve, reject)=>{
		db.sync()
			.then(()=>checkIfPending(loggedUser, requestedUser))
			.then((records)=>updateRecords(loggedUser, requestedUser, status))
			.then((updatedRecords)=>resolve(updatedRecords))
			.catch((e)=>reject(e))
	})
}

function updateRecords(loggedUser, requestedUser, status){
	return new Promise((resolve, reject)=>{
		Friend.update({
			status: status
		},{
			where: {
				$or:[{
					usernameone: loggedUser,
					usernametwo: requestedUser
				},{
					usernameone: requestedUser,
					usernametwo: loggedUser
				}]
			}
		}).then((updatedRecords)=>{
			resolve(updatedRecords)
		}).catch((e)=>reject(e))
	})
}