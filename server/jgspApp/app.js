var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//dodato: Require Passport
var passport = require('passport');


// dodato: Bring in the data model
require('./api/model/db');
// dodato:  Bring in the Passport config after model is defined
require('./api/config/passport');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

//dodato:  Bring in the routes for the API (delete the default routes)
var routesApi = require('./api/routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//dodato:  Initialise Passport before using the route middleware
app.use(passport.initialize());

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

//dodato: Use the API routes when path starts with /api
app.use('/api', routesApi);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//dodato: Catch unauthorised errors
app.use(function(err, req, res, next){
  if(err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
