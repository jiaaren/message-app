const User = require('../models/User');
// Bcrypt for password encryption
const bcrypt = require('bcryptjs');

module.exports = {
	verifyInput: function (user_info, errors) {
		const { first_name, last_name, email, password, password2 } = user_info;
		// Check required fields
		if (!first_name || !last_name || !email || !password || !password2) {
			errors.push({ msg: 'Please fill in all required fields'});
		}
		// Check password match
		if (password != password2) {
			errors.push({ msg: 'Please ensure passwords match'});
		}
		// Check minimum password length
		const minlen = 6;
		if (password.length < minlen) {
			errors.push({ msg: `Password should at least be ${minlen} characters`})
		}
	},
	
	renderRegister_existing: function (user_info, errors, res) {
		const { first_name, last_name, email, password, password2 } = user_info;
		res.render('register', {
			errors,
			first_name,
			last_name,
			email,
			password,
			password2
		});
	},
	
	createUser: function (user_info) {
		const newUser = new User({
			first_name: user_info.first_name,
			last_name: user_info.last_name,
			email: user_info.email,
			password: user_info.password
		});
		return (newUser);	
	},
	
	getHash: function (newUser, req, res, user) {
		bcrypt.genSalt(10, (err, salt) =>
			bcrypt.hash(newUser.password, salt, (err, hash) => {
				if (err) throw err;
				// save new user to Database
				newUser.password = hash;
				newUser.save()
				.then(user => {
					req.flash('success_msg', 'You are now registered! Please log in');
					res.redirect('/login');
				})
				.catch(err => console.log(err));
			})
		)
	}
}

