const express = require('express');
const router = express.Router();
// Importing model
const User = require('../models/User');
// Passport
const passport = require('passport');
// Importing authentication
const { notAuthenticated } = require('../config/auth');

// Set get route to registration page, render empty form
router.get('/register', notAuthenticated, (req, res) => {
	res.render('register');
})

// Set get route to login page, render empty form
router.get('/login', notAuthenticated, (req, res) => {
	res.render('login');
})

/*
	Import functions from ../config/register_utils for user in registration validation
	- verifyInput				- verify user inputted information into registration form.
	- renderRegister_existing	- render registration form again if not validated, but with previous info filled for resubmission
	- createUser				- createUser based on MongoDB schema set up
	- getHash					- hash user password and save user information into MongoDB
*/
const { verifyInput, renderRegister_existing, createUser, getHash } = require('../config/register_utils');

// Set post route to registration page
router.post('/register', (req, res) => {
	// stores submitted form into variable & converts email to lowercase (for ease of reference subsequently)
	let user_info = req.body;
	user_info.email = user_info.email.toLowerCase();
	// array to keep track of validation errors when registration form is inputted by users.
	let errors = [];
	// verify registration form and update array to incorporate errors (if any).
	verifyInput(user_info, errors);
	// If errors are noted, render form again, but with pre-existing information passed in for user re-enter.
	if (errors.length > 0) 
		renderRegister_existing(user_info, errors, res);
	/*
		If no errors are noted
		(i) Verify if user exists in Mongo database
		(ii) If doesn't exist, create new user, hash userpassword and save user to database
	*/
	else {
		// Verify if user already exists, username = email address
		User.findOne({ email: user_info.email })
			.then (user => {
				// if user exists
				if (user) {
					errors.push({ msg: 'Email already registered'});
					renderRegister_existing(user_info, errors, res);
				} else {
					// if doesn't exist, create new user based on Schema 'User' declared above
					const newUser = createUser(user_info);
					// generate Hash and if successful, save user into database
					getHash(newUser, req, res, user);
				}
			})
			.catch(err => console.log(err));
	}
})

// Handle Login post, route user to dashbaoard if authenticated
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/login',
		failureFlash: true
	}) (req, res, next);
})

// Handle Logout
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/users/login');
})

// Export router for use in app.js
module.exports = router;
