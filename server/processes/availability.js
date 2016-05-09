const db = require('../config').DB;
const Friend = db.import('../models/friend_model')
const Availability = db.import('../models/availability/availabilityUser_model')
const User = db.import('../models/user_model')
const badRequest = require('../config').badRequest
const async = require('async')
const friendsArrayConverter = require('./utils/arrToProfile_util')

//add availability requires user to be authed and 
// +provide start date
// +provide start time
// +provide end date
// +provide end time
// +provide availability types
exports.addAvailability = function(req, res, next){
	const username = req.user.username;
	const startTime = req.body.startTime;
	const endTime = req.body.endTime;
	//const availType = req.body.availType;

	db.sync().then(function(){
		Availability.findOrCreate({where: {
				username: username,
				startTime:{
					$lte: endTime
				},
				endTime: {
					$gte: startTime
				}
			}, defaults:{
				username: username,
				startTime: startTime,
				endTime: endTime,
				globalMatch: false
			}
		}).spread(function(availability, created){
			if(!created){
				return next(badRequest(422,"Overlapping availability"));
			}
			return res.status(200).send({success: "Succesfully added availability"}); 
		}).catch(function(err){
			return next(badRequest(422, err));
		})
	
	})

}

exports.getOverlapTimes = function(req, res, next){
	//(StartA <= EndB) and (EndA >= StartB)
	const username = req.user.username;
	const startTime = req.body.startTime;
	const endTime = req.body.endTime;
	//const availType = req.body.availType;

	db.sync().then(function(){
		Availability.findAll({where: {
				username: {
					$not: username,
				},
				startTime:{
					$lte: endTime
				},
				endTime: {
					$gte: startTime
				}
			}
		}).then(function(results, created){
			if(results.length > 0){
				return next(badRequest(422,"There was no matching times"));
			}
			return availArrayConverter(results,res,next);
		}).catch(function(err){
			return next(badRequest(422, err));
		})
	
	})

}