//Written by stephen schroeder
//The following controls all paths to User
"use strict"
const rt = require('express').Router();
const userCreator = require('../processes/user_userCreator');
const responseCreator = require('../models/response_model')
rt.post('/', (req, res, next)=>{
	const email = req.body.email;
	const password = req.body.password;
	const username = req.body.username;
	const name = req.body.name;
	const DOB = req.body.DOB
	if(!email || !password || !username || !name|| !DOB){
		let errors = require('../errors').Auth;
		return next(errors.missingSignUpParameters)
	}

	//Should token creator be done here or in business logic
	userCreator(username, password, email, name, DOB).then((data)=>{
		res.status(201)
		res.json(responseCreator(data))
	}).catch((e)=>{
		next(e)
	})

})

module.exports = rt;