module.exports = function(db, DataType) {
	const user = db.import('./user_model')
	var community = db.define('community', {
		name:{
			type: DataType.STRING,
			allowNull:false
		},
		description:{
			type: DataType.STRING,
			allowNull:false
		},
		createdBy:{
			type: DataType.STRING,
			allowNull:false,
			references:{
				model: user,
				key: 'username'
			}
		}
	})
	return community;
}