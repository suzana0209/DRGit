var mongoose = require('mongoose');
var Line = mongoose.model('line');
var Station = mongoose.model('station');


module.exports.deleteLine = function(req, res){
    if(!req.params._id ) {
        return res.status(400).json({ "message": "You must select line from combo box!"})
    }

    Line.findOne({_id: req.params._id}).then(ds=>{
        if(!ds){
            return res.status(400).json({"message": "The selected line does not exist in the database!"})
        }
        else{
            Line.findOneAndRemove({_id: req.params._id}).then(dataaa =>{
                res.status(200).json({"message" : "Line successfully deleted!"});
            });
        }
    })
   
};


module.exports.changeLine = function(req, res){
    if(!req.params._id ||  !req.body.RegularNumber || !req.body.ColorLine  ) {
        return res.status(400).json({ "message": "You must complete all the fields!"})
    }

    if(req.body.ListOfStations.length <= 1){
        return res.status(400).json({ "message": "The line must contain at least two stations!"})
    }

    const nest = { regularNumber : req.body.RegularNumber, stations: req.body.ListOfStations}
    Line.findOneAndUpdate({_id : req.params._id}, nest).then(dataaa => {
        res.status(200).json({"message" : "Line successfully updated."});
    })
}


module.exports.getAllLines = function(req,res)
{
    Line.find().exec().then(type => { res.send(type);});
    console.log("linije:", type);

}

module.exports.addLine = function(req, res)
{
    if(!req.body.RegularNumber || !req.body.ColorLine ) {
        return res.status(400).json({ "message": "You must complete all the fields!"})
    }

    if(req.body.ListOfStations.length <= 1){
        return res.status(400).json({ "message": "The line must contain at least two stations!"})
    }

    Line.findOne({regularNumber: req.body.RegularNumber}).then(linee=>{
        if(linee){
            return res.status(400).json({"message": "Line number "+ req.body.RegularNumber+" already exists"})
        }
        else{
            var line = new Line();
            line.regularNumber = req.body.RegularNumber;
            line.colorLine = req.body.ColorLine;
        
            req.body.ListOfStations.forEach(function(element) {
                line.stations.push(element.Id);
            });
        
            line.save(function(err){
                if(err) {
                    return res.status(404).json({"message":err});
                }
                return res.status(200).json({ "message" : "Line successfully added!"});
            });
        }
    })
};