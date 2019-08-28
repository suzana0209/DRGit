var mongoose = require('mongoose');

var vehicleSchema = new mongoose.Schema({

    vehicleType: {
        type: String,
        required: true
    },
    timetables: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'timetable'
    }],
    
   
    
}, {collection: 'vehicle'});

mongoose.model('vehicle', vehicleSchema);