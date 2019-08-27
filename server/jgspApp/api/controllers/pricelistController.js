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
}