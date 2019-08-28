var mongoose = require('mongoose');
var Pricelist = mongoose.model('pricelist');
var TicketPrices = mongoose.model('ticketPrices');

module.exports.addPricelist = function(req,res){
    if(!req.body.Hourly || !req.body.Daily || !req.body.Monthly || !req.body.Yearly || !req.body.PriceList.FromTime 
        || !req.body.PriceList.ToTime){
        return res.status(400).json({ "message": "Don't exist user !"});
    }

   
    var ticketPrices = new TicketPrices();
    ticketPrices.hourly = req.body.Hourly;
    ticketPrices.monthly = req.body.Monthly;
    ticketPrices.daily = req.body.Daily;
    ticketPrices.yearly = req.body.Yearly;

    ticketPrices.save(function(err){
        if(err){
            return res.status(404).json({ "message": err})
        }

        var pricelist = new Pricelist();
        pricelist.fromTime = new Date(req.body.PriceList.FromTime);
        pricelist.toTime = new Date(req.body.PriceList.ToTime);
    
        pricelist.ticketPrices = ticketPrices._id;
        pricelist.save();

        res.status(200).json({"message" : "Pricelist successfully add!"})

    })
};

// module.exports.getPricelist = function(req,res){
//     Pricelist.find().exec().then(pl=>{
//         var idTicketPrices = [];
//         var idTP;
//         var pList = pl.reverse();
//         let today = new Date();
//         pList.forEach(elem=>{
//             if(today >= elem.fromTime && today <= elem.toTime){
//                 //idTicketPrices.push(elem);
//                 idTP.fromTime = elem.fromTime;
//                 TicketPrices.find({_id: elem.ticketPrices}).exec().then(aa=>{
//                     idTicketPrices.hourly = aa.hourly;

//                 })
//             }
//         })
//         res.send(idTicketPrices);
//     })
// }

module.exports.getPricelist = function(req,res){
    Pricelist.find().exec().then(pp=>{
        var lala = pp.reverse();

        var ret = lala.find(checkAdult);

        TicketPrices.find().exec().then(pr=>{
            pr.forEach(element=>{
                if(element.id == ret.ticketPrices._id){
                   ret.ticketPrices = element.id; 
                }
            })
            res.send(ret);
        })
    })
}

function checkAdult(age) {
    var today = new Date();
    if(age.fromTime.getFullYear() <= today.getFullYear() && age.fromTime.getMonth() <= today.getMonth() && age.fromTime.getDate() <= today.getDate())
    {
        if(age.toTime.getFullYear() >= today.getFullYear() &&  age.toTime.getMonth() >= today.getMonth() && age.toTime.getDate() >= today.getDate())
        {
            return age;
        }
    }
}

module.exports.getTicketPrices = function(req,res){
    TicketPrices.find({_id: req.query.parami}).exec().then(tp=>{
        var retTp = null;
        if(tp){
            retTp = tp;
        }
        res.send(retTp);
    })
}