const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const db = require('./config/keys').MongoURI;
const flash = require('connect-flash');

// Set up Embedded Javascript templating module for use
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Silence MongoClient version prompts 
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
// Connect to Mongo server
mongoose.connect(db)
	.then(() => console.log('MongoDB Connected...'))
	.catch(err => console.log(err));

// Body parser and URLencoded
app.use(express.urlencoded({ extended : false}));

// Sessions
const session = require('express-session');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
}));

// Passport
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Link static folder, public
app.use(express.static("public"));

// Connect Flash
app.use(flash());
// Global variables
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

// Middleware for routes (/routes), make sure to pass these at bottom
const dashboard = require('./routes/dashboard');
app.use('/dashboard', dashboard);
const users = require('./routes/users');
app.use('/', users);
// set default route
app.get('*', (req, res) => {
	res.redirect('/register');
})

// set PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
