var mongoose = require('mongoose');


var ticketPricesSchema = new mongoose.Schema({

    hourly: {
        type: Number,
        required: true
    },
    daily: {
        type:Number,
        required: true
    },
    monthly: {
        type:Number,
        required: true
    },
    yearly: {
        type:Number,
        required: true
    },
    //ovo polje se nece popunjavati
    pricelist:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pricelist'
    }
}, {collection: 'ticketPrices'});

mongoose.model('ticketPrices', ticketPricesSchema);