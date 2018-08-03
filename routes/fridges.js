var express = require('express');
var fridgeRouter = express.Router();
var Fridge = require('../models/Fridge.js');

fridgeRouter.route('/')
    .get((req, res) => {
        var query = req.query;
        Fridge.find(query).exec()
        .then(fridges => res.json(fridges))
        .catch(err => res.send(err));
    })
    .post((req, res) => {
    })

fridgeRouter.route('/ingredients')
    .get((req, res) => {
        var query = req.query;
        Fridge.find(query, {ingredients: 1, _id: 0}).exec()
        .then(fridges => res.json(fridges))
        .catch(err => res.send(err));
    })
    .put((req, res) => {
    })
module.exports = fridgeRouter;