"use strict"
var request = require('supertest');
const httpRequest = require('superagent')
const db = require('../config').DB;
const Friend = db.import('../models/friend_model')
const User = db.import('../models/user_model')
const errorMsgCreator = require('../errors').errorMaker
const errors = require('../errors').Auth;
const number = 7;
const username = require('../testConfig').username;
const password = require('../testConfig').password;
const usernameW = require('../testConfig').workingUsername1;
const passwordW = require('../testConfig').workingPassword1;
var chai = require("chai");
var expect = require("chai").expect;
chai.should();
chai.use(require('chai-things'));

describe('authentication', function () {
  var server;
  beforeEach(function () {
    server = require('../index');

  });
  afterEach(function () {
    server.close();
  });
  describe('local login', function(){
    it('gives user token after succesful login', function(done){
      request(server)
        .post('/auth/local/signin')
        .send({
          username: usernameW,
          password: passwordW
        })
        .expect(200)
        .end((e, r)=>{
        	if(e){
        		done(e)
        	}else{
        		let results = r.body;
        		expect(results).to.have.property('token')
        		done()
        	}
        })
    })
    /*it('rejects user when wrong password is given', function(done){
      request(server)
        .post('/auth/local/signin')
        .send({
          username: usernameW,
          password: 'NotApassword'
        })
        .expect(401)
        .end((e, r)=>{
        	if(e){
        		done(e)
        	}else{
        		let results = r.body;
        		console.log(results)
        		expect(results).to.have.property('token')
        		done()
        	}
        })
    })*/
  })
  describe('local signup', function(){
    var reqBody = {username: username,password: password,email: 'test@12345.com',DOB: "1991-12-19",name: "Stephen Schroeder"}
    it('allows user to signup when passed required information',function(done){
      request(server)
        .post('/auth/local/signup')
        .send(reqBody)
        .expect(200, done)
    })
    it('rejects request when not provided username, password, name, or DOB',function(done){
      request(server)
        .post('/auth/local/signup')
        .send({username: null ,password: password,email: 'test@12345.com',DOB: "1991-12-19",name: "Stephen Schroeder"})
        .expect(422, errorMsgCreator(errors.missingSignUpParameters))
      request(server)
        .post('/auth/local/signup')
        .send({username: username, password: null ,email: 'test@12345.com',DOB: "1991-12-19",name: "Stephen Schroeder"})
        .expect(422, errorMsgCreator(errors.missingSignUpParameters)) 
      request(server)
        .post('/auth/local/signup')
        .send({username: username, password: null ,email: 'test@12345.com',DOB: "1991-12-19",name: "Stephen Schroeder"})
        .expect(422, errorMsgCreator(errors.missingSignUpParameters))
      request(server)
        .post('/auth/local/signup')
        .send({username: username ,password: password,email: null,DOB: "1991-12-19",name: "Stephen Schroeder"})
        .expect(422, errorMsgCreator(errors.missingSignUpParameters))
      request(server)
        .post('/auth/local/signup')
        .send({username: username, password: password ,email: 'test@12345.com',DOB: null ,name: "Stephen Schroeder"})
        .expect(422, errorMsgCreator(errors.missingSignUpParameters), done)
    })

    //Below removes the test user from the database
    afterEach(function(done){
      db.sync().then(function(){
        User.find({where:{username: username}}).then(function(result){
          if(result){
            result.destroy().then(function(){
              console.log('Test User Removed');

              return done();
            })
          }else{
            done()
          }
        })
      })
    })
  })
});