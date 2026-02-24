const mongoose = require('mongoose');

const users = new mongoose.Schema({
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
    },
    password:{
        type:String,
    },
    age:{
        type:Number,
    }
}
 
)
const User = mongoose.model('User', users);
module.exports =User;