/**
 * Created by Ozgen on 12/17/16.
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const connections = {};

exports.getDatabaseConnection = function(dbName) {

    if(connections[dbName]) {
        //database connection already exist. Return connection object
        return connections['dbName'];
    } else {
        connections[dbName] = mongoose.createConnection('mongodb://admin:root@ds035836.mlab.com:35836/' + dbName);
        return connections['dbName'];
    }
}