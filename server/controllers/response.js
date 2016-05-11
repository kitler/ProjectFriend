"use strict"

exports.send =(req, res, next)=>{
	console.log("MEOWOEOEOEOEOEOEOE", req.data)
	console.log("MEOWOEOEOEOEOEOEOE", typeof req.data)
	let data = req.data;

	console.log("MEOWOEOEOEOEOEOEOE", typeof data)
	let status = req.status

	if(!req.status){
		status = 200;
	}

	let body = {
		status: "success"
	}

	body.data = data

	console.log(body)

	res.status(status).json(body)
}