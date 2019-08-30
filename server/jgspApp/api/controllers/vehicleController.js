var mongoose = require('mongoose')
var Vehicle = mongoose.model('vehicle');

module.exports.addVehicle = function(req,res){
  
    if(!req.body.TypeOfVehicle) {
        return res.status(400).json({ "message": "You must complete all the fields!"})
    }

    var vehicle = new Vehicle();
    vehicle.vehicleType = req.body.TypeOfVehicle;

    vehicle.save(function(err){
        if(err)
        {
            res.status(404).json(err);
            return;
        }

        res.status(200).json({
            "message" : "Vehicle successfully added."
        });
    });
}

module.exports.getAllVehicle = function(req,res){
    Vehicle.find().exec().then(aa=>{
        res.send(aa);
    })
}

module.exports.deleteVehicle = function(req,res){
    if(!req.params._id){
        return res.status(400).json({ "message": "Don't exist vehicle !"});
    }

    Vehicle.findOneAndRemove({_id: req.params._id}).exec().then(vehicle=>{
        res.status(200).json({
            "message":"Vehicle successfully deleted!"
        });
    });
}