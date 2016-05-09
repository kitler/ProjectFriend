

module.exports = function(db, DataType) {
	const User = db.import('./user_model')
	var friend = db.define('Friend', {
		usernameone: {
			type: DataType.STRING,
			unique: 'CompositeKey',
			allowNull: false,
			references: {
				model: User,
				key: 'username'
			}
		},
		usernametwo: {
			type: DataType.STRING,
			unique: 'CompositeKey',
			allowNull: false,
			references: {
				model: User,
				key: 'username'
			}
		},
		status: {
			type: DataType.STRING,
			allowNull: false
		}
	})
	return friend;
}