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
var ctrlPricelist = require('../controllers/pricelistController');
var ctrlVehicle = require('../controllers/vehicleController');



router.post('/register', ctrlAuth.register);
router.post('/logIn', ctrlAuth.logIn);
router.get('/getUserData', ctrlAuth.getUserData);

router.get('/getPassengerTypes',  ctrlPassengerType.findAllPassengerType);

router.get('/getUserData', auth, ctrlProfile.getUserData);
router.get('/profile', auth, ctrlProfile.profileRead);

router.post('/addStation', ctrlStation.addStation);
//router.get('getAllStations', ctrlStation.getAllStations);
router.get('/getAllStations', ctrlStation.getAllStations);
router.post('/changeStation', ctrlStation.changeStation);
router.delete('/deleteStation/:_id', ctrlStation.deleteStation);

router.post('/addLine', ctrlLine.addLine);
router.get('/getAllLines', ctrlLine.getAllLines);
router.post('/changeLine/:_id',ctrlLine.changeLine);
router.delete('/deleteLine/:_id', ctrlLine.deleteLine);

router.post('/addPricelist', ctrlPricelist.addPricelist);
router.get('/getPricelist', ctrlPricelist.getPricelist);
router.get('/getTicketPrices', ctrlPricelist.getTicketPrices);

router.post('/addVehicle', ctrlVehicle.addVehicle);

module.exports = router;