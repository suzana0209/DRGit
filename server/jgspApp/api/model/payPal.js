var mongoose = require('mongoose');


var payPalSchema = new mongoose.Schema({

    payementId: {
        type: String,
        required: true
    },
    createTime: {
        type: Date,
        required: true
    },
    payerEmail: {
        type: String,
        required: true
    },
    payerName: {
        type: String,
        required: true
    },
    payerSurname: {
        type: String,
        required: true
    },
    currencyCode: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    status:{
        type: String,
        required: true
    }
    
}, {collection: 'payPal'});

mongoose.model('payPal', payPalSchema);