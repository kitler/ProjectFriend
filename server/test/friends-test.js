'use strict'
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
const friendUtil = require('./utils/friend_test_helpers').removeTestRecord 

const errors = require('../middleware/errorHandler').Friends

const errorMsgCreator = require('../middleware/errorHandler').errorHandler
var chai = require("chai");
chai.should();
chai.use(require('chai-things'));
describe('loading express', function () {
 	var server;
 	let user1Token;
 	let user2Token;
  	beforeEach(function () {
		server = require('../index');
  	});
  	afterEach(function () {
		server.close();
  	});
  	describe('Friends', function(){
  		before(function(done){
			request(server)
				.post('/api/v1/auth/local')
				.send({
					username: username,
					password: password
				})
				.end(function(err, res){
					user1Token = res.body.data.token;
					request(server)
						.post('/api/v1/auth/local')
						.send({
							username: username2,
							password: password2
						})
						.end(function(err, res){
							user2Token = res.body.data.token;
							done()
						})
				})
		})
  		it('allows user to send friend request', (done)=>{
  			let url = '/api/v1/user/kitler4/friends'
			console.log(url)
			request(server)
				.post(url)
				.set({Authorization: user1Token})
				.send({
					FriendUsername: username2
				})
				.expect(201)
				.end((e, r)=>{
					if(e){
						done(e)
					}else{
						let results = r.body
						//expect(r.body.data[0].users).to.contain.a.thing.with.property('user')
						//expect(deepObj).to.have.deep.property('green.tea', 'matcha')
						results.should.have.a.key('status', 'data')
						done()
					}
				})
  		})
  		it('allows user to accept friend request', (done)=>{
  			let url = '/api/v1/user/kitler5/friends/kitler4'
			console.log(url)
			request(server)
				.put(url)
				.set({Authorization: user2Token})
				.send({
					status: 'accept'
				})
				.expect(200)
				.end((e, r)=>{
					if(e){
						done(e)
					}else{
						let results = r.body
						//expect(r.body.data[0].users).to.contain.a.thing.with.property('user')
						//expect(deepObj).to.have.deep.property('green.tea', 'matcha')
						results.should.have.a.key('status', 'data')
						done()
					}
				})
  		})
  		it('rejects friend request for non-pending request', (done)=>{
  			let url = '/api/v1/user/kitler5/friends/kitler4'
			console.log(url)
			request(server)
				.put(url)
				.set({Authorization: user2Token})
				.send({
					status: 'accept'
				})
				.expect(422)
				.end((e, r)=>{
					if(e){
						done(e)
					}else{
						let results = r.body
						console.log(results)
						//expect(r.body.data[0].users).to.contain.a.thing.with.property('user')
						//expect(deepObj).to.have.deep.property('green.tea', 'matcha')
						results.message.should.equal(errors.requestNotFound.message)
						results.status.should.equal('error')
						done()
					}
				})
  		})
  		after((done)=>{
  			friendUtil(username, username2).then(()=>{
  					done()
  				})
  				.catch((e)=>{
  					done(e)
  				})
  		})
  	})
  it('404 everything else', function testPath(done) {
	request(server)
	  .get('/foo/bar')
	  .expect(404, done);
  });
});