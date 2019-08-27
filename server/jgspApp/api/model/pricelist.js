var mongoose = require('mongoose');


var pricelistSchema = new mongoose.Schema({

    fromTime: {
        type: Date,
        required: true
    },
    toTime: {
        type: Date,
        required: true
    },
    ticketPrices: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ticketPrices'
    },
}, {collection: 'pricelist'});

mongoose.model('pricelist', pricelistSchema);