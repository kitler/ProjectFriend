const errors = require('../middleware/errorHandler').Availability
module.exports = function(loggedUser, claimedUser){
	return new Promise((res, rej)=>{
		if(loggedUser !== claimedUser){
			return rej(errors.unauthorizedAccess)
		}
		return res()
	})
}