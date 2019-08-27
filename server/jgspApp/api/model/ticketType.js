var mongoose = require('mongoose');

var ticketTypeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },
    
    
}, {collection: 'ticketType'});

mongoose.model('ticketType', ticketTypeSchema);