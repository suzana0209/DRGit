var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var PT = mongoose.model('passengerType');

var sendJSONresponse = function(res, status, content)
{
    res.status(status);
    res.json(content);
}

module.exports.editPassword = function(req,res){
    if(!req.body.id || !req.body.oldPassword || !req.body.newPassword || !req.body.confirmPassword){
        return res.status(400).json({ "message": "All fields must be filled in!"});
    }

    if(req.body.newPassword != req.body.confirmPassword){
        return res.status(400).json({"message":"Passwords don't match!"})
    }
    else{
        User.findById(req.body.id).then(dd=>{
            if(dd.validPassword(req.body.oldPassword)){
                dd.setPassword(req.body.oldPassword);

                const nesto = {hash: dd.hash, salt: dd.salt};
                User.findOneAndUpdate({_id: req.body.id}, nesto).then(bb=>{
                    return res.status(200).json({"message":"Password successfully changed!"})
                })
            }
            else{
                return res.status(400).json({"message": "Old password is not correct!"});
            }
        })
    }
}

module.exports.edit = function(req,res){
    if(!req.body.Name || !req.body.Email || !req.body.LastName || !req.body.Street || !req.body.Number || !req.body.City ||
        !req.body.Birthaday ){
            return res.status(400).json({ "message": "All fields must be filled in!"});
        }
    
        if(req.files != null){
            var imgg = {data: req.files.file.data, contentType: "image/png"};
            // const nest = {email: req.body.Email, name: req.body.Name, lastName: req.body.LastName, birthday: new Date(req.body.Birthday), 
            //     street: req.body.Street, number: req.body.Number, city: req.body.City, image: imgg, activated: "PENDING"};
            const nest = {image: imgg, activated: "PENDING"};


            User.findOneAndUpdate({_id: req.body.Id}, nest).then(cc=>{
                return res.status(200).json({"message": "Profile successfully changed!"})
            })
        }
        else{
            const nest1= {email: req.body.Email, name: req.body.Name, lastName: req.body.LastName, birthday: new Date(req.body.Birthaday), 
                street: req.body.Street, number: req.body.Number, city: req.body.City};

            User.findOneAndUpdate({_id: req.body.Id}, nest1).then(cc1=>{
                return res.status(200).json({"message": "Profile successfully changed!"})
            })
        }
}

module.exports.register = function(req, res)
{
    if(!req.body.name || !req.body.email || !req.body.password || !req.body.surname
        || !req.body.city || !req.body.number || !req.body.street || !req.body.userType || !req.body.birthday) {
        return res.status(400).json({ "message": "You must complete all the fields!"})
    }

    var user = new User();

    user.name = req.body.name;
    user.email = req.body.email;
    user.lastName = req.body.surname; 
    user.city = req.body.city;
    user.number = req.body.number;
    user.street = req.body.street;
    user.birthday = req.body.birthday;
   

    if(req.files != null){
        user.image.data = req.files.file.data;
        user.image.contentType = "image/png";
    }

    user.activated = req.body.activated;
    user.userType = req.body.userType;

    if(user.userType == "AppUser"){

    PT.findOne({name: req.body.passengerType}).then(bla => {
        user.passengerType = bla.id;

        user.setPassword(req.body.password);

        user.save(function(err){
            if(!err){
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

    }
    else {
        user.setPassword(req.body.password);

        user.save(function(err){
            if(!err){
                User.find({}).populate('passengerType');
            }
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
        return res.status(400).json({ "message": "You must complete all the fields!"})
    }

    passport.authenticate('local', function(err, user, info){
        var token;
        if(err){
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
        res.send(retUser); 
    })
}
