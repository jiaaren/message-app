1. First, install node modules

		npm install
		
2. Make sure to set environment variable for 'MongoURI', either:
- Create file at root of repository, '.env', and enter the following within file

		MongoURI=<URI address"

OR

- set environment variable from command line

3. Run app

		npm start
		visit http://localhost:(port number)/  -  will be defaulted to port 5000 if no environment variable detected
		
4. Visit deployment in heroku

		https://jiaren-messageapp.herokuapp.com/
