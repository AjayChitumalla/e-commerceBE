var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var jwtRouter = require('./jwt');
var cors = require('cors');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var RegUser = require('./models/user');
var Token = require('./models/token');
var RegUser = require('./models/user');
app.use(cors());

var dbOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  auto_reconnect: true
};
mongoose.connect("mongodb+srv://beingzero:beingzero@cluster0-i1mul.mongodb.net/ecommerce?retryWrites=true&w=majority", dbOptions);
mongoose.connection.on('connected', function () {
  console.log("Connected to DB");
});
mongoose.connection.on('error', function (err) {
  console.log("Error while connecting to DB: " + err);
});

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session(
  { secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie:{
    secure:false
  }
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(RegUser.authenticate()));

RegUser.remove({},()=>{
  console.log("users del");
})
Token.remove({},()=>{
  console.log("tokens del");
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/confirmation',jwtRouter);
app.use('/products',productsRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
