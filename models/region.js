/**
 * Created by Ozgen on 12/17/16.
 */


const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const TaskLog = new Scheme({
    created_by: String, // email
    created_at: {type: Date, default: Date.now}

});


const branchScheme = new Scheme({
    name: String,
    locationx: String,
    locationy: String,
    logo: String,
    explanation: String,
    is_deleted: Number,
    name_: String

});


const regionScheme = new Scheme({

    name: {type: String, unique: true},
    code: String,
    name_: String,
    locationx: String,
    locationy: String,
    logo: String,
    branch: [branchScheme],
    explanation: String,
    useremail: String,
    is_deleted: Number, // 0: not deleted 1: deleted
    logs: [TaskLog]

});

regionScheme.pre('save', function (next) {
    const log = {};
    log.created_at = Date.now();
    log.created_by = this.useremail;
    this.logs.push(log);
    next();
});


const region = mongoose.model('region', regionScheme);
module.exports = region;