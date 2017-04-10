/**
 * Created by Ozgen on 9/22/16.
 */

const fs = require('fs');
const path = require('path');
const Authentication = require('./authentication');
const PlateRequest = require('./../models/plate');
const PlateOperation = require('./../models/plateOperation');
const PlateType = require('./../models/plateType');
const PlateDefinition = require('./../models/plate_model');


exports.getPlateDataWithLocal = function (req, res, next) {
    const category = req.body.plate_type;
    const JSONFilePath = path.join(__dirname, '../', 'models/plateJson.json');
    fs.readFile(JSONFilePath, 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);

        return res.status(200).send(obj[category]);


    });

}

exports.savePlateRequest = function (req, res) {

    const email = Authentication.parseToken(req.headers.authorization);
    var data = req.body;
    var dataArr = [];
    for (var i = 0; i < data.length; i++) {
        var plateReq = new PlateRequest(data[i]);
        plateReq.useremail = email.sub;
        plateReq.process = 'created';
        plateReq.is_deleted = 0;
        if (req.headers.region !== 'undefined')
            plateReq.region = req.headers.region;
        if (req.headers.branch !== 'undefined')
            plateReq.branch = req.headers.branch;
        dataArr.push(plateReq);
    }

    PlateRequest.insertMany(dataArr, function (error, docs) {
        if (error) return res.status(500).send(error);
        return res.status(200).send(docs);

    });

}

exports.getPlateReqMonthly = function (req, res) {

    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    const d2 = new Date();
    d2.setMonth(d2.getMonth() + 1);
    const query = PlateRequest.find();
    query.where('request_date').gte(d).lte(d2);
    query.where('process').ne('produced_montaged');
    query.where('last_montage_date').gte(d);
    query.where('is_deleted').ne(1);
    query.where('status').equals(1);
    if (req.headers.region !== 'undefined')
        query.where('region').equals(req.headers.region);
    if (req.headers.branch !== 'undefined')
        query.where('branch').equals(req.headers.branch);
    query.exec(function (err, data) {
        if (err) return res.status(500).send(err);
        console.log(data)
        return res.status(200).send(data);

    });
}

exports.getCompletedPlateReq = function (req, res) {
    const query = PlateRequest.find();
    query.where('process').equals('produced_montaged');
    query.where('is_deleted').ne(1);
    if (req.headers.region !== 'undefined')
        query.where('region').equals(req.headers.region);
    if (req.headers.branch !== 'undefined')
        query.where('branch').equals(req.headers.branch);
    query.where('status').equals(1);

    query.exec(function (err, data) {
        if (err) return res.status(500).send(err);
        return res.status(200).send(data);

    });
}

exports.updatePlateRequest = function (req, res) {

    PlateRequest.findByIdAndUpdate(req.body._id, req.body, function (err, plate) {

        if (err) return res.status(404).send(err);

        return res.status(200).send(plate);

    })

}

exports.savePlateOpearations = function (req, res) {
    const email = Authentication.parseToken(req.headers.authorization);
    var plateOperation = new PlateOperation(req.body);
    plateOperation.useremail = email.sub;
    plateOperation.save();
    PlateRequest.findById(plateOperation.plate_id, function (err, plate) {
        if (err) return res.status(404).send(err);
        plate.process = plateOperation.process;
        plate.save();

        return res.status(200).send(plateOperation);

    })
}

exports.getOnePlateOperations = function (req, res) {
    PlateOperation.find({plate_id: req.params.plate_id}, function (err, data) {

        if (err) return res.status(404).send(err);

        return res.status(200).send(data);
    })
}
exports.getNotCompletedPlateReq = function (req, res) {
    const d = new Date();
    const query = PlateRequest.find();
    query.where('process').ne('produced_montaged');
    query.where('last_montage_date').lte(d);
    query.where('is_deleted').ne(1);
    if (req.headers.region !== 'undefined')
        query.where('region').equals(req.headers.region);
    if (req.headers.branch !== 'undefined')
        query.where('branch').equals(req.headers.branch);
    query.where('status').equals(1);
    query.exec(function (err, data) {
        if (err) return res.status(500).send(err);
        return res.status(200).send(data);

    });
}

exports.deletePlateReq = function (req, res) {
    PlateRequest.findById(req.body.plate_id, function (err, plate) {
        if (err) return res.status(404).send(err);

        plate.is_deleted = 1;
        plate.deleted_date = new Date();
        plate.save();
        return res.status(200).send(plate);
    });
}

exports.savePlateTypes = function (req, res) {

    const types = req.body;


    PlateType.collection.insert(types);


    return res.status(200).send(types);

}

exports.savePlateType = function (req, res) {
    const type = new PlateType(req.body);
    type.save();
    return res.status(200).send(type);
}

exports.getPlateType = function (req, res) {
    PlateType.findOne({value: req.body.plate_type}, function (err, data) {
        if (err) return res.status(404).send(err);

        return res.status(200).send(data);
    })

}
exports.getPlateTypes = function (req, res) {
    PlateType.find({}, function (err, data) {

        if (err) return res.status(404).send(err);

        return res.status(200).send(data);
    })
}


exports.getSearchData = function (req, res) {
    const query = PlateRequest.find();
    const sp = req.body;
    if (sp.plate_type) {
        query.where('plate_type').equals(sp.plate_type);
    }
    if (sp.emergency)
        query.where('emergency').equals(sp.emergency);
    if (sp.process)
        query.where('process').equals(sp.process);
    if (sp.request_date && sp.request_date2)
        query.where('request_date').gte(sp.request_date).lte(sp.request_date2);
    if (sp.last_montage_date && sp.last_montage_date2)
        query.where('last_montage_date').gte(sp.last_montage_date).lte(sp.last_montage_date2);
    if (req.headers.region !== 'undefined')
        query.where('region').equals(req.headers.region);
    if (req.headers.branch !== 'undefined')
        query.where('branch').equals(req.headers.branch);

    query.where('is_deleted').ne(1);
    query.exec(function (err, data) {
        if (err) return res.status(500).send(err);
        return res.status(200).send(data);

    });
}

exports.savePlateDef = function (req, res) {
    const email = Authentication.parseToken(req.headers.authorization);
    if (req.body._id) {
        PlateDefinition.findByIdAndUpdate(req.body._id, req.body, function (err, def) {
            if (err) return res.status(404).send(err);

            return res.status(200).send(def);

        })
    }
    else {
        const plateDef = new PlateDefinition(req.body);
        plateDef.useremail = email.sub;
        plateDef.is_deleted = 0;
        plateDef.save();
        return res.status(200).send(plateDef);
    }
}

exports.getAllPlateDefs = function (req, res) {

    PlateDefinition.find({is_deleted: 0}, function (err, data) {
        if (err) return res.status(404).send(err);

        return res.status(200).send(data);

    })
}
exports.getAllApprovablePlates = function (req, res) {
    const query = PlateRequest.find();
    query.where('status').equals(0);
    query.where('is_deleted').ne(1);
    if (req.headers.region !== 'undefined')
        query.where('region').equals(req.headers.region);
    if (req.headers.branch !== 'undefined')
        query.where('branch').equals(req.headers.branch);
    query.exec(function (err, data) {
        if (err) return res.status(500).send(err);
        return res.status(200).send(data);

    });

}

exports.getPlates = function (req, res) {
    const plateType = req.body.plate_type;
    PlateDefinition.find({is_deleted: 0, plate_type: plateType}, function (err, data) {
        if (err) return res.status(404).send(err);

        return res.status(200).send(data);

    })
}