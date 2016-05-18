//written by Stephen Schroeder

'use strict'
const rt = require('express').Router();
const friendRequest = require('../processes/friend_friendRequest');
const responseModel = require('../models/response_model');
const statusChanger = require('../processes/friend_requestStatusChanger');
const errors = require('../middleware/errorHandler').Friends
rt.post('/', (req, res, next)=>{
	console.log("3333333")
	let loggedUser = req.user.username
	let requestedUser = req.body.FriendUsername
	console.log(requestedUser)
	if(requestedUser !== null){
		friendRequest(loggedUser, requestedUser)
		.then((requestObj)=>{
			let resObj = responseModel('success', requestObj);
			res.status(201);
			res.json(resObj);
		}).catch((e)=>{
			next(e)
		})
	}
})

rt.put('/:requestedUser', (req, res, next)=>{
	let loggedUser = req.user.username
	let requestedUser = req.params.requestedUser
	let status = req.body.status.toLowerCase()
	console.log("3333333",loggedUser, requestedUser)
	switch(status){
		case 'accept':
			statusChanger(loggedUser, requestedUser, 'ACCEPTED').then((requestObj)=>{
				let resObj = responseModel('success', requestObj);
				res.status(200);
				res.json(resObj);
			}).catch((e)=>next(e))
			break;
		case 'decline':
			statusChanger(loggedUser, requestedUser, 'DECLINED').then((requestObj)=>{
				let resObj = responseModel('success', requestObj);
				res.status(200);
				res.json(resObj);
			}).catch((e)=>next(e))
			break;
		default:
			next(errors.statusDoesNotMatch)
			break;
	}
})
module.exports = rt;