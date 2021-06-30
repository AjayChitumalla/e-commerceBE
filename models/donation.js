var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var DonationSchema=new Schema({
    Name:String,
    Quantity:Number,
    Category:String,
    Description:String,
    Image:String,
    Status:String,
    Time:String,
    User:{type: Schema.Types.ObjectId, ref : 'RegUser'}
});
module.exports=mongoose.model('Donation',DonationSchema);