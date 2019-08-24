var mongoose = require('mongoose');
var Line = mongoose.model('line');
var ST = mongoose.model('station');


module.exports.deleteLine = function(req, res)
{
    
    if(!req.params._id ) {
        sendJSONresponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }

    Line.findOneAndRemove({_id: req.params._id}).then(bla =>{

        res.status(200).json({
            "message" : "Station successfully removed."
    });
});
}


module.exports.changeLine = function(req, res){
    if(!req.params._id ||  !req.body.RegularNumber || !req.body.ColorLine || req.body.Stations.length<=1 ) {
        sendJSONresponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }
    const nest = { regularNumber : req.body.RegularNumber, stations: req.body.Stations}
    Line.findOneAndUpdate({_id : req.params._id}, nest).then(bla => {
        res.status(200).json({
            "message" : "Station successfully updated."
        });
    })

}


module.exports.getAllLines = function(req,res)
{
    Line.find().exec().then(type => { res.send(type);});
}



module.exports.addLine = function(req, res)
{
    if(!req.body.RegularNumber || !req.body.ColorLine || req.body.Stations<=1 ) {
        sendJSONresponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }

    var line = new Line();

    line.RegularNumber = req.body.RegularNumber;
    line.colorLine = req.body.ColorLine;

    var stat = [];
    req.body.Stations.forEach(function(element) {

        line.stations.push(element.Id);
    //     ST.findOne({_id: element.Id}).then(bla => {
    //         line.stations.push(bla.id);
    //   });
    });

    line.save(function(err){
        if(err)
        {
            res.status(404).json(err);
            return;
        }

        res.status(200).json({
            "message" : "Station successfully added."
        });
    
    });


};