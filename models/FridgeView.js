var mongoose = require('mongoose');

var FridgeViewSchema = new mongoose.Schema({
    _id: String,
    amount: String,
    unit: String
});

var FridgeView = mongoose.model('fridgeView', FridgeViewSchema, 'fridgeView');

module.exports = FridgeView;