var express = require('express');
var groceryListRouter = express.Router();
var GroceryList = require('../models/GroceryList');
const bodyParser = require('body-parser');
const GroceryItem = require('../domain_models/GroceryItem');

groceryListRouter.use(bodyParser.json());
groceryListRouter.use(bodyParser.urlencoded({extended:true}));

groceryListRouter.route('/')
    .get((req, res) => {
        var query = req.query;
        GroceryList.find(query).exec()
        .then(lists => res.status(200).send(lists))
        .catch(err => res.status(400).send(err));
    })
    .post((req, res) => {
        var list = new GroceryList({
            grocery_list_id: req.body.grocery_list_id,
            name: req.body.name,
            grocery_items: []
        })
        list.save();
        console.log("grocery list: " + req.body.name +" has been saved");
        res.status(201).send(list);
    })
    .put((req, res) => {
        var type = req.body.type;
        switch(type){
            case("insert"):
                console.log("inserting new item...");
                tryInsertItem(req, res);
                break;
            case("delete"):
                console.log("deleting item...");
                tryDeleteItem(req, res);
                break;
            default:
                console.log("request type is invalid");
                break;
        }
    })

function tryInsertItem(req, res){
    var item = new GroceryItem(
        req.body.name,
        req.body.amount,
        req.body.comment
    );
    
    GroceryList.findOneAndUpdate(
        {"grocery_list_id": req.body.grocery_list_id},
        { $push: { "grocery_items": item}},
        function(err, data){
            if(err != null){
                console.log(err);
            }
        })

    res.status(201).send(item);
    console.log("Successfully inserted a new grocery item");
}

function tryDeleteItem(req, res){
    var name = req.body.name;

    GroceryList.findOneAndUpdate(
        { "grocery_list_id": req.body.grocery_list_id},
        { $pull: { grocery_items : { "name" : name }}},
        function(err, docs){
            if(docs == null){
                console.log("Could not delete " + name + " since it does not exist");
                res.status(400).send(name + " does not exist and cannot be deleted");
                console.log(err);
            }
            else{
                console.log("Successfully deleted " + name);
                res.status(201).send(name + " was successfully removed");
                console.log("Successfully deleted the ingredient");
            }
        });
}

module.exports = groceryListRouter;