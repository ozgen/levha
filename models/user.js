/**
 * Created by Ozgen on 9/8/16.
 */
const mongoose = require('mongoose');
const Scheme = mongoose.Schema;
const bycrpt = require('bcrypt-nodejs');

const role = new Scheme({
    role: String,
    region: String,
    branch: String
})

const userScheme = new Scheme({

    email: {type: String, unique: true, lowercase: true},
    password: String,
    name: String,
    tcNo: Number,
    surname: String,
    workPhone: String,
    privatePhone: String,
    adress: String,
    pictureName: String,
    isFreeze: Boolean,
    isLocked: Boolean,
    created_at: Date,
    updated_at: Date,
    roles: [role],
    registered: Boolean,
    isDeleted: Number, // 0: not deleted 1: deleted
    status: String
});

userScheme.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

userScheme.pre('save', function (next) {

    const user = this;

    bycrpt.genSalt(10, function (err, salt) {

        if (err) return next(err);

        bycrpt.hash(user.password, salt, null, function (err, hash) {

            if (err) return next(err);

            user.password = hash;

            next();

        })

    })
});

userScheme.methods.comparePassword = function (candidatePass, callback) {

    bycrpt.compare(candidatePass, this.password, function (err, isMatch) {
        if (err) {
            return callback(err);
        }


        callback(null, isMatch);

    })

}
userScheme.methods.getHashPassword = function (password, callback) {

    bycrpt.genSalt(10, function (err, salt) {

        if (err) return next(err);

        bycrpt.hash(password, salt, null, function (err, hash) {

            if (err) return callback(err);

            callback(null, hash);

        })

    })
}


const user = mongoose.model('user', userScheme);

module.exports = user;

