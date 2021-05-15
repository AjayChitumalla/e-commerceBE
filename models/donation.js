var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var DonationSchema=new Schema({
    Name:String,
    Quantity:Number,
    Category:String,
    Description:String,
    Image:String,
    Status:String
});
module.exports=mongoose.model('Donation',DonationSchema);