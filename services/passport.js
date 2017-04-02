/**
 * Created by Ozgen on 9/9/16.
 */
const Passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const LocalStrategy = require('passport-local');

// create a local strategy

const localOptions = {'usernameField': 'email'};
const localLogin = new LocalStrategy(localOptions, function (email, password, done) {

    User.findOne({email: email}, function (err, user) {
        if (err) {
            return done(err);
        }

        if (!user) {
            return done(null, false);
        }

        //compare passwords

        user.comparePassword(String(password), function (err, isMatch) {
            if (err) {
                return done(err);
            }
            console.log(isMatch, err);
            if (!isMatch) {
                return done(null, false);
            }

            if (user.isDeleted !== 1 && user.isFreeze === false) {
                User.findByIdAndUpdate(user._id, {isLocked: true, registered: true}, function (err, updatedUser) {
                    if (err) return done(null, false);

                    done(null, updatedUser);

                })
                
            } else if (user.isDeleted === 1) {
                done(null, 'deleted');
            } else if (user.isFreeze === true) {
                done(null, 'freezed');
            }


        });


    });

});


const JwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(JwtOptions, function (payload, done) {

    User.findOne({email: payload.sub}, function (err, user) {

        if (err) return done(err, false);

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }

    })

});

Passport.use(jwtLogin);
Passport.use(localLogin);
