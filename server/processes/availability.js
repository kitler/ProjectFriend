"use strict"

const db = require('../config').DB;
const errors = require('../middleware/errors').Availability
const Friend = db.import('../models/friend_model');
const Availability = db.import('../models/availability/availabilityUser_model');
const User = db.import('../models/user_model');
const badRequest = require('../config').badRequest;
const async = require('async');
const ArrayConverter = require('./utils/arrToProfile_util').availArrayConveter;
const moment = require('moment');

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
	const title = req.body.title;
	//const availType = req.body.availType;
	validateEntry(startTime, endTime).then(()=>{
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
					globalMatch: false,
					title: title
				}
			}).spread(function(availability, created){
				if(!created){
					return next(errors.overlappingAvailability);
				}

				req.data = availability;
				return next()
				//return res.status(200).send({success: "Succesfully added availability"}); 
			}).catch(function(err){
				return next(err);
			})
		
		})
	}).catch((err)=>{
		next(err);
	})

}

exports.getPossibleMatches = function(req, res, next){
	//(StartA <= EndB) and (EndA >= StartB)
	const username = req.user.username;
	const startTime = req.body.startTime;
	const endTime = req.body.endTime;
	//const availType = req.body.availType;
	validateEntry(startTime, endTime).then(()=>{
	
	}).catch((err)=>{
		next(err);
	})
}


function validateEntry(startTime, endTime){
	return new Promise((resolve, reject)=>{

		//Check to see if start and end are valid
		if(startTime === null || endTime === null){
			reject(errors.nullInputDates)
		}
		let newStart = moment(startTime)
		let newEnd = moment(endTime)

		if(newEnd.isBefore(newStart)){
			reject(errors.endIsBeforeStart)
		}else{
			resolve()
		}
	})

}