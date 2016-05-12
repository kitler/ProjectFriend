const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt-nodejs');
const db = require('../config').DB;
const secret = require('../config').jwtSecret;
const User = db.import('../models/user_model');

const localOptions = {
	usernameField: 'username'
}

const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: secret
}

const localLogin = new LocalStrategy(localOptions, function(username, password, done){
		db.sync().then(function(){
			User.findOne({where: {username: username} }).then(function(user){
				if(user === null){ 
					return done(null, false, {message: 'User not Found'})
				} 

				bcrypt.compare(password, user.password, function(err, isMatch){
	
					if(err){
						return done(null, false, {message:"Error occured comparing"});
					}

					if(!isMatch){
						return done(null, false, {message: "incorrect password"});
					}
					return done(null, user);
				});
			})
		})
})

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
	db.sync().then(function(){
		User.findOne({where: {username: payload.username} }).then(function(user){
			if(user === null) {
				return done(null, false, {message: 'User not Found'})
			}

			done(null, user)
		})
	})
})

passport.use(localLogin)
passport.use(jwtLogin)