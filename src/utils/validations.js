const validator = require('validator');
const signUpValidation = (req)=>{
    const {firstName, lastName, email, password} = req.body;
     if(!firstName || !lastName){
         throw new Error ('firstName and lastName are required');
     }
      else if(!email || !validator.isEmail(email)){
         throw new error ('Email is invalid');
      }
      else if(!password || !validator.isStrongPassword(password)){
         throw new Error ('Please enter a strong password');
      }
}
 const loginValidation = (req)=>{
    const {email,password} = req.body;
    if(!email || !password){
        throw new Error ('Please provide email and password');
    }
    else if(!validator.isEmail(email)){
        throw new Error ('Email is invalid');
    }

 }
 module.exports = { signUpValidation, loginValidation };