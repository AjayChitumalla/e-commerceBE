var express = require('express');
var router = express.Router();
var Product  = require('../models/product');
var Donation  = require('../models/donation');
var multer = require('multer');

router.get('/', (req, res) => {
    Product.find({},(err, docs) => {
      if (err) {
        console.log('Error while getting products from DB in /products ' + err);
        res.json({
          error: err
        });
      } else {
          res.json(docs);
      }
    });
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')},
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage }).single('file');

router.post('/file',async(req,res)=>{
    var img="";
    upload(req,res,(err)=>{
      if(err) {
        res.status(400).send("Something went wrong!");
      }
      res.send({msg:"ok"});
    })
})
router.post('/',async(req,res)=>{
    var product=new Product({
      Name:req.body.name,
      Quantity:req.body.quantity,
      Description:req.body.desc,
      Category:req.body.cat,
      Image:req.body.img
    });
    try {
      const existingProduct = await Product.findOne({Name:req.body.name});
  
      if (existingProduct) {
        return res.status(403).send({msg:"Product with the given name already exists"});
      }
    product.save(function(err,NewP){
      if(err)
        console.log(err);
      else{
        res.status(200).send({msg:'ok'});
        }
    })
  }
  catch(err){
    console.log(err);
  }
});
router.post('/donate',(req,res)=>{
  var donation = new Donation({
    Name:req.body.name,
    Quantity:req.body.quantity,
    Description:req.body.desc,
    Category:req.body.cat,
    Image:req.body.img,
    User:req.body.user,
    Time:req.body.Time,
    Status:req.body.Status
  })
  donation.save(function(err,NewD){
    if(err)
      console.log(err);
    else{
      res.status(200).send(NewD);
      }
  })
});
router.post('/delete',(req,res)=>{
  var arr = req.body.arr;
  for(var i=0;i<arr.length;i++){
    Product.findByIdAndRemove((arr[i]),(err,docs)=>{
      if(err){
        console.log("error");
        console.log(err);
      }
      else{
        console.log("removed");
        console.log(docs);
      }
    });
  }
  res.status(200).send({msg:'ok'});
});
router.delete('/delete/:id',(req,res)=>{
  Product.findByIdAndRemove(req.params.id,(err,docs)=>{
    if(err)
      console.log(err);
    else
      console.log(docs);
  })
})
router.get('/getDonations',(req,res)=>{
  Donation.find({}).populate('User').exec((err, docs) => {
    if (err) {
      console.log('Error while getting products from DB in /products ' + err);
      res.json({
        error: err
      });
    } 
    else {
      console.log(docs);
      res.json(docs);
    }
  })
})
router.get('/:productId',(req,res)=>{
  Product.findById(req.params.productId,(err,docs)=>{
    if(err)
    console.log(err);
    else
    res.status(200).send(docs);
  })
});
router.put('/:productId',(req,res)=>{
  Product.findByIdAndUpdate((req.params.productId),{Name:req.body.name,Description:req.body.desc,Category:req.body.cat,Quantity:req.body.price,Image:req.body.img},(err,docs)=>{
    if(err)
    console.log(err);
    else
    res.status(200).send({msg:'ok'});
  })
})
router.get('/getDonation/:donationId',(req,res)=>{
  Donation.findById(req.params.donationId).populate('User').exec((err,docs)=>{
    if(err)
      console.log(err);
    else
      res.status(200).send(docs);
  })
})
router.put('/status/:donationId',(req,res)=>{
  Donation.findByIdAndUpdate((req.params.donationId),{Status:req.body.Status},(err,docs)=>{
    if(err)
      console.log(err);
    else
      res.status(200).send({msg:"ok"});
  })
})
router.put('/updateQuantity/:id',(req,res)=>{
  console.log(req.body.quantity)
  Product.findByIdAndUpdate(req.params.id,{Quantity:req.body.quantity},(err,docs)=>{
    if(err)
      console.log(err);
    else
      res.status(200).send({msg:"ok"});
  })
})
module.exports = router;