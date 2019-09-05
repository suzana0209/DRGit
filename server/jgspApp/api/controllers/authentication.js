var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var PT = mongoose.model('passengerType');

var sendJSONresponse = function(res, status, content){
    res.status(status);
    res.json(content);
}

module.exports.editPassword = function(req,res){
    if(!req.body.id || !req.body.oldPassword || !req.body.newPassword || !req.body.confirmPassword){
        return res.status(400).json({ "message": "You must complete all the fields!"})
    }

    if(req.body.newPassword != req.body.confirmPassword){
        return res.status(400).json({"message":"Passwords don't match!"})
    }
    else{
        User.findById(req.body.id).then(dd=>{
            if(dd.validPassword(req.body.oldPassword)){
                dd.setPassword(req.body.newPassword);

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
        !req.body.Birthaday){
            return res.status(400).json({ "message": "You must complete all the fields!"});
    }

    User.findOne({email: req.body.Email}).then(uu=>{
        if(uu && uu.email != req.body.OldEmail){
            return res.status(400).json({"message": "There is already a user with the email address: "+req.body.Email+". Please enter a different address!"})
        }
        else{
            if(req.files != null){
                var imgg = {data: req.files.file.data, contentType: "image/png"};
                // const nest = {email: req.body.Email, name: req.body.Name, lastName: req.body.LastName, birthday: new Date(req.body.Birthday), 
                //     street: req.body.Street, number: req.body.Number, city: req.body.City, image: imgg, activated: "PENDING"};
                const nest = {image: imgg, activated: "PENDING"};
        
                User.findOneAndUpdate({_id: req.body.Id}, nest).then(cc=>{
                    return res.status(200).json({"message": "Document successfully changed!"})
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
    })
}

module.exports.register = function(req, res){
    if(!req.body.name || !req.body.email || !req.body.password || !req.body.surname
        || !req.body.city || !req.body.number || !req.body.street || !req.body.userType || !req.body.birthday || 
        !req.body.confirmPassword) {
        return res.status(400).json({ "message": "You must complete all the fields!"})
    }

    if(req.body.userType == 'AppUser' && req.body.passengerType == ""){
        return res.status(400).json({ "message": "You must complete all the fields!"})
    }

    if(req.body.password != req.body.confirmPassword){
        return res.status(400).json({"message":"Passwords don't match!"})
    }

    if(req.body.password.length > 0 && req.body.confirmPassword.length > 0){
        let b = false;
        for(x=0;x<req.body.password.length;x++){
            if(req.body.password.charAt(x) >= 'A' && req.body.password.charAt(x) <= 'Z')
                b =  true;
        }

        if(!b){
            return res.status(400).json({"message": "password must contain at least one uppercase letter"});
        }
        
        
        

        
    }

    if(new Date(req.body.birthday.toString()) >= new Date()){
        return res.status(400).json({"message":"The data is wrong!"})
    }

    // var passw= /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/;
    // if(!passw.test(req.body.password)) { 
    //     //alert('Correct, try another...')
    //     return res.status(400).json({"message":"at least one number, one lowercase and one uppercase letter at least six characters that are letters, numbers or the underscore!" })
    // }
    
    User.findOne({email: req.body.email}).then(uu=>{
        if(uu){
            return res.status(400).json({"message":"There is already a user with the email address: "+req.body.email+". Please enter a different address!"})
        }
    })


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

    PT.findOne({name: req.body.passengerType}).then(dataa => {
        user.passengerType = dataa._id;

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

// function hasUpperLetter(str){
//     for(x=0;x<str.length;x++)
//         if(str.charAt(x) >= 'A' && str.charAt(x) <= 'Z')
//             return true;
//     return false;
// }

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
        return res.status(400).json({ "message": "Don't exist user with the email: "+req.query.parami+" !"});
    }
    User.find({email: req.query.parami}).exec().then(u=>{
        var retUser = null;
        if(u){
            retUser = u;
        } 
        res.send(retUser); 
    })
}
