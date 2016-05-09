module.exports = function(db, DataType) {
	const availabilityUser = db.import('./availabilityUser_model')
	const community = db.import('./community_model')
	var friend = db.define('Type_Availability', {
		availID:{
			allowNull:false,
			type: DataType.INT,
			unique: 'CompositeKey',
			references:{
				model: availabilityUser,
				key: 'id'
			}
		},
		communityID:{
			allowNull:false,
			type: DataType.INT,
			unique:'CompositeKey',
			references:{
				model: community,
				key: 'id'
			}
		}
		
	})

	return friend;
}