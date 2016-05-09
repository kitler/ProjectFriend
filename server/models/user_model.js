const bcrypt = require('bcrypt-nodejs')

module.exports = function(db, Sequelize) {
	var User = db.define('User', {
		name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		username: {
			type: Sequelize.STRING,
			unique:true,
			allowNull: false
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false
		},
		DOB: {
			type: Sequelize.DATE,
			allowNull: false
		},
		password: {
			type:Sequelize.STRING,
			allowNull: false
		},
		googleid: Sequelize.STRING,
		token: Sequelize.STRING
	})
	//The following is a hook that will encrypt all passwords before storing in SQL
	User.beforeCreate(function(user, options, cb){
		bcrypt.genSalt(10, function(err, salt){
			if(err){return cb(err);}
			bcrypt.hash(user.password, salt, null, function(err, hash){
				if(err){return cb(err);}
					user.password = hash;
					return cb(null, options)
			});
		});
	})
	return User;
}


