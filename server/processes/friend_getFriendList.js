const db = require('../config').DB;
const Friend = db.import('../models/friend_model')
const errors = require('../middleware/errorHandler').Friends
module.exports = function(usernameone){
	return new Promise((resolve, reject)=>{
		db.sync().then(function(){
			Friend.findAll({where:{
				usernameone: usernameone,
				status: "ACCEPTED"
			}}).then(function(friends){
				if(friends.length === 0){
					return reject(errors.noFriendsFound);
				}
				return resolve(frineds)
			}).catch(function(e){
				return reject(e)
			})
		})
	})
}