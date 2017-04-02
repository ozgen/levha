/**
 * Created by Ozgen on 10/10/16.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plateOperationScheme = new Schema({

    plate_id: String,
    operation_date: Date,
    explanation: String,
    useremail: String,
    process: String
});


const plateOperation = mongoose.model('plateOperation', plateOperationScheme);

module.exports = plateOperation;
