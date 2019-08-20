var mongoose = require('mongoose');
var PassengerType = mongoose.model('passengerType');


module.exports.findAllPassengerType = function(req, res)
{
    var types = [];
    
     PassengerType.find().exec().then(type => { res.send(type);});
    console.log(type);
    
    
};


