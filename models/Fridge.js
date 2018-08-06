var mongoose = require('mongoose');

var FridgeSchema = new mongoose.Schema({
    fridge_id: String,
    user_ids: [String],
    ingredients: [{
        _id : false,
        name: String,
        boughtDate: String,
        expiryDate: String,
        amountUnit: String,
        amount: Number
    }]
    },
    { versionKey: false }
);

var Fridge = mongoose.model('fridges', FridgeSchema, 'fridges');

module.exports = Fridge;