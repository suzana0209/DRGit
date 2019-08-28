var mongoose = require('mongoose');
require('./passengerType');
require('./ticketType');
require('./dayType');

var PT = mongoose.model('passengerType');
var TT = mongoose.model('ticketType');
var DT = mongoose.model('dayType');

var gracefulShutdown;
var dbURI = 'mongodb://localhost/JGSP_DB1';

if(process.env.NODE_ENV === 'production'){
    dbURI = process.env.MONGOLAB_URI;
}

mongoose.connect(dbURI);

mongoose.connection.on('connected', function() {

    // var pt = new PT();
    // pt.name="Student";
    // pt.coefficient = 0.4;
    
    // var pt1 = new PT();
    // pt1.name="Pensioner";
    // pt1.coefficient = 0.3;
    
    // var pt2 = new PT();
    // pt2.name = "Regular";
    // pt2.coefficient = 0;
    // pt.save();
    // pt1.save();
    // pt2.save();

    // var dt = new DT();
    // dt.name="Workday";
    
    // var dt1 = new DT();
    // dt1.name="Saturday";
    
    // var dt2 = new DT();
    // dt2.name = "Sunday";
    // dt.save();
    // dt1.save();
    // dt2.save();

    // var tt = new TT();
    // tt.name="Hourly";
    
    // var tt1 = new TT();
    // tt1.name="Daily";
    
    // var tt2 = new TT();
    // tt2.name = "Monthly";

    // var tt3 = new TT();
    // tt3.name = "Yearly";
    // tt.save();
    // tt1.save();
    // tt2.save();
    // tt3.save();

    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});

gracefulShutdown = function(msg, callback){
    mongoose.connection.close(function() {
        console.log('Mongoose diconnected thorugh ' + msg);
        callback();
    });
};

process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});

process.on('SIGINT', function() {
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});

process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app termination',function() {
        process.exit(0);
    });
});

require('./user');
//require('./passengerType');
require('./station');
require('./line');
//require('./dayType');
//require('./ticketType')
require('./pricelist')
require('./ticketPrices')
require('./vehicle')
require('./timetable');