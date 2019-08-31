var mongoose = require('mongoose');
var User = mongoose.model('User');
var PT = mongoose.model('passengerType')
var nodemailer = require('nodemailer');


module.exports.getAwaitingAdmins = function(req,res){

    User.find().exec().then(u=>{
        var retValue = [];
        u.forEach(us=>{
            if(us.activated == "PENDING" && us.userType == "Admin"){
                retValue.push(us);
            }
        })
        res.send(retValue);
    })
}

module.exports.getAwaitingControllers = function(req,res){

    User.find().exec().then(u=>{
        var retValue = [];
        u.forEach(us=>{
            if(us.activated == "PENDING" && us.userType == "Controller"){
                retValue.push(us);
            }
        })
        res.send(retValue);
    })
}

module.exports.getAwaitingAppUsers = function(req,res){

    User.find().exec().then(u=>{
        var retValue = [];
        u.forEach(us=>{
            if(us.activated == "PENDING" && us.userType == "AppUser"){
                retValue.push(us);
            }
        })
        res.send(retValue);
    })
}

module.exports.autorizeAdmin = function(req,res){
    if(!req.body.id || req.body.id == ""){
        return res.status(400).json({ "message": "Don't exist user !"});
    }
    const nesto = {activated: "ACTIVATED"};
    User.findOneAndUpdate({_id: req.body.id}, nesto).then(data => {
        var mailOptions = {
            from: 'pusgs2018.19projekat@gmail.com',
            to: data.email,
            subject: 'Acceptance of the request - Admin',
            text: 'Dear ' +  data.name + " " + data.lastName + ",\nYou have been authorize as Admin !"
          };
        sendMail(mailOptions);
        res.status(200).json({"message": "Ok"});
    });

}

module.exports.authorizeController = function(req,res){
    if(!req.body.id || req.body.id == ""){
        return res.status(400).json({ "message": "Don't exist user !"});
    }
    const nesto = {activated: "ACTIVATED"};
    User.findOneAndUpdate({_id: req.body.id}, nesto).then(data => {
        var mailOptions = {
            from: 'pusgs2018.19projekat@gmail.com',
            to: data.email,
            subject: 'Acceptance of the request - Controller',
            text: 'Dear ' +  data.name + " " + data.lastName + ",\nYou have been authorize as controller !"
          };
        sendMail(mailOptions);
        res.status(200).json({"message": "Ok"});
    });
}

module.exports.authorizeAppUser = function(req,res){
    if(!req.body.id || req.body.id == ""){
        return res.status(400).json({ "message": "Don't exist user !"});
    }
    const nesto = {activated: "ACTIVATED"};
    User.findOneAndUpdate({_id: req.body.id}, nesto).then(data => {
        var mailOptions = {
            from: 'pusgs2018.19projekat@gmail.com',
            to: data.email,
            subject: 'Acceptance of the request',
            text: 'Dear ' +  data.name + " " + data.lastName + ",\nYou have been authorize as authorized user !"
          };
        sendMail(mailOptions);
        res.status(200).json({"message": "Ok"});
    });
}

module.exports.denyAdmin = function(req,res){
    if(!req.body.id || req.body.id == ""){
        res.status(400).json({"message": "Don't exist user !"});
    }
    const nesto = {activated: "DENIED"};
    User.findOneAndUpdate({_id: req.body.id}, nesto).then(data => {
        var mailOptions = {
            from: 'pusgs2018.19projekat@gmail.com',
            to: data.email,
            subject: 'Denied request - Admin',
            text: 'Dear ' +  data.name + " " + data.lastName + ",\nYour request as Admin has been denied !"
          };
        sendMail(mailOptions);
        res.status(200).json({"message": "Ok"});
    });
}

module.exports.denyController = function(req,res){
    if(!req.body.id || req.body.id == ""){
        res.status(400).json({"message": "Don't exist user !"});
    }
    const nesto = {activated: "DENIED"};
    User.findOneAndUpdate({_id: req.body.id}, nesto).then(data => {
        var mailOptions = {
            from: 'pusgs2018.19projekat@gmail.com',
            to: data.email,
            subject: 'Denied request - Controller',
            text: 'Dear ' +  data.name + " " + data.lastName + ",\nYour request as controller has been denied !"
          };
        sendMail(mailOptions);
        res.status(200).json({"message": "Ok"});
    });
}

module.exports.denyAppUser = function(req,res){
    if(!req.body.id || req.body.id == ""){
        res.status(400).json({"message": "Don't exist user !"});
    }
    const nesto = {activated: "DENIED"};
    User.findOneAndUpdate({_id: req.body.id}, nesto).then(data => {
        PT.findOne({_id: data.passengerType}).then(pt=>{
            if(pt){
                var mailOptions = {
                    from: 'pusgs2018.19projekat@gmail.com',
                    to: data.email,
                    subject: 'Denied request',
                    text: 'Dear ' +  data.name + " " + data.lastName + ",\nYour request as "+pt.name+" has been denied !"
                  };
                sendMail(mailOptions);
                res.status(200).json({"message": "Ok"});
            }
        })
    });
}


module.exports.getDeniedUsers = function(req,res){
    User.find().exec().then(u=>{
        var retValue = [];
        u.forEach(us=>{
            if(us.activated == "DENIED"){
                retValue.push(us);
            }
        })
        res.send(retValue);
    })
}

module.exports.authorizeDeniedUser = function(req,res){
    if(!req.body.id || req.body.id == ""){
        res.status(400).json({"message": "Don't exist user !"});
    }
    const nesto = {activated: "ACTIVATED"};
    User.findOneAndUpdate({_id: req.body.id}, nesto).then(data => {
        
        var mailOptions = {
            from: 'pusgs2018.19projekat@gmail.com',
            to: data.email,
            subject: 'acceptance of the request',
            text: 'Dear ' +  data.name + " " + data.lastName + ",\nYour request is still accepted!!"
            };
        sendMail(mailOptions);
        res.status(200).json({"message": "Ok"});
            
    });
}


function sendMail(mailOptions){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'pusgs2018.19projekat@gmail.com',
          pass: 'pusgs2019'
        }
    });
      
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } 
        else {
            console.log('Email sent: ' + info.response);
        }
    });
}
