"use strict"
var request = require('supertest');
const db = require('../config').DB;
const expect = require('chai').expect
const Friend = db.import('../models/friend_model')
const User = db.import('../models/user_model')
const Avail = db.import('../models/availability/availabilityUser_model')
const username = require('../testConfig').workingUsername1;
const password = require('../testConfig').workingPassword1;
const username2 = require('../testConfig').workingUsername2;
const password2 = require('../testConfig').workingPassword2;
const username3 = require('../testConfig').workingUsername3;
const availUtil = require('./utils/avail_test_helpers')
const testTimes = availUtil.getTestingTimes();
const errors = require('../errors').Availability

const errorMsgCreator = require('../errors').errorMaker
var chai = require("chai");
chai.should();
chai.use(require('chai-things'));

describe('Availability:', function () {
	let server;
	let user1Token;
	let user2Token;

	beforeEach(function (done) {
		server = require('../index');
		console.log("server is running")
		done()
	});
	afterEach(function () {
		server.close();
	});

	describe('post to /availability adding', function(){
		beforeEach(function(done){
			 request(server)
				.post('/api/v1/auth/local')
				.send({
					username: username,
					password: password
				})
				.end(function(err, res){
					user1Token = res.body.data.token;
					done()
				})
		})
		it('allows user to add availability when passed valid date',function(done){
			request(server)
				.post('/api/v1/user/availability')
				.set({authorization: user1Token})
				.send({
					startTime: testTimes.startDate1,
					endTime: testTimes.endDate1,
					title: "title"
				})
				.expect(200)
				.end((e, r)=>{
					done()
				})
		})
		it('rejects request when poorly formatted: incorrect dates, happened in past, etc',function(done){
			request(server)
				.post('/api/v1/user/availability')
				.set({authorization: user1Token})
				.send({
					startTime: testTimes.endDate1,
					endTime: testTimes.StartDate1,
					title: "title"
				})
				.expect(422,errorMsgCreator(errors.endIsBeforeStart), done)
		})
		it('rejects request when poorly formatted: null dates',function(done){
			request(server)
				.post('/api/v1/user/availability')
				.set({authorization: user1Token})
				.send({
					startTime: null,
					endTime: testTimes.StartDate1,
					title: "title"
				})
				.expect(422,errorMsgCreator(errors.nullInputDates), done)
		})
		afterEach(function(done){
			availUtil.removeTestRecord(username, testTimes.startDate1, testTimes.endDate1).then(()=>{
				done()
			}).catch((e)=>{
				done(e)
			})
		})
	})
	
	//Below will test all facets of getting matchs and 
	describe('/get availability - Matching with users', function(){
		var anticipatedCount;
		var availID;
		before(function(done){
			Promise.all([
				availUtil.addTestRecord(username2, testTimes.startDate2, testTimes.endDate2),
				availUtil.addTestRecord(username3, testTimes.startDate2, testTimes.endDate2)
			]).then(()=>{
					availUtil.getMatchingCount(username, testTimes.startDate1, testTimes.endDate1).then((count)=>{
						availUtil.addTestRecord(username, testTimes.startDate1, testTimes.endDate1).then((res)=>{
				
							availID = res.id
							done()
						})
						anticipatedCount = count;
					}).catch((e)=>{
						done(e)
					})
			}).catch((e)=>{
				done(e)
			})
		})
		it(':returns list of matching users and events', (done)=>{
			let url = '/api/v1/user/availability/'+availID+'/matches'
			console.log(url)
			request(server)
				.get(url)
				.set({Authorization: user1Token})
				.expect(200)
				.end((e, r)=>{
					if(e){
						done(e)
					}else{
						expect(r.body.data.length, "Array size incorrect").to.equal(anticipatedCount)
						//expect(r.body.data[0].users).to.contain.a.thing.with.property('user')
						//expect(deepObj).to.have.deep.property('green.tea', 'matcha')
						//results.should.contain.a.thing.with.key('user')
						done()
					}
				})
				//rejects users request when availID and logged in user do not match
		})
		after((done)=>{
			Promise.all([
				availUtil.removeTestRecord(username, testTimes.startDate1, testTimes.endDate1),
				availUtil.removeTestRecord(username2, testTimes.startDate2, testTimes.endDate2),
				availUtil.removeTestRecord(username3, testTimes.startDate2, testTimes.endDate2)
			]).then(()=>{
				done()
			}).catch((e)=>{
				done(e)
			}) 
		})

		it('rejects request when poorly formatted: incorrect dates, happened in past, etc',function(done){
			request(server)
				.post('/api/v1/user/availability/'+null+'/matches')
				.set({authorization: user1Token})
				.expect(404, done)
		})
	})
});




