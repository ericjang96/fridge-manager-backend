var express = require('express');
var fridgeRouter = express.Router();
var Fridge = require('../models/Fridge.js');
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
    .post((req, res) => {
    })


// GET: Get all ingredients in a given fridge
// PUT: Add one ingredient to a given fridge
fridgeRouter.route('/ingredients')
    .get((req, res) => {
        var query = req.query;
        Fridge.find(query, {ingredients: 1, _id: 0}).exec()
        .then(fridges => res.status(200).json(fridges))
        .catch(err => res.status(400).send(err));
    })
    .put((req, res) => {
        if(!checkIngredientRequestValid(req.body)){
            res.status(400).send("There was an error in the request: \n" + JSON.stringify(req.body) + "\nPlease make sure the request is well formed");
        }
        else{
            let ingred = new Ingredient(
                req.body.name,
                req.body.boughtDate,
                req.body.expiryDate,
                req.body.amountUnit,
                req.body.amount
            );
            // TODO: Have better error handling
            Fridge.findOneAndUpdate(
                {"fridge_id": "dummy_fridge_id"},
                { $push: { "ingredients": ingred}},
                function(err, data){
                    if(err != null){
                        console.log(err);
                    }
                })

            res.status(201).send(ingred);
        }
    })


// Is this really the best way to check if request is valid?
function checkIngredientRequestValid(body){
    if(body.name === undefined 
        || body.boughtDate === undefined 
        || body.expiryDate === undefined
        || body.amountUnit === undefined
        || body.amount === undefined){        
            return false;
        }

    return true;
}
module.exports = fridgeRouter;