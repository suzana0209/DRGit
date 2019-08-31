var mongoose = require('mongoose');
var Ticket = mongoose.model('ticket');
var User = mongoose.model('User');
var PT = mongoose.model('passengerType')
var Pricelist = mongoose.model('pricelist')
var TicketPrices = mongoose.model('ticketPrices')
var PayPal = mongoose.model('payPal')

//priceForPaypal: typeOfTicket,email,data
//req.query.par && req.query.parami
module.exports.priceForPaypal = function(req,res){
    if(!req.query.par || !req.query.parami){
        return res.status(400).json({ "message": "All fields must be filled in!!"});
    }


    Pricelist.find().exec().then(pp=>{
        
        var lala = pp.reverse();

        var ret = lala.find(checkAdult);
        var onlyPrice;
        var kk = 0;

        TicketPrices.find().exec().then(pr=>{
            pr.forEach(element=>{
                if(element.id == ret.ticketPrices._id){
                   ret.ticketPrices = element.id; 
                   if(req.query.parami == "Hourly"){
                       onlyPrice = element.hourly;
                   }
                   else if(req.query.parami == "Daily"){
                       onlyPrice = element.daily;
                   }
                   else if(req.query.parami == "Monthly"){
                    onlyPrice = element.monthly;
                   }
                   else if(req.query.parami == "Yearly"){
                    onlyPrice = element.yearly;
                   }
                }
                // kk = calculate(onlyPrice, req.query.par);
                
                // res.send(kk);
            })
            //let kkk = 0;
            //var kkk = "";
            //kkk = calculate(onlyPrice, req.query.par);

            var proc = 0;
           
            User.find({email: req.query.par}).exec().then(aa=>{
                
                if(aa){
                    
                    aa.forEach(elem=>{
                        PT.findById(elem.passengerType).exec().then(pt=>{
                            proc = pt.coefficient;
                            var ret1 = onlyPrice - (onlyPrice * proc);
                            res.send(ret1.toString());
                        })
                        //return ret;
                    })
                
                }
         
            })

            //let mm = kk.toString();
           // var mm = kkk.toString();
                // res.send(kkk);
        })
    })
}

module.exports.postPayPalModel = function(req,res){
    if(!req.body.payerEmail || !req.body.payerName || !req.body.payerSurname ||
        !req.body.status || !req.body.createTime || 
        !req.body.paymentId || !req.body.value || !req.body.currencyCode){
        return res.status(400).json({ "message": "All fields must be field in !"});
    }

    var payPal = new PayPal();
    payPal.payerEmail = req.body.payerEmail;
    payPal.payerName  = req.body.payerName;
    payPal.payerSurname  = req.body.payerSurname;
    payPal.status  = req.body.status;
    payPal.createTime  = req.body.createTime;
    payPal.payementId  = req.body.paymentId;
    payPal.value  = req.body.value;
    payPal.currencyCode  = req.body.currencyCode;

    payPal.save(function(err){
        if(err){
            res.status(404).json(err);
            return;
        }

        var ticket = new Ticket();
        ticket.payPal = payPal._id;
        ticket.name = "karta";
        ticket.ticketType = req.body.typeOfTicket;
        ticket.purchaseTime = new Date(req.body.dateOfPurchase.toString());
        ticket.priceOfTicket = parseFloat(req.body.value);

        User.findOne({email: req.body.email}).then(uss=>{
            if(uss){
                ticket.user = uss._id;
                // ticket.ticketType = req.body.typeOfTicket;
                // ticket.purchaseTime = new Date(req.body.dateOfPurchase.toString());
                // ticket.priceOfTicket = parseFloat(req.body.value);
            }
            else{
                ticket.user = null;
            }
                Pricelist.findOne({_id: req.body.pricelistId}).then(pl=>{
                    ticket.pricelist = pl._id;

                    ticket.save();
                    res.status(200).json({"message": "OKK"})
                })
            
        })

        // if(req.body.user != null && req.body.user != "" && req.body.user != null){
        //     ticket.user = req.body.user;
        // }

        // ticket.name = "karta";
        // ticket.ticketType = req.body.TypeOfTicket;
        
        // Pricelist.findOne({_id: req.body.pricelist}).then(ab=>{
        //     ticket.pricelist = ab._id;

        //     ticket.purchaseTime.setHours(ticket.purchaseTime.getHours() - 2);
        //     var dd = ticket.purchaseTime.toString();
        //     var ddd = dd.split('GMT');

        //     ticket.save();

        // })

    });

    //function(err){
    //     if(err){
    //         return res.status(404);
    //     }
    //     //upisi kartu
        //res.status(200).json({"message": "Paypal data succesfull inserted in db!"})
    //})
    

}

// module.exports.getTicketWithCurrentAppUser = function(req,res){
//     if(req.body.idd){
//         var ret = [];
//         User.findOne({_id: req.body.idd}).then(aa=>{
//             if(aa){
//                 ret.push(aa.name);
//             }
//             res.send(ret);
//         })
//     }
// }

module.exports.getTicketWithCurrentAppUser = function(req,res){
    if(req.body.idd){
        var ret = [];
        Ticket.find({user: req.body.idd}).then(aa=>{
            if(aa){
                aa.forEach(bb=>{
                    ret.push(bb);
                })
                res.send(ret);
            }
            
        })
    }
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