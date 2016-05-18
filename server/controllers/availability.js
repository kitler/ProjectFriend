"use strict"
const rt = require('express').Router();
const availMatcher = require('../processes/avail_gettingMatchingAvail');
const availAdder = require('../processes/avail_addAvail');
const responseCreator = require('../models/response_model')
const passportService = require('../middleware/passport')
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});


rt.get('/:availID/matches', requireAuth, (req, res, next)=>{
	console.log(req.user, req.params.availID)
	availMatcher(req.user.username, req.params.availID).then((result)=>{
		let resJson = responseCreator("success", result)
		res.status(200)
		res.setHeader('Content-Type', 'application/json')
		res.json(resJson)
	}).catch((e)=>{
		next(e)
	})
})

rt.post('/', requireAuth, (req, res, next)=>{
	const username = req.user.username;
	const startTime = req.body.startTime;
	const endTime = req.body.endTime;
	const title = req.body.title;

	availAdder(username, startTime, endTime, title).then((availability)=>{
		let resJson = responseCreator("success", availability)
		res.status(200)
		res.setHeader('Content-Type', 'application/json')
		res.json(resJson)
	}).catch((e)=>{
		next(e)
	})
})

module.exports = rt;