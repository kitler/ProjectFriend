const db = require('../config').DB;
const Friend = db.import('../models/friend_model')
const errors = require('../middleware/errorHandler').Friends
module.exports = function(loggedUsername, requestedUsername){
	return new Promise((resolve, reject)=>{
		db.sync().then(function(){
			Friend.findAll({where:{
				usernameone: loggedUsername,
				usernametwo: requestedUsername
			}}).then(function(friends){
				if(friends.length === 0){
					return reject(errors.noFriendsFound);
				}
				return resolve(friends)
			}).catch(function(e){
				return reject(e)
			})
		})
	})
}