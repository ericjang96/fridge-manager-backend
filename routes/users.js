var express = require('express');
var userRouter = express.Router();
var User = require('../models/User.js');
const bodyParser = require('body-parser');

userRouter.use(bodyParser.json());
userRouter.use(bodyParser.urlencoded({extended:true}));

userRouter.route('/')
    .get((req, res) => {
        var query = req.query;
        User.find(query).exec()
        .then(users => res.json(users))
        .catch(err => res.send(err));
    })
    .post((req, res) => {
        var user = new User({
            user_id: req.body.user_id,
            password: req.body.password,
            fridge_id: req.body.fridge_id
        });
        user.save()
        res.status(201).send(user);
    })

userRouter.route('/name')
    .get((req,res) => {
        var query = req.query;
        User.find(query, {user_id: 1, _id: 0}).exec()
        .then(users => res.json(users))
        .catch(err => res.send(err));
    })

module.exports = userRouter;