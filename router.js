/**
 * Created by Ozgen on 9/8/16.
 */
const express = require('express');
const Authentication = require('./routerController/authentication');
const passportService = require('./services/passport');
const passport = require('passport');
const PlateBusiness = require('./routerController/plateBusiness');
const GeneralBusiness = require('./routerController/general');
const UserBusiness = require('./routerController/userBusiness');

const requireAuth = passport.authenticate('jwt', {session: false});

const requireSignin = passport.authenticate('local', {session: false});
const app = express();


app.post('/upload', function (req, res) {
    return res.status(200).send('Files are uploaded!');
});

app.post('/signup', Authentication.signUp);
app.post('/signin', requireSignin, Authentication.signin);
app.post('/plate', requireAuth, PlateBusiness.getPlates);
app.get('/getpic/:pictureName', GeneralBusiness.getPlatePicture);
app.get('/profilepic/:pictureName', GeneralBusiness.getProfilePicture);
app.post('/save/reqplate', requireAuth, PlateBusiness.savePlateRequest);
app.post('/update/reqplate', requireAuth, PlateBusiness.updatePlateRequest);
app.post('/update/alls/reqplate', requireAuth, PlateBusiness.updateAllPlateRequest);
app.get('/get/reqplate/monthly', requireAuth, PlateBusiness.getPlateReqMonthly);
app.get('/get/reqplate/completed', requireAuth, PlateBusiness.getCompletedPlateReq);
app.get('/get/reqplate/notcompleted', requireAuth, PlateBusiness.getNotCompletedPlateReq);
app.post('/save/plateoperation', requireAuth, PlateBusiness.savePlateOpearations);
app.get('/get/plate/operation/:plate_id', requireAuth, PlateBusiness.getOnePlateOperations);
app.post('/search/param', requireAuth, PlateBusiness.getSearchData);
app.post('/delete/platereq', requireAuth, PlateBusiness.deletePlateReq);
app.get('/get/types', requireAuth, PlateBusiness.getPlateTypes);
app.get('/get/all/users', requireAuth, UserBusiness.getAllUsers);
app.get('/get/online/users', requireAuth, UserBusiness.getOnlineUsers);
app.get('/get/freeze/users', requireAuth, UserBusiness.getFreezeUser);
app.post('/update/user', requireAuth, UserBusiness.updateUser);
app.get('/logout', requireAuth, Authentication.logout);
app.post('/save/plate/def', requireAuth, PlateBusiness.savePlateDef);
app.post('/save/region', requireAuth, GeneralBusiness.saveRegion);
app.post('/save/branch', requireAuth, GeneralBusiness.saveBranch);
app.get('/get/all/region', requireAuth, GeneralBusiness.getRegions);
app.post('/get/the/region', requireAuth, GeneralBusiness.getTheRegion);
app.get('/get/all/platedef', requireAuth, PlateBusiness.getAllPlateDefs);
app.post('/get/the/plate_type', requireAuth, PlateBusiness.getPlateType);
app.post('/save/plate_type', requireAuth, PlateBusiness.savePlateType);
app.post('/get/region/name', requireAuth, GeneralBusiness.getTheRegionWithName);
app.post('/get/region/branches', requireAuth, GeneralBusiness.getBranches);
app.post('/delete/region/branch', requireAuth, GeneralBusiness.deleteBranch);
app.get('/get/coord', requireAuth, GeneralBusiness.getCoords);
app.get('/get/allapprovable/reqplate', requireAuth, PlateBusiness.getAllApprovablePlates);

module.exports = app;