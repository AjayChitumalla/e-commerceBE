var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var ProductSchema=new Schema({
    Name:String,
    Quantity:Number,
    Category:String,
    Description:String,
    Image:String
});
module.exports=mongoose.model('Product',ProductSchema);