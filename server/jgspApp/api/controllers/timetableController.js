var mongoose = require('mongoose');
var Timetable = mongoose.model('timetable');
var Vehicle = mongoose.model('vehicle');
var DayType = mongoose.model('dayType');
var Line = mongoose.model('line');



module.exports.getAllTimetable = function(req,res){
    Timetable.find().exec().then(data=>{
        res.send(data);
    })
}

module.exports.addTimetable = function(req,res){
    if(!req.body.DayId || !req.body.LineId || !req.body.VehicleId || !req.body.TipDodavanja || !req.body.Departures){
        return res.status(400).json({ "message": "You must complete all the fields!"})
    }

    if(req.body.TipDodavanja == "alreadyExist"){
        return res.status(400).json({ "message": "Departures "+ req.body.Departures +" already exists!"})
    }

    else if(req.body.TipDodavanja == "update"){
        const nesto = {departures: req.body.Departures};

       
        Timetable.findOneAndUpdate({_id: req.body.Idd}, nesto).then(data=>{
            return res.status(200).json({"message":"Timetable successfully added!"})
        }) 
    }
    else{
        var timetable = new Timetable();
        timetable.departures = req.body.Departures;
        
        Line.findOne({_id: req.body.LineId}).then(li=>{
            timetable.line = li._id;

            DayType.findOne({_id: req.body.DayId}).then(dt=>{
                timetable.dayType = dt._id;

            Vehicle.findOne({_id: req.body.VehicleId}).then(vv=>{
                timetable.vehicle = vv._id;

                timetable.save(function(err){
                    if(err){
                        res.status(404).json(err);
                    }

                    var list = vv.timetables;
                    list.push(timetable._id);

                    const nestoo = {timetables: list};

                    Vehicle.findByIdAndUpdate({_id: req.body.VehicleId}, nestoo).then(data=>{
                        res.status(200).json({"message": "Timetable successfully added!"})
                    })
                })
            })
            
            })
        })
    }
}

module.exports.changeTimetable = function(req,res){
    if(!req.body.LineId || !req.body.DayId || !req.body.Idd){
        res.status(400).json({"message":"You must complete all the fields!!"})
    }

    //console.log(string.indexOf(substring) !== -1);
    let pom = req.body.Departures.toString();
    let subPom = req.body.TipDodavanja.toString();

    let rez = pom.split('|');
    let count = 0;
    rez.forEach(element => {
        if(element == subPom){
            count = count + 1;
        }
    });

    if(count == 2){
        res.status(400).json({"message":"Departure "+ req.body.TipDodavanja +" already exist in database!"})
    }

    const nesto = {departures: req.body.Departures};

       
    Timetable.findOneAndUpdate({_id: req.body.Idd}, nesto).then(data=>{
        return res.status(200).json({"message":"Timetable successfully changed!"})
    }) 

   
}

module.exports.deleteTimetable = function(req,res){
    if(!req.params._id){
        return res.status(400).json({ "message": "Don't exist vehicle !"});
    }

    Timetable.findById(req.params._id).then(tt=>{

        if(tt == null || tt == undefined){
            return res.status(404).json({"message": "Timetable doesn't exists!"});
        }
        else{
            Timetable.findOneAndRemove({_id: req.params._id}).then(bla =>{
            Vehicle.find().then(aa=>{
                aa.forEach(bb=>{
                    bb.timetables.forEach(timet=>{
                        if(timet == req.params._id){
                            bb.timetables.remove(timet);
                            Vehicle.findOneAndUpdate({_id: bb._id}, {timetables: bb.timetables}).then(ff=>{});
                        } 
                    })
                })
                return res.status(200).json({"message": "Timetable successfully deleted!"})
            })
        })
        }
    
    })
}

// module.exports.deleteTimetable = function(req,res){
//     if(!req.params._id){
//         return res.status(400).json({ "message": "Don't exist vehicle !"});
//     }

//     Timetable.findOneAndRemove({_id: req.params._id}).exec().then(tt=>{
//         return res.status(200).json({"message": "Timetable successfully delted!"})
//     })
// }