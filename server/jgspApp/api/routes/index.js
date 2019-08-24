var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
var ctrlPassengerType = require('../controllers/passengerTypeController');
var ctrlStation = require('../controllers/stationController');
var ctrlLine = require('../controllers/lineController');


router.get('/profile', auth, ctrlProfile.profileRead);

router.post('/register', ctrlAuth.register);
router.post('/logIn', ctrlAuth.logIn);

router.get('/getPassengerTypes',  ctrlPassengerType.findAllPassengerType);
router.get('/getUserData', auth, ctrlProfile.getUserData);

router.post('/addStation', ctrlStation.addStation);
//router.get('getAllStations', ctrlStation.getAllStations);
router.get('/getAllStations', ctrlStation.getAllStations);
router.post('/changeStation', ctrlStation.changeStation);
router.delete('/deleteStation/:_id', ctrlStation.deleteStation);

router.post('/addLine', ctrlLine.addLine);
router.get('/getAllLines', ctrlLine.getAllLines);
router.post('/changeLine/:_id',ctrlLine.changeLine);
router.delete('/deleteLine/:_id', ctrlLine.deleteLine);


module.exports = router;