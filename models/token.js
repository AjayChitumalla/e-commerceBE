var mongoose=require('mongoose');
var TokenSchema = new mongoose.Schema({
    username:String,
    _userId : {
        type:mongoose.Schema.Types.ObjectId, 
        required:true, 
        ref: 'RegUser'
    },
    token : {
        type:String, 
        required:true
    },
    createdAt : {
        type:Date, 
        required:true, 
        default:Date.now, 
        expires:43200
    }
},{timestamps:true});
module.exports = mongoose.model('Token', TokenSchema);