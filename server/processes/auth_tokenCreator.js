"use strict"
const secret = require('../config').jwtSecret;
const jwt = require('jsonwebtoken');

function tokenCreator(user){
	return new Promise((res, rej)=>{
		const cTime = new Date().getTime();
		const exTime = new Date(cTime + 30*60000);

		let token = {token: jwt.sign({username: user, iat: cTime}, secret)}
		res(token);
	})
}

module.exports = tokenCreator;
