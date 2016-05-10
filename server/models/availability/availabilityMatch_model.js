module.exports = function(db, DataType) {
	const availabilityUser = db.import('./availabilityUser_model')
	const community = db.import('./community_model')
	var model = db.define('availabilityMatch', {
		requesterAvailID:{
			allowNull:false,
			type: DataType.INT,
			unique: 'CompositeKey',
			references:{
				model: availabilityUser,
				key: 'id'
			}
		},
		recpientAvailID:{
			allowNull: false,
			type: DataType.INT,
			unique: 'CompositeKey',
			references:{
				model:availabilityUser,
				key:'id'
			}
		},
		note: {
			type: DataType.STRING
		},
		accepted: {
			allowNull: false,
		}
	})

	return model;
}