var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var ProductSchema=new Schema({
    Name:String,
    Price:Number,
    Category:String,
    Image:String,
    Description:String
});
module.exports=mongoose.model('Product',ProductSchema);