const db = require('../../config').DB;
const Friend = db.import('../../models/friend_model')

exports.removeTestRecord = function(username1, username2){
	return new Promise((resolve, reject)=>{
		db.sync()
			.then(()=>recordFinder(username1, username2))
			.then((friendRecord)=>recordRemover(friendRecord))
			.then(()=>recordFinder(username2, username1))
			.then((friendRecord)=>recordRemover(friendRecord))
			.then(()=>resolve())
			.catch((e)=>reject(e))
	})
}


function recordFinder(username1, username2){
	return new Promise((resolve, reject)=>{
		Friend.find({
			where: {
				usernameone: username1,
				usernametwo: username2
			}
		}).then((friendRecord)=>{
			if(friendRecord){
				resolve(friendRecord)
			}else{
				reject("not found")
			}
		}).catch((e)=>{
			reject(e)
		})
	})
}

function recordRemover(friendRecord){
	return new Promise((resolve, reject)=>{
		friendRecord.destroy().then(function(){
			console.log('Test friend Removed');
			return resolve()
		}).catch((e)=>{
			reject(e)
		})
	})
}