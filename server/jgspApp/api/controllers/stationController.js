var mongoose = require('mongoose');
var Station = mongoose.model('station');
var Line = mongoose.model('line');

module.exports.deleteStation = function(req, res){  
    if(!req.params._id ) {
        return res.status(400).json({ "message": "You must select station from combo box!"})
    }

    Station.findOne({_id: req.params._id}).then(data=>{
        if(!data){
            return res.status(400).json({"message": "The selected station does not exist in the database!"})
        }
        else{
            Station.findOneAndRemove({_id: req.params._id}).then(bla =>{

                Line.find().then(aa => {
                    aa.forEach(bb => {
                        bb.stations.forEach(cc => {
                            if(cc == req.params._id) {
                                bb.stations.remove(cc);
                                Line.findOneAndUpdate({_id: bb._id}, {stations:bb.stations}).then(abc => {});
                            }
                        })
                    })
                })
                return res.status(200).json({"message" : "Station successfully deleted!" });
            });
        }
    })

    
}

module.exports.changeStation = function(req, res){
    if(!req.body.Name || !req.body.AddressStation || !req.body.Latitude || !req.body.Longitude ) {
        return res.status(400).json({ "message": "You must complete all the fields!"})
    }

    Station.findById(req.body.Id).exec().then(st=>{
        if(st.__v != req.body.Version){
            return res.status(400).json({"message":"You are trying to change station that has been changed recently"});
        }
        else{
            var vers = req.body.Version + 1;
            const nest = { address : req.body.Address, name : req.body.Name, latitude : req.body.Latitude, longitude: req.body.Longitude, __v: vers}
            Station.findOneAndUpdate({_id : req.body.Id}, nest).then(bla => {
                res.status(200).json({ "message" : "Station successfully changed!"});
            })
        }
    })
}

module.exports.getAllStations = function(req, res){
    Station.find().exec().then(type => { res.send(type);});
    //console.log(type); 
};


module.exports.addStation = function(req, res){
    if(!req.body.Name || !req.body.AddressStation || !req.body.Latitude || !req.body.Longitude ) {
        return res.status(400).json({ "message": "You must complete all the fields!"})
    }

    if((req.body.Name.charAt(0)) >= "0" && (req.body.Name.charAt(0)) <= "9"){
        return res.status(400).json({ "message": "The station name can't start with a number!"});
    }

    Station.findOne({name: req.body.Name}).then(st=>{
        if(st){
            return res.status(400).json({"message": "Station name "+ req.body.Name+" already exists"})
        }
        else{
            Station.findOne({addressStation: req.body.AddressStation}).then(st1=>{
                if(st1){
                    return res.status(400).json({"message": "On address "+req.body.AddressStation+" already exists station!"})
                }
                else{
                    var station = new Station();

                    station.name = req.body.Name;
                    station.addressStation = req.body.AddressStation;
                    station.latitude = req.body.Latitude;
                    station.longitude = req.body.Longitude;
        
                    station.save(function(err){
                        if(err) {
                            return res.status(404).json({ "message": err})
                        }
        
                        return res.status(200).json({"message" : "Station successfully added!"});
                    });
                }
            })
           
        }
    })
};