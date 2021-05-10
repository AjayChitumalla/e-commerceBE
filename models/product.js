var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var ProductSchema=new Schema({
    Name:String,
    Quantity:Number,
    Category:String,
    Image:String,
    Status:String
});
module.exports=mongoose.model('Product',ProductSchema);