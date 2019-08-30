var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.profileRead = function(req, res)
{
    if(!req.payload._id){
        res.status(401).json({
            "message" : "UnauthorizedError : private profile"
        });
    } else {
        User.findById(req.payload._id).exec(function(err,user) {
            res.status(200).json(user);
        });
    }
};

// module.exports.getUserData = function(req,res){
//     User.findById(req.payload.email).exec(function(err,user){
//         res.status(200).json(user);
//     })
// }

module.exports.resendRequest = function(req,res){
    if(req.body.email == ""){
        res.status(400).json({"message":"Missing id!!"});
    }

    const nesto = {activated: "PENDING"};
    User.findOneAndUpdate({email: req.body.email}, nesto).then(data=>{
        res.status(200).json({"message": "OK"})
    })
}

