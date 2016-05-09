//This needs reworking to be condensed

const db = require('../../config').DB;
const User = db.import('../../models/user_model')
const badRequest = require('../../config').badRequest
const async = require('async')

exports.friendsArrayConveter = function(arr, res, next){
	async.map(arr, getUserProfileFriend,function(e, r){
		responseCreator(e,r,res,next)
	})
}

exports.availArrayConveter = function(arr, res, next){
	async.map(arr, getUserProfileaAvail,function(e, r){
		responseCreator(e,r,res,next)
	})
}

function getUserProfileFriend(item, callback){
	db.sync().then(function(){
		User.find({where:{username:item.usernametwo}}).then(function(profile){
			delete profile.dataValues.password;
			callback(null, profile);
		}).catch(function(e){
			callback(e);
		})
	})
}

function getUserProfileAvail(item, callback){
	db.sync().then(function(){
		User.find({where:{username:item.username}}).then(function(profile){
			delete profile.dataValues.password;
			profile.startTime = item.startTime;
			profile.endTime = item.endTime;
			callback(null, profile);
		}).catch(function(e){
			callback(e);
		})
	})
}


function responseCreator(e,r,res,next){
	if(r !== null){
		var json = JSON.stringify(r);
		return res.status(200).send(r);
	}else if(e !== null){
		return next(badRequest(422, e));
	}
	
}