var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    activated: {
        type: String,
        required: false
    },
    userType: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    image: {
        //type: Buffer,
        data:Buffer,
        contentType: String,
        required: false
    },
    passengerType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'passengerType',
        required: false
    },
    hash:String,
    salt: String
});

userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex'); //?
    this.hash = crypto.pbkdf2Sync(password,this.salt,1000,64,'sha512').toString('hex');

}

userSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password,this.salt,1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
}

userSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        lastName: this.lastName,
        city: this.city,
        number: this.number,
        street: this.street,
        userType: this.userType,
        exp: parseInt(expiry.getTime() / 1000),
    }, "MY_SECRET");
};

mongoose.model('User', userSchema);