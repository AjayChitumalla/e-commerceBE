var Token = require('./models/token');
var RegUser = require('./models/user');
var nodemailer = require('nodemailer');
var router = require('express').Router();
router.get('/:token',(req, res)=> {
    if(req.user){
        return res.status(403).send({msg:"A session is already running on this device,please logout to continue!!"})
      }
    // Find a matching token
    Token.findOne({ token: req.params.token }, function (err, token) {
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
 
        // If we found a token, find a matching user
        RegUser.findOne({ _id: token._userId }, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
            if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
 
            // Verify and save the user
            user.isverified = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.set('Content-type','text/html');
                res.status(200).send("The account has been verified. Please log in.");
            });
        });
    });
});
router.get('/reset/:token',(req,res)=>{
    if(req.user){
        return res.status(403).send({msg:"A session is already running on this device,please logout to continue!!"})
      }
    Token.findOne({ token: req.params.token }, function (err, token) {
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
        RegUser.findOne({ _id: token._userId }, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
        })
    })
});

module.exports=router;