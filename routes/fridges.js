var express = require('express');
var fridgeRouter = express.Router();
var Fridge = require('../models/Fridge.js');
var FridgeView = require('../models/FridgeView.js');
const bodyParser = require('body-parser');
const Ingredient = require('../models/Ingredient');

fridgeRouter.use(bodyParser.json());
fridgeRouter.use(bodyParser.urlencoded({extended:true}));

// GET: get all fridges in the database
fridgeRouter.route('/')
    .get((req, res) => {
        var query = req.query;
        Fridge.find(query).exec()
        .then(fridges => res.json(fridges))
        .catch(err => res.send(err));
    })

// Aggregate the ingredients by fridge id
fridgeRouter.route('/ingredients/view')
    .get((req, res) => {
        var query = req.query;
        Fridge.aggregate([
            { $unwind: "$ingredients"},
            { $match:  query },
            { $group : 
                {
                    _id: "$ingredients.name",
                    "amount": { $sum: "$ingredients.amount"},
                    "unit": { $first: "$ingredients.amountUnit"}
                }
            },
            { $sort: { _id: 1}}]).exec()
        .then(fridges => res.json(fridges))
        .catch(err => res.send(err));

        console.log("Successfully returned ingredients view");
    })



// GET: Get all ingredients in a given fridge
// PUT: Add one ingredient to a given fridge
fridgeRouter.route('/ingredients')
    .get((req, res) => {
        var query = req.query;
        Fridge.find(query, {ingredients: 1, _id: 0}).exec()
        .then(fridges => res.status(200).json(fridges))
        .catch(err => res.status(400).send(err));
        console.log("Successfully returned ingredients");
    })
    .put((req, res) => {
        var type = req.body.type;
        switch(type){
            case("insert"):
                console.log("Received an insert request");
                insertIngredientPutRequest(req, res);
                console.log("Successfully inserted a new ingredient");
                break;
            case("removeAmount"):
                console.log("Received an remove amount request");
                removeIngredientAmount(req, res);
                console.log("Successfully removed requested amount");
                break;
            case("delete"):
                console.log("Received a delete request");
                deleteWholeIngredientPutRequest(req, res);
                console.log("Successfully deleted the ingredient");
                break;
            default:
                res.status(400).send("Request type was invalid. Please check the body of your request");
        }
    })


function insertIngredientPutRequest(req, res){
    if(!checkInsertIngredientRequestValid(req.body)){
        res.status(400).send("There was an error in the request: \n" + JSON.stringify(req.body) + "\nPlease make sure the request is well formed");
    }
    else{
        var boughtDateEpoch = parseFloat(req.body.boughtDate);
        var expiryDateEpoch = parseFloat(req.body.expiryDate);

        // Use the epoch time (in milliseconds) to calculate date;
        // Worth noting that mongodb uses UTC by default
        var boughtDate = new Date(boughtDateEpoch).toLocaleString();
        var expiryDate = new Date(expiryDateEpoch).toLocaleString();

        var ingred = new Ingredient(
            req.body.name,
            boughtDate,
            expiryDate,
            req.body.amountUnit,
            req.body.amount
        );
        // TODO: Have better error handling
        Fridge.findOneAndUpdate(
            {"fridge_id": req.body.fridge_id},
            { $push: { "ingredients": ingred}},
            function(err, data){
                if(err != null){
                    console.log(err);
                }
            })

        res.status(201).send(ingred);
    }
};

// If ingredient not found, throw error
function deleteWholeIngredientPutRequest(req, res){
    var name = req.body.name;

    Fridge.findOneAndUpdate(
        {$and: [{"fridge_id": req.body.fridge_id}, {"ingredients.name": name}]},
        { $pull: { ingredients : { "name" : name }}},
        function(err, docs){
            if(docs == null){
                console.log("Could not delete " + name + " since it does not exist");
                res.status(400).send(name + " does not exist and cannot be deleted");
            }
            else{
                console.log("Successfully deleted an ingredient");
                res.status(201).send(name + " was successfully removed");
            }
        });
};


function removeIngredientAmount(req, res){
    try{
        removeFromFirstIngredient(req.body.name, req.body.amount);
        res.status(201).send({"response": "Successfully removed " + req.body.amount + " from " + req.body.name});
    }
    catch(e){
        res.status(400).send(e);
    }

}

function removeFromFirstIngredient(name, amount){
    Fridge.aggregate([
        { $unwind: "$ingredients"},
        { $match:  {$and: [{"fridge_id": req.body.fridge_id}, {"ingredients.name": name}]} },
        { $sort: { "ingredients.boughtDate" : 1}},
        { $group:
             {
               _id: "$ingredients.name",
               objectID: { $first: "$ingredients._id" },
			   amount: { $first: "$ingredients.amount"}
             }
        }
    ]).exec()
    .then(object => {
        var objectID = object[0]["objectID"];
        var heldAmount = parseInt(object[0]["amount"]);
        var requestedAmount = parseInt(amount);

        // This current item has more than what we wanted to remove
        if(heldAmount >= requestedAmount){
            var newValue = heldAmount - requestedAmount;
            Fridge.findOneAndUpdate(
                { $and: [{"fridge_id": req.body.fridge_id}, {"ingredients._id": objectID}]},
                { $set: { "ingredients.$.amount": newValue}}
            ).exec();
        }
        else{
            var remainder = requestedAmount - heldAmount;
            Fridge.findOneAndUpdate(
                { $and: [{"fridge_id": req.body.fridge_id}, {"ingredients._id": objectID}]},
                { $pull: { ingredients : { "_id" : objectID }}}
            ).exec()
            .then(res => {
                removeFromFirstIngredient(name, remainder);
            });
        }
    })
    .catch(err => {
        throw err;
    });
}

// Is this really the best way to check if request is valid?
function checkInsertIngredientRequestValid(body){
    if(body.name === undefined 
        || body.boughtDate === undefined 
        || body.expiryDate === undefined
        || body.amountUnit === undefined
        || body.amount === undefined
        || body.type === undefined){        
            return false;
        }

    return true;
};

module.exports = fridgeRouter;