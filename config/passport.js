const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// Load User model
const User = require('../models/User');

// 'passport' to be passed in as a variable from the app.js file
module.exports = function(passport) {
	passport.use(
		new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
			// Math User, manage promise with then() and catch()
			User.findOne({ email : email.toLowerCase() })
				.then(user => {
					if (!user) {
						return done(null, false, { message : 'That email is not registered'});
					}
					// Match password
					bcrypt.compare(password, user.password, (err, isMatch) => {
						if(err) throw err;
						if(isMatch) {
							return done(null, user);
						} else {
							return done(null, false, { message: 'Password incorrect'});
						}
					})
				})
				.catch(err => console.log(err));
		})
	);
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});
}