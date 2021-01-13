var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var RegUser = require('../models/user');
var Token = require('../models/token');
var passport = require('passport');
var crypto = require('crypto');
var config = require('../config');
var jwt = require('jsonwebtoken');

passport.serializeUser(RegUser.serializeUser());
passport.deserializeUser(RegUser.deserializeUser());

router.get('/',(req,res)=>{
  RegUser.find({},(err,docs)=>{
    if(err){
      console.log(err);
      res.send({err:err});
    }
    else
      res.send(docs);
  })
})

router.post('/login', function(req, res,next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
        return err;
    }
    if (!user) {
        return res.status(401).json({
            err: info
        });
    }
    if (!user.isverified) return res.status(403).send({ type: 'not-verified', msg: 'Your account has not been verified.' }); 
    req.logIn(user, function(err) {
        if (err) {
            return res.status(500).json({
                err: 'Could not log in user'
            });
        }
        let payload={subject:user._id}
        let token=jwt.sign(payload,config.secret);
        res.status(200).send({msg:"Successfully Logged In!!!",token:token});
    });
  })(req, res,next)
});

router.post('/signup',(req, res)=> {
  if(req.user){
    return res.status(403).send({msg:"A session is already running on this device,please logout to continue!!"})
  }
  var mailid="",tokenid="";
  RegUser.findOne({ username: req.body.username }, function (err, user) {
 
    // Make sure user doesn't already exist
    if (user) return res.status(400).send({ msg: 'The email address you have entered is already associated with another account.' });
    // Create and save the user
    user = new RegUser({ username:req.body.username,firstname: req.body.firstname,lastname:req.body.lastname});
    RegUser.register(user, req.body.password, function(err, user){
      if (err) { 
        return res.status(500).send({ msg: err.message }); 
      }
    });
    mailid=user.username;
    newtoken = new Token({ 
      username:user.username,
      _userId: user._id, 
      token: crypto.randomBytes(16).toString('hex') 
    });
    newtoken.save(function (err,token) {
      if (err) { 
      console.log(err);
      return res.status(500).send({ msg: err.message }); 
      }  
      tokenid=token.token;  
      let transporter = nodemailer.createTransport({
        service:"gmail",
        host: "smtp.gmail.com",
        auth: {
        user: config.user,
        pass: config.pass,
        },
        });
        var mailOptions = {  to:mailid, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + tokenid + '.\n' };
        transporter.sendMail(mailOptions, function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            res.send({msg:'A verification email has been sent to ' + user.username + '.'});
        });
  });
});
});

router.post('/reset',(req,res)=>{
  RegUser.findOne({ username: req.body.username }, function (err, user) {
    if(!user) return res.status(400).send({ msg: 'There is no account associated to this email.'});
     // Send the email
    token=crypto.randomBytes(16).toString('hex');
    user.PasswordResetToken=token;
    user.PasswordResetExpires=Date.now()+3600000;
    user.save((err,docs)=>{
      if(err)
        console.log(err);
      else
        console.log("ok");
    })
    let transporter = nodemailer.createTransport({
      service:"gmail",
      host: "smtp.gmail.com",
      auth: {
      user: config.user,
      pass: config.pass,
      },
    });
    var mailOptions = {  to: user.username, subject: 'Password Resest Token', text: 'Hello,\n\n' + 'Please reset your password by clicking the link: ' + req.headers.origin + '\/reset\/' + token + '.\n' };
    transporter.sendMail(mailOptions, function (err) {
        if (err) { return res.status(500).send({ msg: err.message }); }
        res.status(200).send({msg:'Password reset link has been sent to ' + user.username + '.'});
    });
  })
});

router.post('/newpassword',(req, res)=> {
  // Find a matching token
  RegUser.findOne({ PasswordResetToken: req.body.id,PasswordResetExpires:{$gt:Date.now()} }, function (err, user) {
    if (!user) return res.status(400).send({ msg: 'We were unable to find a valid token. Your token my have expired.' });
    user.setPassword(req.body.password,function (err,user) {
        if (err) { return res.status(500).send({ msg: err.message }); }
        user.save();
        res.status(200).send({msg:"The password has been changed. Please log in."});
    });
   });
});

module.exports = router;
