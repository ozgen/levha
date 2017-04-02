/**
 * Created by Ozgen on 9/8/16.
 */
const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');


function tokenForUser(user) {

    const timestamp = new Date().getTime();

    return jwt.encode({sub: user.email, iat: timestamp}, config.secret);

}
function parseToken(token) {
    return jwt.decode(token, config.secret);
}

exports.parseToken = function (token) {
    return jwt.decode(token, config.secret);
}
exports.signUp = function (req, res, next) {
    const user = {};
    user.email = req.body.email;
    user.password = String(req.body.password);

    if (!user.email || !user.password) return res.status(422).send('Invalid data');

    User.findOne({email: user.email}, function (err, existingUser) {

        if (err) {
            return next(err);
        }

        if (existingUser) {
            return res.status(422).send({error: 'email is in use'});
        }

        const userToSave = new User(req.body);
        userToSave.isLocked = false;
        userToSave.isDeleted = 0;
        userToSave.isFreeze = false;
        userToSave.registered = false;
        userToSave.password = String(userToSave.password);

        userToSave.save(function (err) {

            if (err) return next(err);

            res.json({token: tokenForUser(userToSave)});
        })
    })
};

exports.signin = function (req, res, next) {
    if (req.user === 'alreadyLoggedin') {
        res.send({token: 'alreadyLoggedin'})
    } else if (req.user === 'deleted') {
        res.send({token: 'deleted'})
    } else if (req.user === 'freezed') {
        res.send({token: 'freezed'})

    } else {
        const token = tokenForUser(req.user);
        res.send({token: token, user: req.user});
    }


}

exports.logout = function (req, res) {

    const email = parseToken(req.headers.authorization);
    User.findOneAndUpdate({email: email.sub}, {isLocked: false}, function (err) {

        if (err) res.status(404).send(err);

        res.status(200).send('Bye!');
    });


}

exports.checkRole = function (req, rol, cb) {
    const email = parseToken(req.headers.authorization);
    User.findOne({email: email.sub}, function (err, user) {
        const roles = user.roles;
        for (const r in roles) {
            const role = roles[r];
            if (role.role === "super_admin") {
                cb(true, false);
                break;
            }
            if (role.role === rol && role.region === req.headers.region) {

                if (role.branch && req.headers.branch) {
                    if (role.branch === req.headers.branch) {
                        cb(true, true);
                        break;
                    }
                }
                cb(true, false);
                break;
            } else {
                cb(false, false);
                break;
            }
        }

    })

}

