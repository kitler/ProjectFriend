const errors = require('../middleware/errorHandler').Availability
const db = require('../config').DB;
const Availability = db.import('../models/availability/availabilityUser_model');
const AvailabilityMatch = db.import('../models/availability/availabilityMatch_model');
const User = db.import('../models/user_model');
const findAvail = require('./avail_findAvail');
const validateAccess = require('./avail_validateAccess')
const getStatus = require('./friend_getStatus')

//1. need to validate that user logged in matches requested resource
//2. need to check if request availability is friend restricted or global
//3a. if requested availability is

module.exports = (loggedInUser, requestersAvailID, requestedMatchAvailID)=>{
	return new Promise((resolve, reject)=>{
		findAvail(requestersAvailID)
		.then((loggedAvailObj)=>validateAccess(loggedInUser, loggedAvailObj))
		.then((loggedAvailObj)=>{
			findAvail(requestedMatchAvailID)
			.then((reqAvailObj)=>{
				if(!reqAvailObj.globalMatch && !evaluatePrivate(loggedInUser, reqAvailObj)){
					return reject(errors.notFriendsWithUser)
				}


			}).catch((e)=>reject(e))
		}).catch((e)=>reject(e))
	})
}



function evaluatePrivate(loggedInUser, reqAvailObj){
	getStatus(loggedInUser, reqAvailObj.username).then((friendObj)=>{
		if(friendObj.status === "ACCEPTED"){
			return true;
		}else{
			return false;
		}
	})
}

function createMatch(loggedAvailID, reqAvailID){

}
