/**
 * Created by Ozgen on 10/17/16.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plateType = new Schema({

    name: String,
    value: {type: String, unique: true}

});

const PlateType = mongoose.model('plateType', plateType);

module.exports = PlateType;

