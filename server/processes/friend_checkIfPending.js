const db = require('../config').DB;
const Friend = db.import('../models/friend_model')
const errors = require('../middleware/errorHandler').Friends
module.exports = function checkIfPending(usernameone, usernametwo){
	return new Promise((resolve, reject)=>{
		console.log("HEHHEHEEEEEE")
		Friend.findAll({where: {
				usernameone: usernameone,
				usernametwo: usernametwo,
				status: "PENDING"
		}}).then(function(friend){
			console.log(friend)
			if(friend.length === 0){
				return reject(errors.requestNotFound)
			}
			resolve(friend)
		}).catch(function(err){
				return reject(err)
		})
	})
}