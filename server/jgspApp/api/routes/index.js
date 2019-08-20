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


router.get('/profile', auth, ctrlProfile.profileRead);

router.post('/register', ctrlAuth.register);
router.post('/logIn', ctrlAuth.logIn);
router.get('/getPassengerTypes',  ctrlPassengerType.findAllPassengerType);


module.exports = router;