const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minlength:3,
        maxlength:30,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        tolowercase:true,
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        min:18,
        
    },
    gender:{
        type:String,
        validate:  function validate(value){
            if(!['male','female','other'].includes(value)){
                throw new Error('Gender must be male, female or other');     
            }
        }
    },
    photoUrl:{
        type:String,
    },
    skills:{   
        type:[String], 
    }
},{
    timestamps:true,
})
 const User = mongoose.model('User',userSchema);
module.exports = User;