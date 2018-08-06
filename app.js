var express = require('express')
var app = express()
var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/fmDB';
var bodyParser = require('body-parser');
var fridge = require('./routes/fridges.js');
var user = require('./routes/users.js');
var postUI = require('./routes/post');

initializeApp(app);

app.get('/', (req, res) => {
	res.send('Welcome to Fridge Manager')
});

app.listen(3000, () => console.log('Server is running on port 3000'))


function initializeApp(app){
	mongoose.connect(url,{ useNewUrlParser: true });
	app.use('/fridges', fridge);
	app.use('/users', user);
	app.use('/post', postUI);
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
}