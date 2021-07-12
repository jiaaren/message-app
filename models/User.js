const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true
};

const UserSchema = new mongoose.Schema({
	first_name: reqString,
	last_name: reqString,
	email: reqString,
	password: reqString,
	date: {
		type: Date,
		default: Date.now
	},
	messages : [{
		_id: reqString,
		message: reqString
	}]
});

const User = mongoose.model('User', UserSchema);
module.exports = User;