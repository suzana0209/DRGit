var mongoose = require('mongoose');
var User = mongoose.model('User');

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
            if(us.activated == "PENDING" && (us.userType == "Student" || us.userType == "Pensioner")){
                retValue.push(us);
            }
        })
        res.send(retValue);
    })
}

module.exports.autorizeAdmin = function(req,res){
    if(!req.body.id){
        return res.status(400).json({ "message": "Don't exist user !"});
    }

    const nesto = {activated: "ACTIVATED"};
    User.findOneAndUpdate({_id: req.body.id}, nesto).then(bla => {
        //slanje mejla
        res.status(200).json({"message": "Ok"});
    });

}

module.exports.authorizeController = function(req,res)
{
    if(req.body.id == "")
    {
        res.status(400).json({"message": "Missing id"});
    }
    const nesto = {activated: "ACTIVATED"};
    User.findOneAndUpdate({_id: req.body.id}, nesto).then(bla => {
        //slanje mejla

        var mailOptions = {
            from: 'pusgs2019app@gmail.com',
            to: bla.email,
            subject: 'Controller approved',
            text: 'Dear ' +  bla.name + " " + bla.surname + ", \n you have been approved as controller."
          };
        sendMail(mailOptions);

        res.status(200).json({"message": "Ok"});
    });
}