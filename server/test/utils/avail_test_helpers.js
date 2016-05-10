//Written by Stephen Schroeder
//The following are helpers for testing availability
const moment = require('moment')
const dateFormat = "YYYY-MM-DD HH:MM:ss"
const db = require('../../config').DB;
const AvailUser = db.import('../../models/availability/availabilityUser_model')

//below function takes no arguements and returns an object containing testing dates
exports.getTestingTimes= function(){
	var startDate = moment()
	var testDates = {
		startDate1: startDate.clone().format(dateFormat).toString(),
		endDate1: moment(startDate).add(2, "h").format(dateFormat).toString(),
		startDate2: startDate.clone().add(1, 'h').format(dateFormat).toString(),
		endDate2: startDate.clone().add(3, 'h').format(dateFormat).toString(),
		invalidDate: startDate.clone().subtract(2, 'h').format(dateFormat).toString()
	}
	return testDates;
}

exports.removeTestRecord = function(username, startTime, endTime){
	return new Promise((resolve, reject)=>{
		db.sync().then(function(){
			AvailUser.find({
				where: {
					username: username,
					startTime:{
						$lte: endTime
					},
					endTime: {
						$gte: startTime
					}
				}
			}).then(function(result){
				if(result){
					result.destroy().then(function(){
						console.log('Test User Removed');
						return resolve()
					})
				}else{
					return resolve()
				}
			}).catch((e)=>{
				reject(e)
			})
		})
	})
}


exports.addTestRecord = function(username, startTime, endTime, done){
	return new Promise((resolve, reject)=>{
		db.sync().then(function(){
				AvailUser.findOrCreate({where: {
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
						title: "title"
					}
				}).spread(function(availability, created){
					return resolve()
				}).catch(function(err){
					console.log(err)
					return reject("Error", err);
				})
			
			})
	})	
}


exports.getMatchingCount = function(username, startTime, endTime, done){
	return new Promise((resolve, reject)=>{
		db.sync().then(function(){
			AvailUser.count({where: {
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
			}).then((count)=>{
				if(count === null){
					reject("error")
				}else{
					resolve(count)
				}
			})
		})	
	})
}