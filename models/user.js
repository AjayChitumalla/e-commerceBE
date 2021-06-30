var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");
var config = require('../config');
var jwt = require('jsonwebtoken');
var UserSchema=new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: 'Your username is required'},
    firstname: {
        type: String,
        required: 'First Name is required'},
    lastname: {
        type: String,
        required: 'Last Name is required'},
    isverified:{
        type:Boolean,
        default:false},
    Donations:[{type: Schema.Types.ObjectId, ref : 'Donation'}],
    Address:{
        firstname:String,
        lastname:String,
        street:String,
        city:String,
        state:String,
        pin:Number,
        phone:Number
    },
    PasswordResetToken:String,
    PasswordResetExpires:Date
},{timestamps:true});

UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("RegUser",UserSchema);