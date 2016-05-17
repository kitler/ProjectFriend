"use strict"
const errors = require('../middleware/errorHandler').Availability
const db = require('../config').DB;
const Availability = db.import('../models/availability/availabilityUser_model');
const User = db.import('../models/user_model');
const moment = require('moment');

module.exports = (username, startTime, endTime, title)=>{
	return new Promise((resolve, reject)=>{
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
						return reject(errors.overlappingAvailability);
					}
					return resolve(availability);
					//return res.status(200).send({success: "Succesfully added availability"}); 
				}).catch(function(err){
					return reject(err);
				})
			}).catch(function(err){
					return reject(err);
			})
		}).catch(function(err){
			return reject(err);
		})
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