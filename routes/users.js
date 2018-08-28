var express = require('express');
var userRouter = express.Router();
var User = require('../models/User.js');
const bodyParser = require('body-parser');
const UserGroceryList = require('../domain_models/UserGroceryList.js');

userRouter.use(bodyParser.json());
userRouter.use(bodyParser.urlencoded({extended:true}));


// GET: get every user in the database
// POST: Add a new user into the database
userRouter.route('/')
    .get((req, res) => {
        var query = req.query;
        User.find(query).exec()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(400).send(err));
    })
    .post((req, res) => {
        var user = new User({
            user_id: req.body.user_id,
            password: req.body.password,
            fridge_id: req.body.fridge_id,
            email: req.body.email
        });
        user.save();
        console.log("Saved user:");
        console.log(user);
        res.status(201).send(user);
    })

userRouter.route('/groceryLists')
    .put((req, res) => {
        var type = req.body.type;
        switch(type){
            case("insert"):
                console.log("inserting new list...");
                insertGroceryList(req, res);
                break;
            case("delete"):
                console.log("deleting list...");
                deleteGroceryList(req, res);
                break;
            default:
                console.log("invalid type");
        }
    })

userRouter.route('/names')
    .get((req,res) => {
        var query = req.query;
        User.find(query, {user_id: 1, _id: 0}).exec()
        .then(users => res.status(200).send(users))
        .catch(err => res.status(400).send(err));
    })

function insertGroceryList(req, res){
    var list = new UserGroceryList(req.body.name, req.body.grocery_list_id);
    // TODO: Have better error handling
    User.findOneAndUpdate(
        {"user_id": req.body.user_id},
        { $push: { "groceryLists": list}},
        function(err, data){
            if(err != null){
                console.log(err);
            }
        })

    res.status(201).send(list);
    console.log("Successfully inserted a new grocery list");
}

function deleteGroceryList(req, res){
    User.findOneAndUpdate(
        {"user_id": req.body.user_id},
        { $pull: { "groceryLists": {"name": req.body.name} }},
        function(err, data){
            if(err != null){
                console.log(err);
            }
        })

    res.status(201).send("Successfully deleted " + req.body.name);
    console.log("Successfully deleted a grocery list");
}

module.exports = userRouter;