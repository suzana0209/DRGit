var mongoose = require('mongoose');
var DayType = mongoose.model('dayType');

module.exports.getAllDayTypes = function(req,res){
    DayType.find().exec().then(dt=>{
        res.send(dt);
    })
}