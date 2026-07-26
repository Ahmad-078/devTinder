const mongoose = require('mongoose');
const validator = require('validator');
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
         validate: function(value){
            if(!validator.isEmail(value)){
                 throw new Error('Please enter a valid email address');
            }
         }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                 throw new Error ('Please enter a strong password');
            }
        }
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