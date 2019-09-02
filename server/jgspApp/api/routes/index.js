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
var ctrlDayType = require('../controllers/dayTypeController');
var ctrlTimetable = require('../controllers/timetableController');
var ctrlVerifyUser = require('../controllers/verifyControllers');
var ctrlTicket = require('../controllers/ticketController');


router.post('/register', ctrlAuth.register);
router.post('/logIn', ctrlAuth.logIn);
router.get('/getUserData', ctrlAuth.getUserData);
router.post('/editPassword', ctrlAuth.editPassword);
router.post('/edit', ctrlAuth.edit);

router.get('/getPassengerTypes',  ctrlPassengerType.findAllPassengerType);

//router.get('/getUserData', auth, ctrlProfile.getUserData);
router.get('/profile', auth, ctrlProfile.profileRead);
router.post('/resendRequest', ctrlProfile.resendRequest);

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
router.post('/calculatePrice', ctrlPricelist.calculatePrice);

router.post('/addVehicle', ctrlVehicle.addVehicle);
router.get('/getAllVehicle', ctrlVehicle.getAllVehicle);
router.delete('/deleteVehicle/:_id', ctrlVehicle.deleteVehicle);

router.get('/getAllDayTypes', ctrlDayType.getAllDayTypes);

router.post('/addTimetable', ctrlTimetable.addTimetable);
router.get('/getAllTimetable', ctrlTimetable.getAllTimetable);
router.post('/changeTimetable', ctrlTimetable.changeTimetable);
router.delete('/deleteTimetable/:_id', ctrlTimetable.deleteTimetable);

router.get('/getAwaitingAdmins', ctrlVerifyUser.getAwaitingAdmins);
router.get('/getAwaitingControllers', ctrlVerifyUser.getAwaitingControllers);
router.get('/getAwaitingAppUsers', ctrlVerifyUser.getAwaitingAppUsers);
router.get('/getDeniedUsers', ctrlVerifyUser.getDeniedUsers);

router.post('/autorizeAdmin', ctrlVerifyUser.autorizeAdmin);
router.post('/authorizeController', ctrlVerifyUser.authorizeController);
router.post('/authorizeAppUser', ctrlVerifyUser.authorizeAppUser);
router.post('/denyAdmin', ctrlVerifyUser.denyAdmin);
router.post('/denyController', ctrlVerifyUser.denyController);
router.post('/denyAppUser', ctrlVerifyUser.denyAppUser);
router.post('/authorizeDeniedUser', ctrlVerifyUser.authorizeDeniedUser);

router.get('/priceForPaypal', ctrlTicket.priceForPaypal);
router.post('/postPayPalModel', ctrlTicket.postPayPalModel);

router.post('/getTicketWithCurrentAppUser', ctrlTicket.getTicketWithCurrentAppUser);
router.post('/validateTicket/:idTicket', ctrlTicket.validateTicket);
router.post('/getNameOfCustomer', ctrlTicket.getNameOfCustomer);



module.exports = router;