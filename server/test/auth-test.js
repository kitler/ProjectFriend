var request = require('supertest');
const db = require('../config').DB;
const Friend = db.import('../models/friend_model')
const User = db.import('../models/user_model')

const number = 7;
const username = require('../testConfig').username;
const password = require('../testConfig').password;
describe('authentication', function () {
  var server;
  beforeEach(function () {
    server = require('../index');

  });
  afterEach(function () {
    server.close();
  });
  describe('local signup', function(){
    var reqBody = {username: username,password: password,email: 'test@12345.com',DOB: "1991-12-19",name: "Stephen Schroeder"}
    it('allows user to signup when passed required information',function(done){
      request(server)
        .post('/auth/local/signup')
        .send(reqBody)
        .expect(function(res){
          if(res.body.token){
            res.body.token = true
          }else{
            res.body.token = false
          }  
        })
        .expect(200, done)
    })
    it('rejects request when not provided username',function(done){
      request(server)
        .post('/auth/local/signup')
        .send({username: null ,password: password,email: 'test@12345.com',DOB: "1991-12-19",name: "Stephen Schroeder"})
        .expect(422, {"message": "You must provide e-mail, username, name, and password","status": 422,"token": false,"type": "internal"}, done)
    })
    it('rejects request when not provided with password',function(done){
      request(server)
        .post('/auth/local/signup')
        .send({username: username, password: null ,email: 'test@12345.com',DOB: "1991-12-19",name: "Stephen Schroeder"})
        .expect(422, {"message": "You must provide e-mail, username, name, and password","status": 422,"token": false,"type": "internal"}, done)
    })
    it('rejects request when not provided email',function(done){
      request(server)
        .post('/auth/local/signup')
        .send({username: username ,password: password,email: null,DOB: "1991-12-19",name: "Stephen Schroeder"})
        .expect(422, {"message": "You must provide e-mail, username, name, and password","status": 422,"token": false,"type": "internal"}, done)
    })
    it('rejects request when not provided with DOB',function(done){
      request(server)
        .post('/auth/local/signup')
        .send({username: username, password: password ,email: 'test@12345.com',DOB: "1991-12-19",name: "Stephen Schroeder"})
        .expect(422, {"message": "You must provide e-mail, username, name, and password","status": 422,"token": false,"type": "internal"}, done)
    })
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