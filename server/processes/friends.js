/*Written by Stephen Schroeder
The following file holds all functions for:
	+Sending friend request
	+Getting friend requests
	+Approving friend requests
	+Getting list of friends
	+Removing Friends
*/
//Friend requests create an AB/BA relationship in database

//Friend statuses PENDING, CONFIRMED, DECLINED, SENT
const db = require('../config').DB;
const Friend = db.import('../models/friend_model')
const User = db.import('../models/user_model')
const badRequest = require('../config').badRequest
const async = require('async')
const friendsArrayConverter = require('./utils/arrToProfile_util')
const whereUpdateStatus = function(usernameone, usernametwo){
	var where = {
		where: {
			$or:[{
				usernameone: usernameone,
				usernametwo: usernametwo
			},{
				usernameone: usernametwo,
				usernametwo: usernameone
			}]
		}
	}
	return where;
}

var acceptUpdateRecord = function(usernameone, usernametwo, res){
	Friend.update({
		status: "ACCEPTED"
	},whereUpdateStatus(usernameone,usernametwo)).then(function(arr){
		if(arr.length > 0){
			return res.status(200).send({"success":"Friend request accepted"})
		}
	}).catch(function(err){
		return next(badRequest(422, err))
	})
}

var declineUpdateRecord = function(usernameone, usernametwo, res){
	Friend.update({
		status: "DECLINED"
	},whereUpdateStatus(usernameone,usernametwo)).then(function(arr){
		if(arr.length > 0){
			return res.status(200).send({"success":"Friend request declined"})
		}
	}).catch(function(err){
		return next(badRequest(422, err))
	})
}

var checkIfPending = function(usernameone, usernametwo, res, cb){
	Friend.find({where: {
				usernameone: usernameone,
				usernametwo: usernametwo,
				status: "PENDING"
		}}).then(function(friend){
			if(friend === null){
				return next(badRequest(422, "request not found"))
			}
			cb(usernameone, usernametwo, res)
			
		}).catch(function(err){
			return next(badRequest(422, err))
		})
}

//This function will take two usernames and make a friend request
//it will create an AB/BA relationship
exports.sendAddRequest = function(req, res, next){
	const usernameone = req.user.username;
	const usernametwo = req.body.username;

	db.sync().then(function(){
		Friend.findOrCreate({where: {
			usernameone: usernameone,
			usernametwo: usernametwo
		}, defaults: {
			status: "SENT"
		}}).spread(function(user, created){
			if(!created){
				return next(badRequest(422,"User has already requested friends with person"));
			}else if(user === null){
				return next(badRequest(422,'User does not exist'));
			}

			Friend.create({
				usernameone: usernametwo,
				usernametwo: usernameone,
				status: "PENDING"
			}).then(function(){
				return res.status(200).send({"success":"Friend request sent"})
			})
		})
			
	})
}

//accept request expects the user of the api to pass it the username of the pending friend
exports.acceptRequest = function(req, res, next){
	const usernameone = req.user.username;
	//req.user;
	const usernametwo = req.body.username;

	db.sync().then(function(){
		checkIfPending(usernameone, usernametwo, res, acceptUpdateRecord)
	}).catch(function(e){
		return next(badRequest(422, e))
	})
}

exports.declineRequest = function(req, res, next){
	const usernameone = req.user.username;
	//req.user;
	const usernametwo = req.body.username;

	db.sync().then(function(){
		checkIfPending(usernameone, usernametwo, res, declineUpdateRecord)
	}).catch(function(e){
			return next(badRequest(422, e))
	})
}

exports.getFriends = function(req, res, next){
	const usernameone = req.user.username;
	//req.user;
	db.sync().then(function(){
		Friend.findAll({where:{
			usernameone: usernameone,
			status: "ACCEPTED"
		}}).then(function(friends){
			friendsArrayConveter(friends, res);
		}).catch(function(e){
			return next(badRequest(422, e))
		})
	})

}

exports.getPending = function(req, res, next){
	db.sync().then(function(){
		Friend.findAll({where:{
			usernameone: usernameone,
			status: "PENDING"
		}}).then(function(friends){
			friendsArrayConveter(friends, res, next);
		}).catch(function(e){
			return next(badRequest(422, e))
		})
	})
}

//This runs async map to connect to database to pull profiles for each friend
//Takes friends and res object
























