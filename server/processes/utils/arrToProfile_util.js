//This needs reworking to be condensed
"use strict"
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
	async.map(arr, getUserProfileAvail,function(e, r){
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
			profile.dataValues.event = {}
			profile.dataValues.event.startTime = item.startTime;
			profile.dataValues.event.endTime = item.endTime;
			callback(null, profile);
		}).catch(function(e){
			callback(e);
		})
	})
}


function responseCreator(e,r,res,next){
	if(r !== null){
		let matches = {}
		matches.results = r
		return res.status(200).json(matches);
	}else if(e !== null){
		return next(422, e);
	}
	
}