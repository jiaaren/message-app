const express = require('express');
const router = express.Router();
// Importing model
const User = require('../models/User');
// Bcrypt for password encryption
const bcrypt = require('bcryptjs');
// Passport
const passport = require('passport');
// Importing authentication
const { ensureAuthenticated, notAuthenticated } = require('../config/auth');

// Set get route to registration page
router.get('/register', notAuthenticated, (req, res) => {
	res.render('register');
})

// Set get route to login page
router.get('/login', notAuthenticated, (req, res) => {
	res.render('login');
})

// Set post route to registration page
router.post('/register', (req, res) => {
	const { first_name, last_name, email, password, password2 } = req.body;
	let errors = [];

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
	if (errors.length > 0) {
		res.render('register', {
			errors,
			first_name,
			last_name,
			email,
			password,
			password2
		})
	}
	else {
		// Verify if user already exists, username = email address
		User.findOne({ email: email })
			.then (user => {
				// if exists
				if (user) {
					errors.push({ msg: 'Email already registered'});
					res.render('register', {
						errors,
						first_name,
						last_name,
						email,
						password,
						password2
					})
				} else {
					// if doesn't exist, create new user based on Schema 'User' declared above
					const newUser = new User({
						first_name : first_name,
						last_name : last_name,
						email: email,
						password: password
					});
					bcrypt.genSalt(10, (err, salt) =>
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if (err) throw err;
							newUser.password = hash;
							// save new user to Database
							newUser.save()
								.then(user => {
									res.redirect('/login');
								})
								.catch(err => console.log(err));
						})
					)
				}
			})
	}
})

// Handle Login post
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/login',
	}) (req, res, next);
})

// Handle Logout
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/users/login');
})

// Export router for use in app.js
module.exports = router;
