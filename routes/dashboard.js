const express = require('express');
const router = express.Router();
// Importing authentication
const { ensureAuthenticated } = require('../config/auth');
// Importing model
const User = require('../models/User');
// Object ID
var ObjectID = require('mongodb').ObjectID;

// Would need to have ensureAuthenticated to use 'user' variable
router.get('/', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
		name: req.user.first_name,
		messages: req.user.messages
	});
})

router.post('/message', ensureAuthenticated, async (req, res) => {
	const { message } = req.body;
	await User.findOneAndUpdate ({
		email: req.user.email
	},
	{
		$push: {
			messages: {
				_id: ObjectID(),
				message: message
			}
		}
	});
	res.redirect('/dashboard');
})

router.get('/delete/:id', async (req, res) => {
	const key = req.params.id;
	const messages = req.user.messages;
	if (messages != 'undefined')
	{
		messages.forEach(async (messages) => {
			if (messages._id === key)
			{
				await User.findOneAndUpdate({
					email: req.user.email
				},
				{
					$pull : {
						messages : messages
					}
				})
			}
		})
	}
	res.redirect('/dashboard');
})

// Export router for use in app.js
module.exports = router;