var mongoose = require('mongoose');

var GroceryListSchema = new mongoose.Schema({
    grocery_list_id: String,
    name: String,
    grocery_items: [{
        name: String,
        amount: Number,
        comment: String
    }]
    },
    { versionKey: false }
);

var Fridge = mongoose.model('groceryLists', GroceryListSchema, 'groceryLists');

module.exports = Fridge;