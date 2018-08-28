var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
        user_id: String,
        password: String,
        fridge_id: String,
        email: String,
        groceryLists: [{
            name: String,
            grocery_list_id: String
        }]
    },
    { versionKey: false }
);

var User = mongoose.model('users', UserSchema, 'users');

module.exports = User;