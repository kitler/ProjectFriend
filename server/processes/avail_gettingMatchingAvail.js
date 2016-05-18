//Written by Stephen Schroeder
//the following allows a user to get a list of matching availabilities based of a set availability
"use strict"

const errors = require('../middleware/errorHandler').Availability
const db = require('../config').DB;
const Availability = db.import('../models/availability/availabilityUser_model');
const User = db.import('../models/user_model');
const findAvail = require('./avail_findAvail');
const accessValidator = require('./avail_validateAccess')
const async = require('async')
module.exports = function(username, availID){
	return new Promise((resolve, reject)=>{
		db.sync()
			.then(()=>findAvail(availID))
			.then((AvailObj)=>accessValidator(username, AvailObj))
			.then((AvailObj)=>findMatches(AvailObj.username, AvailObj.dataValues.startTime, AvailObj.dataValues.endTime))
			.then((matchList)=>ArrayConverter(matchList))
			.then((completeData)=>resolve(completeData))
			.catch((e)=>reject(e))
	})
}

function findMatches(username, startTime, endTime){
	return new Promise((resolve, reject)=>{
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
			}).then(function(results){
				if(results.length === 0){
					return reject(errors.noMatchingAvailabilities);
				}
				resolve(results)
			}).catch(function(e){
				return reject(e);
			})
		})
	})			
			
}


function getUserProfileAvail(item, callback){
	db.sync().then(function(){
		User.find({where:{username:item.username}}).then(function(profile){
			let result = {}
			delete profile.dataValues.password;
			delete profile.dataValues.id
			result.user = profile.dataValues
			result.event = item
			callback(null, result);
		}).catch(function(e){
			callback(e);
		})
	})
}

function ArrayConverter(arr){
	return new Promise((resolve, reject)=>{
		db.sync().then(function(){
			async.map(arr, getUserProfileAvail,function(e, r){
				if(r !== null){
					resolve(r)
				}else{
					reject(e)
				}
			})
		})
	})
}


