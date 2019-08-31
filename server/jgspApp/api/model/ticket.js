var mongoose = require('mongoose');


var ticketSchema = new mongoose.Schema({

    //email korisnika 
    name: {
        type: String,
        required: true
    },
    purchaseTime: {
        type: Date,
        required: true
    },
    
    ticketType: {
        type: String,
        required: true
    },
    pricelist:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pricelist'
    },
    payPal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'payPal'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    priceOfTicket:{
        type: Number
    }
}, {collection: 'ticket'});

mongoose.model('ticket', ticketSchema);