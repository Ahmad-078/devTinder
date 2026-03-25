const mongoose = require('mongoose');

const users = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required: true,
    },
    age:{
        type:Number,
        
    },
    gender:{
        type:String,
        validate:  (value)=> {
            if(!["male","female","other"].includes(value)){
                throw new Error("Invalid gender");
            }
        }
    }
},
{
    timestamps:true,
}
 
)
const User = mongoose.model('User', users);
module.exports =User;