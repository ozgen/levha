/**
 * Created by Ozgen on 9/21/16.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskLog = new Schema({
    status: String,
    created_by: String, // email 
    created_at: {type: Date, default: Date.now}

});

const plateRequestScheme = new Schema({

    picture_name: String,
    emergency: Number, // 1: çok önemli, 2: önemli, 3: az önemli
    expiration_date: Date,
    material: String,
    no: String,
    plate_type: String,
    selScale: String,
    request_date: Date,
    explanation: String,
    useremail: String,
    locationx: String,
    locationy: String,
    process: String,
    last_montage_date: Date,
    is_deleted: Number, // 0: not deleted 1: deleted
    deleted_date: Date,
    plate_shape: String,
    plate_shape_explanation: String,
    region: String,
    branch: String,
    status: Number, //0: yeni yaratıldı 1: onaylandı
    barcode: String,
    logs: [TaskLog],
    assignee:String

});

plateRequestScheme.pre('save', function (next) {
    const log = {};
    log.status = this.status;
    log.created_by = this.useremail;
    log.created_at = Date.now;
    this.logs.push(log);
    next();
});

const plateRequest = mongoose.model('plateRequest', plateRequestScheme);

module.exports = plateRequest;
