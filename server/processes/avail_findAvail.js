const errors = require('../middleware/errorHandler').Availability
const db = require('../config').DB;
const Availability = db.import('../models/availability/availabilityUser_model');
const accessValidator = require('./auth_validateAccess')


module.exports = (availID)=>{
	return new Promise((resolve, reject)=>{
		db.sync()
			.then(()=>{
				Availability.findOne({where:{
				id: availID
			}})
			.then((result)=>{
				if(result === null){
					return reject(errors.couldNotFindAvailability)
				}else{
					resolve(result)
				}
			}).catch((e)=>{
				reject(e)
			})
		})
	})
}