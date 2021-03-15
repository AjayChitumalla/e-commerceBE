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
var bodyParser = require('body-parser');
var RegUser = require('./models/user');
var config = require('./config');
var jwt = require('jsonwebtoken');
app.use(cors());

var dbOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  auto_reconnect: true
};
mongoose.connect(config.mongoUrl, dbOptions);
mongoose.connection.on('connected', function () {
  console.log("Connected to DB");
});
mongoose.connection.on('error', function (err) {
  console.log("Error while connecting to DB: " + err);
});
// RegUser.remove(()=>{
//   console.log('removed');
// });
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(RegUser.authenticate()));

// RegUser.remove({},()=>{
//   console.log("users del");
// })
// Token.remove({},()=>{
//   console.log("tokens del");
// })
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/confirmation',jwtRouter);
app.use('/products',productsRouter);

function verifytoken(req,res,next){
  if(!req.headers.authorization){
    return res.status(401).send("Unauthorized!");
  }
  let token=req.headers.authorization.split(' ')[1];
  if(token === 'null'){
    return res.status(401).send("Unauthorized!");
  }
  let payload=jwt.verify(token,config.secret);
  if(!payload){
    return res.status(401).send("Unauthorized!");
  }
  next();
}

app.post('/test',verifytoken,(req,res)=>{
  res.send({msg:"ok"});
})
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
