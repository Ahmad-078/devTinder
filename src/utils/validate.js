 const validator = require('validator');
const signUpValidation = (req) =>{
    const { firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName){
        throw new Error('First name and last name are required!!');
    }
    else if(!validator.isEmail(emailId)){
        throw new Error('Invalid email format!!');
    }
    else if (!validator.isStrongPassword(password)){
        throw new Error('Please enter a strong password!!');
    }
}
 module.exports ={
    signUpValidation
 }