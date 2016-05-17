"use strict"
const Availability = {
	overlappingAvailability: new Error("Overlapping availability"),
	noMatchingAvailabilities: new Error("There was no matching times"),
	nullInputDates: new Error("Start date nor end date cannot be null"),
	endIsBeforeStart: new Error("End Date Cannot Be Before Start"),
	unauthorizedAccess: new Error('User is not authorized to access this resource')
}


exports.SuccessAvailability = {

}

const Auth = {
	missingSignUpParameters: new Error('You must provide e-mail, username, name, and password'),
	userNameTaken: new Error('Username is in use'),
	unauthorizedAccess: new Error('User is not authorized to access this resource'),
	usernameOrPasswordMissing:new Error('You must provide both username and password')
}

exports.Auth = Auth;
exports.Availability = Availability;

const errors422 = [
	Auth.missingSignUpParameters,
	Auth.userNameTaken,
	Auth.usernameOrPasswordMissing,
	Availability.overlappingAvailability,
	Availability.noMatchingAvailabilities,
	Availability.nullInputDates,
	Availability.endIsBeforeStart
]

const errors401 = [
	Auth.unauthorizedAccess,
	Availability.unauthorizedAccess
]

exports.errorHandler = (err, req, res, next)=>{
	const is422 = check422(err);
	const is401 = check401(err);
	console.log('!#$#!#$@#$!@$!@$!@$!@$!@$!@$', err)
	if(is422){
		console.log('!#$#!#$@#$!@$!@$!@$!@$!@$!@$')
		res.status(422).json(errorMaker(err))
	}else if(is401){
		res.status(401).json(errorMaker(err))
	}else{
		res.status(500).json(errorMaker(err))
	}

}

function check422(err){
	let result = errors422.some((item)=>{
		console.log(err.message === item.message)
		return err.message === item.message;
	})
	return result;
}

function check401(err){
	let result = errors401.some((item)=>{
		return err.message === item.message;
	})
	return result;
}

function errorMaker(err){
	let errBody = {
		status: "error",
		message: err.message
	}

	return errBody
}

exports.errorMaker = errorMaker
