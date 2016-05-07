

module.exports = function(db, DataType) {
	const User = db.import('./model')
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
	})/*, {
		validate: {
			bothUsernamesDiffer: function(){
				if(this.usernameone === this.usernametwo){
					throw new Error('Cannot create friend request on same user')
				}
			}
		}
	})*/

	return friend;
}