var mongoose = require('mongoose');
var Timetable = mongoose.model('timetable');
var Vehicle = mongoose.model('vehicle');


module.exports.addTimetable = function(req,res){
    if(!req.body.LineId || !req.body.DayId || !req.body.Departures || !req.body.VehicleId){
        return res.status(400).json({ "message": "You must complete all the fields!"})
    }

    



    
    Timetable.find().exec().then(tt=>{
        var timetable = new Timetable();
        if(tt == null || tt == undefined || tt.length == 0){
            timetable.line = req.body.LineId;
            timetable.vehicle = req.body.VehicleId;
            timetable.dayType = req.body.DayId;
            timetable.departures = req.body.Departures;


            timetable.save();
            return res.status(200).json({
                "message" : "Timetable successfully added!"
            });
        }
        else{
        tt.forEach(element => {
            if(element.line._id == req.body.LineId && 
                element.vehicle._id == req.body.VehicleId &&
                element.dayType._id == req.body.DayId){

                    //0 - ako su isti
                    //-1 ako su razliciti
                    let existString = element.departures.toString().indexOf(req.body.Departures);
                    if(existString == 0){
                        return res.status(400).json({"message" : "Departures already exists!"})
                    }
                    else{
                        let pomDep = element.departures.toString() +"|"+ req.body.Departures.toString();
                        const nesto = {departures: pomDep};


                       

                        Timetable.findOneAndUpdate({_id : element._id}, nesto).then(update => {
                            return res.status(200).json({
                                "message" : "Station successfully updated."
                            });
                        })
                    }
                }
                else{
                    timetable.line = req.body.LineId;
                    timetable.vehicle = req.body.VehicleId;
                    timetable.dayType = req.body.DayId;
                    timetable.departures = req.body.Departures;

                    timetable.save();
                    return res.status(200).json({
                        "message" : "Timetable successfully added!"
                    });

                    // timetable.save(function(err){
                    //     Vehicle.find({_id: req.body.VehicleId}).exec().then(va=>{
                    //         if(va){
                    //             if(va.timetables == undefined){
                    //                 va.timetables = [];
                    //             }
                    //             var list1 = [];
                    //             list1 = va.timetables;
                    //             list.push(timetable._id);
                    //             const nesto = { timetables : list};
                            
                    //                 Vehicle.findByIdAndUpdate({_id: req.body.VehicleId},nesto).then(bla => {
                    //                     res.status(200).json({
                    //                         "message" : "Timetable successfully added."
                    //                     });
                    //                 })
                    //         }
                    //     })
                    // })
                    
                }
        });
    }
    })
}




// module.exports.addTimetable = function(req,res){
//     if(!req.body.LineId || !req.body.DayId || !req.body.Departures || !req.body.VehicleId){
//         return res.status(400).json({ "message": "You must complete all the fields!"})
//     }

//     var timetable = new Timetable();
    
//     Timetable.find().exec().then(tt=>{
//         if(tt == null || tt == undefined || tt.length == 0){
//             timetable.line = req.body.LineId;
//             timetable.vehicle = req.body.VehicleId;
//             timetable.dayType = req.body.DayId;
//             timetable.departures = req.body.Departures;

//             Vehicle.find({_id: req.body.VehicleId}).exec().then(v=>{
//                 if(v){
//                     timetable.save(function(err){
//                         if(err){
//                          return  res.status(404).json(err);
//                         }
//                         if(v.timetables == undefined){
//                             v.timetables = [];
//                         }
//                          var list = [];
//                          list = v.timetables;
//                          list.push(timetable._id);
//                          const nesto = { timetables : list};
                     
//                              Vehicle.findByIdAndUpdate({_id: v._id},nesto).then(bla => {
//                                  res.status(200).json({
//                                      "message" : "Timetable successfully added."
//                                  });
//                              })

//                     })
//                 }
//             })


//         }else{
//         tt.forEach(element => {
//             if(element.line._id == req.body.LineId && 
//                 element.vehicle._id == req.body.VehicleId &&
//                 element.dayType._id == req.body.DayId){
//                     /*
//                     var string = "foo",
//                     substring = "oo";
//                     console.log(string.indexOf(substring) !== -1);
//                      */
//                     //0 - ako su isti
//                     //-1 ako su razliciti
//                     let existString = element.departures.toString().indexOf(req.body.Departures);
//                     if(existString == 0){
//                         return res.status(400).json({"message" : "Departures already exists!"})
//                     }
//                     else{
//                         let pomDep = element.departures.toString() +"|"+ req.body.Departures.toString();
//                         const nesto = {departures: pomDep};

//                         Timetable.findOneAndUpdate({_id : element._id}, nesto).then(update => {
//                             res.status(200).json({
//                                 "message" : "Station successfully updated."
//                             });
//                         })
//                     }
//                 }
//                 else{
//                     timetable.line = req.body.LineId;
//                     timetable.vehicle = req.body.VehicleId;
//                     timetable.dayType = req.body.DayId;
//                     timetable.departures = req.body.Departures;

//                     /*
//                     timetable.save(function(err){
//                     if(err)
//                     {
//                         res.status(404).json(err);
//                         return;
//                     }

//                     var list = v.timetables;
//                     list.push(timetable._id);
//                     const nest = { timetables : list}
                   
//                         Vehicle.findByIdAndUpdate({_id: v._id},nest).then(bla => {
//                             res.status(200).json({
//                                 "message" : "Timetable successfully added."
//                             });
//                         })
                        
                        
//                     });
//                     */
//                    Vehicle.find({_id: req.body.VehicleId}).exec().then(v=>{
//                        if(v){
//                            timetable.save(function(err){
//                                if(err){
//                                 return  res.status(404).json(err);
//                                }

//                                if(v.timetables == undefined){
//                                     v.timetables = [];
//                                 }
//                                 var list = [];
//                                 list = v.timetables;
//                                 //var list = v.timetables;
//                                 list.push(timetable._id);
//                                 const nesto = { timetables : list};
                            
//                                     Vehicle.findByIdAndUpdate({_id: v._id},nesto).then(bla => {
//                                         res.status(200).json({
//                                             "message" : "Timetable successfully added."
//                                         });
//                                     })

//                            })
//                        }
//                    })

                    
//                 }
//         });
//     }
//     })
// }