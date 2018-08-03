const express = require('express')
const app = express()
const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/fmDB';
var Fridge = require('./models/Fridge.js');
var User = require('./models/User.js');

mongoose.connect(url,{ useNewUrlParser: true });

app.get('/', (req, res) => {
	res.send('Welcome to Fridge Manager')
})

app.get('/fridge', (req, res) => {
	var query = req.query;
	Fridge.find(query).exec()
	.then(fridges => res.json(fridges))
	.catch(err => res.send(err));
});

app.get('/users', (req, res) => {
	var query = req.query;
	User.find(query).exec()
	.then(users => res.json(users))
	.catch(err => res.send(err));
});

app.listen(3000, () => console.log('Server is running on port 3000'))
