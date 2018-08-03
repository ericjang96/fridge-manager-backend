var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    user_id: String,
    password: String,
    fridge_id: String,
});

var User = mongoose.model('users', UserSchema, 'users');

module.exports = User;