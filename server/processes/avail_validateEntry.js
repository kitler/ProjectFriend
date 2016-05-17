const errors = require('../middleware/errors').Availability


module.exports = function validateEntry(startTime, endTime){
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