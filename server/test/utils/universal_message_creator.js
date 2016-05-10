exports.createMessage = (message)=>{
	var errorMsg = {"error": message.message,"status": 422,"type": "internal"}
	return errorMsg;
}