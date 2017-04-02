/**
 * Created by Ozgen on 12/16/16.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const plateScheme = new Schema({

    picture_name: String,
    expiration_date: Date,
    material: String,
    no: {type: String, unique: true},
    plate_type: String,
    plate_type_label:String,
    scale: [String],
    explanation: String,
    useremail: String,
    is_deleted: Number, // 0: not deleted 1: deleted
    deleted_date: Date,
    plate_shape: String,
    plate_shape_explanation: String

});

const plateDef = mongoose.model('plateDef', plateScheme);

module.exports = plateDef;
