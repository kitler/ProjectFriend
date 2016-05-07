const bcrypt = require('bcrypt-nodejs')

module.exports = function(db, Sequelize) {
	var User = db.define('User', {
		name: {type: Sequelize.STRING},
		username: {type: Sequelize.STRING, unique:true},
		email: {type: Sequelize.STRING},
		DOB: Sequelize.DATE,
		password: Sequelize.STRING,
		googleid: Sequelize.STRING,
		token: Sequelize.STRING
	})
	//The following is a hook that will encrypt all passwords before storing in SQL
	User.beforeCreate(function(user, options, cb){
		console.log('info: storing password');
		bcrypt.genSalt(10, function(err, salt){
			if(err){return cb(err);}
			console.log('info: encrypting password');
			bcrypt.hash(user.password, salt, null, function(err, hash){
				if(err){return cb(err);}
					console.log('info: password now encrypted', hash)
					user.password = hash;
					return cb(null, options)
			});
		});
	})
	return User;
}


