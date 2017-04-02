/**
 * Created by Ozgen on 10/15/16.
 */


const fs = require('fs');
const path = require('path');
const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

exports.getAllUsers = function (req, res) {
    const query = User.find();
    query.where('isDeleted').ne(1);
    if (req.headers.region !== 'undefined') {
        query.where('roles').elemMatch(function (elem) {
            elem.where('region').equals(req.headers.region);
        });
    }

    if (req.headers.branch !== 'undefined') {
        query.where('roles').elemMatch(function (elem) {
            elem.where('branch').equals(req.headers.branch);
        });
    }

    query.exec(function (err, users) {
        if (err) return res.status(500).send(err);

        return res.status(200).send(users);

    })

}

exports.getOnlineUsers = function (req, res) {
    const query = User.find();
    query.where('isDeleted').ne(1);
    query.where('isLocked').equals(true);
    if (req.headers.region !== 'undefined') {
        query.where('roles').elemMatch(function (elem) {
            elem.where('region').equals(req.headers.region);
        });
    }

    if (req.headers.branch !== 'undefined') {
        query.where('roles').elemMatch(function (elem) {
            elem.where('branch').equals(req.headers.branch);
        });
    }
    query.exec(function (err, users) {

        if (err) return res.status(500).send(err);

        return res.status(200).send(users);

    })
}

exports.getFreezeUser = function (req, res) {
    const query = User.find();
    query.where('isDeleted').ne(1);
    query.where('isFreeze').equals(true);
    query.exec(function (err, users) {

        if (err) return res.status(500).send(err);

        return res.status(200).send(users);

    })
}

exports.updateUser = function (req, res) {
    User.findById(req.body._id, function (err, user) {

        if (err) return res.status(404).send(err);

        if (user.password === req.body.password)
            delete req.body.password;
        if (req.body.password === "")
            delete req.body.password;
        if (req.body.password) {
            user.getHashPassword(String(req.body.password), function (err, hash) {

                req.body.password = hash;

                User.findByIdAndUpdate(req.body._id, req.body, function (err, user) {
                    if (err) return res.status(404).send(err);

                    return res.status(200).send(user);
                })

            })
        } else {
            User.findByIdAndUpdate(req.body._id, req.body, function (err, user) {
                if (err) return res.status(404).send(err);

                return res.status(200).send(user);
            })
        }

    })

}
