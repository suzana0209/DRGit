var mongoose = require('mongoose');


var stationSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },
    addressStation: {
        type: String,
        required: true
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    lines: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'line'
    }],
}, {collection: 'station'});

mongoose.model('station', stationSchema);