var mongoose=require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema=new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: 'Your username is required',
        trim: true
    },
    password: {
        type: String,
        // required: 'Your password is required',
        max: 100
    },
    firstname: {
        type: String,
        required: 'First Name is required',
        max: 100
    },
    lastname: {
        type: String,
        required: 'Last Name is required',
        max: 100
    },
    isverified:{
        type:Boolean,
        default:false
    },
    PasswordResetToken:String,
    PasswordResetExpires:Date
},{timestamps:true});

UserSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("RegUser",UserSchema);