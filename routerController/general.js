/**
 * Created by Ozgen on 9/24/16.
 */

const fs = require('fs');
const path = require('path');
const Region = require('./../models/region');
const Authentication = require('./authentication');

function findAndRemove(array, property, value) {
    array.forEach(function (result, index) {
        if (result[property] === value) {
            //Remove from array
            array.splice(index, 1);
        }
        return array;
    });
}

exports.getPlatePicture = function (req, res, next) {
    const picPath = path.join(__dirname, '../', 'uploads/traffic/', req.params.pictureName);
    fs.readFile(picPath, function (err, file) {
        if (err) res.status(400).json({err: err});
        return res.status(200).send(file);
    });
}
exports.getProfilePicture = function (req, res, next) {
    const picPath = path.join(__dirname, '../', 'uploads/profilePictures/', req.params.pictureName);
    fs.readFile(picPath, function (err, file) {
        if (err) res.status(400).json({err: err});
        return res.status(200).send(file);
    });
}

exports.saveRegion = function (req, res) {

    Authentication.checkRole(req, "super_admin", function (rs) {
        if (rs) {
            if (req.body._id) {
                Region.findByIdAndUpdate(req.body._id, req.body, function (err, region) {
                    if (err) return res.status(404).send(err);

                    return res.status(200).send(region);
                })
            } else {
                const region = new Region(req.body);
                const email = Authentication.parseToken(req.headers.authorization);
                region.is_deleted = 0;
                region.useremail = email.sub;
                region.save(function (err, data) {
                    console.log(err);
                });
                return res.status(200).send(region);
            }
        } else {
            return res.status(401).send({err: "yetki"});
        }
    });


}
exports.getRegions = function (req, res) {

    Authentication.checkRole(req, "admin", function (rs) {
        if (rs) {
            const query = Region.find();
            query.where('is_deleted').ne(1);
            if (req.headers.region !== 'undefined') {
                query.where('name_').equals(req.headers.region);
            }

            query.exec(function (err, data) {
                if (err) return res.status(404).send(err);
                return res.status(200).send(data);
            })
        } else {
            return res.status(401).send({err: "yetki"});
        }
    })
}

exports.getTheRegion = function (req, res) {
    Region.findById(req.body.region_id, function (err, region) {

        if (err) return res.status(404).send(err);


        return res.status(200).send(region);

    })

}

exports.saveBranch = function (req, res) {
    Authentication.checkRole(req, 'admin', function (rs, brc) {

        if (rs && !brc) {
            Region.findById(req.body.region_id, function (err, region) {

                if (err) return res.status(404).send(err);
                if (region.is_deleted == 1) return res.status(404).send("silinmiş");

                const branch = {};
                const model = req.body.branchModel;
                branch.name = model.name;

                branch.locationx = model.locationx;
                branch.locationy = model.locationy;
                branch.explanation = model.explanation;
                branch.logo = model.logo;
                if (region.branch.length > 0)
                    findAndRemove(region.branch, 'name', branch.name);
                region.branch.push(branch);
                region.save();
                return res.status(200).send(region);
            })
        } else return res.status(401).send("yetki");

    })
}

exports.getTheRegionWithName = function (req, res) {
    Region.findOne({name_: req.body.region, is_deleted: 0}, function (err, region) {

        if (err) return res.status(404).send(err);

        return res.status(200).send(region);
    })

}

exports.getBranches = function (req, res) {
    Authentication.checkRole(req, "admin", function (rs, brc) {
        if (rs && !brc) {
            Region.findById(req.body.region_id, function (err, region) {

                if (err) return res.status(404).send(err);

                if (region)  return res.status(200).send(region.branch);
                else return res.status(404).send("subeyok")
            });

        } else {
            return res.status(401).send({err: "yetki"});
        }
    })
}

exports.deleteBranch = function (req, res) {
    Authentication.checkRole(req, "admin", function (rs, brc) {

        if (rs && !brc) {
            Region.findById(req.body.region_id, function (err, region) {

                if (err) return res.status(404).send(err);

                const model = req.body;
                if (req.body) {

                    if (region.branch.length > 0)
                        findAndRemove(region.branch, 'name', model.name);
                    region.save();
                    return res.status(200).send(region);

                    return res.status(200).send(region.branch);
                } else {
                    return res.status(404).send("sube yok");
                }
            });

        } else {
            return res.status(401).send({err: "yetki"});
        }
    })

}

exports.getCoords = function (req, res) {
    const query = Region.find();
    if (req.headers.region !== 'undefined')
        query.where('name_').equals(req.headers.region);
    else
        query.where('name').equals('Ankara');

    if (req.headers.branch !== 'undefined') {
        query.where('branch').elemMatch(function (elem) {
            elem.where('name_').equals(req.headers.branch);
        });
    }
    query.exec(function (err, region) {
        if (err) return res.status(404).send(err);
        const coords = {};
        if (req.headers.branch !== 'undefined') {
            const branches = region[0].branch;
            branches.forEach(function (result, index) {
                if (result.name_.localeCompare(req.headers.branch) === 0) {
                    coords.locationx = result.locationx;
                    coords.locationy = result.locationy;
                }
            })
        } else {
            coords.locationx = region[0].locationx;
            coords.locationy = region[0].locationy;

        }

        return res.status(200).send(coords);
    })

}
