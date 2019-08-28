var mongoose = require('mongoose');
var timetableSchema = new mongoose.Schema({

    departures: {
        type: String,
        required: true
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vehicle'
    },
    
    line: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'line'
    },
    dayType:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dayType'
    }
    
}, {collection: 'timetable'});

mongoose.model('timetable', timetableSchema);