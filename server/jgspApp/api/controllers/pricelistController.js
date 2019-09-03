var mongoose = require('mongoose');
var Pricelist = mongoose.model('pricelist');
var TicketPrices = mongoose.model('ticketPrices');
var PassengerType = mongoose.model('passengerType');

module.exports.addPricelist = function(req,res){
    if(!req.body.Hourly || !req.body.Daily || !req.body.Monthly || !req.body.Yearly || !req.body.PriceList.FromTime 
        || !req.body.PriceList.ToTime){
        return res.status(400).json({ "message": "You must complete all the fields!"});
    }

    if(req.body.Hourly == 0 || req.body.Daily == 0 || req.body.Monthly == 0 || req.body.Yearly == 0){
        return res.status(400).json({ "message": "Ticket price can't be zero!"});
    }

    if(req.body.Hourly < 0 || req.body.Daily < 0 || req.body.Monthly < 0 || req.body.Yearly < 0){
        return res.status(400).json({ "message": "Ticket price can't be less than zero!"});
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



/*
fd.append('PassengerType', this.selectedPassanger);
    fd.append('SelectedTicket', this.selectedTicket);
    fd.append('IdOfPriceList', this.pomPricelist._id);
*/
module.exports.calculatePrice = function(req,res){
    if(!req.body.PassengerType || !req.body.SelectedTicket || !req.body.IdOfPriceList){
        return res.status(400).json({"message": "You must complete all the fields!"})
    }

    Pricelist.findOne({_id: req.body.IdOfPriceList}).then(pl=>{
        if(!pl){
            return res.status(400).json({"message": "Not found pricelist!"})
        }
        else{
            TicketPrices.findOne({_id: pl.ticketPrices}).then(tk=>{
                if(tk){
                    PassengerType.find({name: req.body.PassengerType}).then(pt=>{
                        if(pt){
                            //var kon;
                            //var onlyPrice = 0;
                            pt.forEach(ptt=>{
                                let coeff = ptt.coefficient;
                                let onlyPrice;
                                
                                if(req.body.SelectedTicket == 'Hourly'){
                                    onlyPrice = tk.hourly;
                                }
                                else if(req.body.SelectedTicket == 'Daily'){
                                    onlyPrice = tk.daily;
                                }
                                else if(req.body.SelectedTicket == 'Monthly'){
                                    onlyPrice = tk.monthly;
                                }
                                else if(req.body.SelectedTicket == 'Yearly'){
                                    onlyPrice = tk.yearly;
                                }
                                let kon = onlyPrice - (onlyPrice * coeff);
                                res.send(kon.toString());
                            })
                            //res.send(kon);
                        }
                        
                    })
                }
            })
        }
    })
}


module.exports.getPricelist = function(req, res){
     Pricelist.find().exec().then(pric => {
        var lala = pric.reverse();

        var ret = lala.find(checkAdult);
        if(ret != null && ret != undefined)
        {
            TicketPrices.find().exec().then(pr => {
                pr.forEach(element => {
                    if(element._id == ret.ticketPrices._id)
                    {
                        ret.ticketPrices.push(element._id);
                    }
                });
                   
                res.send(ret);
             });
        }
        else{
            return res.status(404).json({"message": "Pricelist not found"});
        }
    });
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

module.exports.getTicketPrices = function(req,res){
    TicketPrices.find({_id: req.query.parami}).exec().then(tp=>{
        var retTp = null;
        if(tp){
            retTp = tp;
        }
        res.send(retTp);
    })
}