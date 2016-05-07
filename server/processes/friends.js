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
const badRequest = require('../config').badRequest

var acceptUpdateRecord = function(usernameone, usernametwo, res){
	Friend.update({
		status: "ACCEPTED"
	},{
		where: {
			$or:[{
				usernameone: usernameone,
				usernametwo: usernametwo
			},{
				usernameone: usernametwo,
				usernametwo: usernameone
			}]
		}
	}).then(function(arr){
		if(arr.length > 0){
			return res.status(200).send({"success":"Friend request accepted"})
		}
	}).catch(function(err){
		badRequest(err, res)
	})
}

var declineUpdateRecord = function(usernameone, usernametwo, res){
	Friend.update({
		status: "DECLINED"
	},{
		where: {
			$or:[{
				usernameone: usernameone,
				usernametwo: usernametwo
			},{
				usernameone: usernametwo,
				usernametwo: usernameone
			}]
		}
	}).then(function(arr){
		if(arr.length > 0){
			return res.status(200).send({"success":"Friend request declined"})
		}
	}).catch(function(err){
		badRequest(err, res)
	})
}


exports.sendAddRequest = function(req, res, next){

	console.log("MEOWERSFASFASFS", req.user.username)
	const usernameone = req.user.username;
	//req.user;
	const usernametwo = req.body.username;

	db.sync({logging: console.log}).then(function(){
		console.log("Database connected: About to add friend")
		Friend.findOrCreate({where: {
			usernameone: usernameone,
			usernametwo: usernametwo
		}, defaults: {
			status: "SENT"
		}}).spread(function(user, created){
			if(!created){
				return res.status(422).send({error: 'User has already requested friends with person'});
			}else if(user === null){
				return res.status(422).send({error: 'User does not exist'});
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
		Friend.find({where: {
				usernameone: usernameone,
				usernametwo: usernametwo,
				status: "PENDING"
		}}).then(function(friend){
			console.log("u1", usernameone, "u2", usernametwo)
			if(friend === null){
				return res.status(422).send({error: 'Request not found'});
			}
			acceptUpdateRecord(usernameone,usernametwo, res)
			
		}).catch(function(err){
			badRequest(err, res)
		})
	})
}

exports.declineRequest = function(req, res, next){
	const usernameone = req.user.username;
	//req.user;
	const usernametwo = req.body.username;

	db.sync().then(function(){
		Friend.find({where: {
				usernameone: usernameone,
				usernametwo: usernametwo,
				status: "PENDING"
		}}).then(function(friend){
			console.log("u1", usernameone, "u2", usernametwo)
			if(friend === null){
				return res.status(422).send({error: 'Request not found'});
			}
			declineUpdateRecord(usernameone,usernametwo, res)
			
		}).catch(function(err){
			badRequest(err, res)
		})
	})
}
























