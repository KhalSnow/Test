var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var login = require('./routes/login');
var supervision = require('./routes/supervision');
var program = require('./routes/program');
var result = require('./routes/result');
var logout = require('./routes/Logout');
//var message = require('./routes/message');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'yfax', resave:false, saveUninitialized:false, cookie: {maxAge:30*60000}}));

app.use(function(req, res, next){
	console.log(req.header);
	console.log(req.session.login);
	next();
})

/* app.use(function(req, res, next){
    if (req.session.login != 'true') {
		if (req.url.indexOf("/login") > -1) {
			next();
		}
	}
	if (loginApiList.includes(url)) {
		if (!req.session.username) {
    		res.json({
				code: 401,
				msg: '未登录'
			})
		}
	} else {
		next();
	}
}); */

app.use('/login', login);
app.use('/supervision', supervision);
app.use('/program', program);
app.use('/result', result);
app.use('/logout', logout);
//app.use('/msg', message);

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

module.exports = app;
