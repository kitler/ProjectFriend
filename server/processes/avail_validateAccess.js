const accessValidator = require('./auth_validateAccess')
module.exports = (username, AvailObj)=>{
	return new Promise((resolve, reject)=>{
		accessValidator(username, AvailObj.username).then(()=>{
			resolve(AvailObj)
		}).catch((e)=>{
			reject(e)
		})
	})
}