module.exports = function(db, DataType) {
	const User = db.import('../user_model')
	var friend = db.define('User_Availability', {
		username:{
			type: DataType.STRING,
			allowNull:false,
			references:{
				model: User,
				key: 'username'
			}
		},
		startTime: {
			type: DataType.DATE,
			allowNull: false
		},
		endTime: {
			type: DataType.DATE,
			allowNull: false
		},
		globalMatch:{
			type: DataType.BOOLEAN,
			allowNull: false
		},
		city: {
			type: DataType.STRING
		},
		title: {
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