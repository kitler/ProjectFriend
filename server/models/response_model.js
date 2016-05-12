"use strict"
module.exports = (status, data)=>{
	let format = {
		status: status
	}

	if(status === 'error'){
		format.message = data;
	}else{
		format.data = data
	}

	return format;
}