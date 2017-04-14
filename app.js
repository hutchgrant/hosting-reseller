var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var DigitalOcean = require('do-wrapper');

var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator'); 

var helpers = require('./lib/helpers');

var auth = require('./lib/auth');
var index = require('./routes/index');
var users = require('./routes/users');
var dash = require('./routes/dashboard');
var host = require('./routes/hosting');
var admin = require('./routes/admin');
var app = express();

mongoose.connect('localhost:27017/hosting-reseller')
require('./config/passport');


// view engine setup
// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs',
    helpers: {
        compare: helpers.compare(),
        config: helpers.config()
    }
}));
app.set('view engine', '.hbs');

app.use( express.static( __dirname + '/bower_components' ) );

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(require('express-session')({ 
	secret: 'keyboard cat', 
	resave: true, 
	saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
 	res.locals.login = req.isAuthenticated();
  res.locals.admin = auth.isAdminBool(req, res, next);
 	res.locals.session = req.session;
 	next();
});

app.use('/admin', admin);
app.use('/dashboard', dash);
app.use('/hosting', host);
app.use('/user', users);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

app.setConfig = function(config){
  helpers.init(config);
  host.init(config);
}

module.exports = app;
