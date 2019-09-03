var mongoose = require('mongoose');
var Ticket = mongoose.model('ticket');
var User = mongoose.model('User');
var PT = mongoose.model('passengerType')
var Pricelist = mongoose.model('pricelist')
var TicketPrices = mongoose.model('ticketPrices')
var PayPal = mongoose.model('payPal')
var nodemailer = require('nodemailer');

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
                //par1 : NEREGISTROVANI
                if(aa && req.query.par1 == ""){
                    
                    aa.forEach(elem=>{
                        PT.findById(elem.passengerType).exec().then(pt=>{
                            proc = pt.coefficient;
                            var ret1 = onlyPrice - (onlyPrice * proc);
                            res.send(ret1.toString());
                        })
                        //return ret;
                    })
                
                }
                else{
                    res.send(onlyPrice.toString());
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
        let pomDate =  new Date(req.body.dateOfPurchase.toString());
        //pomDate.setHours(pomDate.getHours() + 2); u bazu se upise -2 sata, ali kad se iscita dobije se tacno vrijeme(dodaju se dva sata) - ovo za sada ne treba
        ticket.purchaseTime = pomDate;

        //ticket.purchaseTime.setHours(getHours() + 2);
        //ddd.setHours(dd.getHours() -1);
        ticket.priceOfTicket = parseFloat(req.body.value);

        User.findOne({email: req.body.email}).then(uss=>{
            if(uss && req.body.nereg == ""){
                ticket.user = uss._id;
                // ticket.ticketType = req.body.typeOfTicket;
                // ticket.purchaseTime = new Date(req.body.dateOfPurchase.toString());
                // ticket.priceOfTicket = parseFloat(req.body.value);
            }
            else{
                //SLANJE MEJLA
                ticket.user = null;
                let dateee = pomDate.toString('GMT')[0];
                var mailOptions = {
                    from: 'pusgs2018.19projekat@gmail.com',
                    to: req.body.email,
                    subject: 'Ticket purchase',
                            text: 'Dear ' +  req.body.email + ",\nYour purchase is successfull.\n" + "Ticket type : Hourly \n" + 
                                "Time of purchase: " + dateee + "\nTicket is valid for the next hour.\n\n" + "Thank you."
                    };
                sendMail(mailOptions);
            }
                Pricelist.findOne({_id: req.body.pricelistId}).then(pl=>{
                    ticket.pricelist = pl._id;

                    ticket.save();
                    return res.status(200).json({"message": "Ticket successfully bought!"})
                })           
        })
    });
}

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

module.exports.validateTicket = function(req, res){

    if(req.params.idTicket == undefined || req.params.idTicket == ""){
        return res.status(400).json({"message": "You have to fill email address!"});
    }

    Ticket.findOne({_id: req.params.idTicket}).then(tck=>{
        if(!tck){
            let msg = "Ticket with id= " +req.params.idTicket+ " doesn't exist !";
            return res.status(400).json({"message": msg});
        }
        else{
            var dateOfTicket = new Date(tck.purchaseTime);
            var today = new Date();

            if(tck.ticketType == "Hourly"){
                let addOneHour = dateOfTicket.setHours(dateOfTicket.getHours() + 1);
                if(today > addOneHour){
                    let s = "Ticket with id '" + req.params.idTicket + "' is not valid. Time is up!"
                        return res.status(400).json({"message": s});
                }
                else{
                    let s = "Ticket with id '" + req.params.idTicket + "' is valid!"
                    return res.status(200).json({"message": s});
                }
            }
            else if(tck.ticketType == "Daily"){
                let addOneDay = dateOfTicket.setDate(dateOfTicket.getDate() + 1);
                dateOfTicket.setHours(0,0,0,0);
                if(today > addOneDay){
                    let s = "Ticket with id '" + req.params.idTicket + "' is not valid. Time is up!"
                        return res.status(400).json({"message": s});
                }
                else{
                    let s = "Ticket with id '" + req.params.idTicket + "' is valid!"
                    return res.status(200).json({"message": s});
                }
            }
            else if(tck.ticketType == "Monthly"){
                //let addOneMonth = dateOfTicket.setMonth(dateOfTicket.getMonth() + 1);
                //dateOfTicket1.setDate(1);
                //dateOfTicket1.setHours(0,0,0,0);

                if(today.getFullYear() == dateOfTicket.getFullYear() && today.getMonth() == dateOfTicket.getMonth()){
                    let s = "Ticket with id '" + req.params.idTicket + "' is valid!"
                    return res.status(200).json({"message": s});
                    
                }
                else{
                    let s = "Ticket with id '" + req.params.idTicket + "' is not valid. Time is up!"
                        return res.status(400).json({"message": s});
                }
            }
            else if(tck.ticketType == "Yearly"){
                if(today.getFullYear() == dateOfTicket.getFullYear()){
                    let s = "Ticket with id '" + req.params.idTicket + "' is valid!"
                    return res.status(200).json({"message": s});
                }
                else{
                    let s = "Ticket with id '" + req.params.idTicket + "' is not valid. Time is up!"
                        return res.status(400).json({"message": s});
                }
            }
            
        }
    })
}

module.exports.getNameOfCustomer = function(req,res){
    if(!req.body.idTickett){
        return res.status(400).json({"message": "Required ticket ID!"});
    }
    var ret = "";
    Ticket.findOne({_id: req.body.idTickett}).then(tt=>{
        if(!tt){
            return res.status(400).json({"message": "Ticket doesn't exist!"});
        }
        else{
            if(tt.user == null){
                ret = "unregister";
                return res.status(200).json({"message":ret});
                //return res.send(ret.toString());
            }
            else{
                User.findOne({_id: tt.user}).then(u=>{
                    if(u){
                        ret = u.name;
                        return res.status(200).json({"message":ret});
                        //return res.send(ret.toString());
                    }
                })
            }
        }
    })
}

function checkAdult(age) {
    var today = new Date();
    if(age.fromTime.getFullYear() <= today.getFullYear() && age.fromTime.getMonth() <= today.getMonth() && age.fromTime.getDate() <= today.getDate())
    {
        if(age.toTime.getFullYear() >= today.getFullYear()) 
        {
            if( age.toTime.getMonth()> today.getMonth()){
                return age;
            }
            else if(age.toTime.getMonth() == today.getMonth())
            {
                if( age.toTime.getDate() >= today.getDate()){
                    return age;
                }
            }
            
        }
    }
}


// function checkAdult(age) {
//     var today = new Date();
//     if(age.fromTime.getFullYear() <= today.getFullYear() && age.fromTime.getMonth() <= today.getMonth() && age.fromTime.getDate() <= today.getDate())
//     {
//         if(age.toTime.getFullYear() >= today.getFullYear() &&  age.toTime.getMonth() >= today.getMonth() && age.toTime.getDate() >= today.getDate())
//         {
//             return age;
//         }
//     }
// }

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

module.exports.getAllTicket = function(req,res){
    Ticket.find().exec().then(tt=>{
        if(tt){
            res.send(tt);
        }
    })
}