var mongoose = require('mongoose');


var lineSchema = new mongoose.Schema({

    regularNumber: {
        type: String,
        required: true
    },
    colorLine: {
        type: String,
        required: true
    },
    stations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'station'
    }],
}, {collection: 'line'});

mongoose.model('line', lineSchema);
