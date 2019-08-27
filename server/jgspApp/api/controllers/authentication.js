var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var PT = mongoose.model('passengerType');

var sendJSONresponse = function(res, status, content)
{
    res.status(status);
    res.json(content);
}

module.exports.register = function(req, res)
{
    if(!req.body.name || !req.body.email || !req.body.password || !req.body.lastName
        || !req.body.city || !req.body.number || !req.body.street || !req.body.userType || !req.body.birthday) {
        // sendJSONresponse(res, 400, {
        //     "message": "All fields required"
        // });
        // return;
        return res.status(400).json({ "message": "You must complete all the fields!"})
    }

    var user = new User();

    user.name = req.body.name;
    user.email = req.body.email;
    user.lastName = req.body.lastName; 
    user.city = req.body.city;
    user.number = req.body.number;
    user.street = req.body.street;
    user.birthday = req.body.birthday;
    //user.image = req.body.image;
    user.activated = req.body.activated;
    user.userType = req.body.userType;
    if(user.userType == "AppUser"){

    PT.findOne({name: req.body.passengerType}).then(bla => {
        user.passengerType = bla.id;

        user.setPassword(req.body.password);

    user.save(function(err){
        if(!err)
        {
            User.find({}).populate('passengerType');
        }
        var token;
        token = user.generateJwt();
        res.status(200);
        res.json({
            "token" : token
        });
    });
    });

}else {
    user.setPassword(req.body.password);

    user.save(function(err){
        // if(!err)
        // {
        //     User.find({}).populate('passengerType');
        // }
        var token;
        token = user.generateJwt();
        res.status(200);
        res.json({
            "token" : token
        });
    });
}
};

module.exports.logIn = function(req, res){
    if(!req.body.email || !req.body.password) {
        sendJSONresponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }

    passport.authenticate('local', function(err, user, info){
        var token;
        if(err)
        {
            res.status(404).json(err);
            return;
        }

        if(user){
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token" : token
            });
        } else {
            res.status(401).json(info);
        }
    })(req,res);
};

module.exports.getUserData = function(req,res){

    if(!req.query.parami){
        return res.status(400).json({ "message": "Don't exist user !"});
    }
    
    User.find({email: req.query.parami}).exec().then(u=>{
        var retUser = null;
        if(u){
            retUser = u;
        }
        res.send(retUser)
        
    })
}

