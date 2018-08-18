var mongoose = require('mongoose');

var FridgeSchema = new mongoose.Schema({
    fridge_id: String,
    user_ids: [String],
    ingredients: [{
        name: String,
        boughtDate: Date,
        expiryDate: Date,
        amountUnit: String,
        amount: Number
    }]
    },
    { versionKey: false }
);

var Fridge = mongoose.model('fridges', FridgeSchema, 'fridges');

module.exports = Fridge;