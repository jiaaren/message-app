module.exports = {
	ensureAuthenticated: function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		// need this even if user tries to access to site requiring authentication directly
		res.redirect('/login');
	},

	notAuthenticated: function(req, res, next) {
		if (req.isAuthenticated())
			res.redirect('/dashboard');
		else
			return next();
	}
}