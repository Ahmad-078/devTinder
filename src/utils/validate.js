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
 const profileEditValidation = (req) => {
    const editableFields = ['firstName', 'lastName', 'age', 'gender'];
    const isEditable = Object.keys(req.body).every (field => editableFields.includes(field));
     return isEditable;
 }
 const  passwordEditValidation = (req) => {
     const {newPassword , oldPassword} = req.body;
     if(!newPassword || !oldPassword){ 
        throw new Error ('Please enter required fields!!'); 
      }
      if (!validator.isStrongPassword(newPassword)){
        throw new Error('Please enter a strong password!!');
    }
    
 }
 module.exports ={
    signUpValidation,
    profileEditValidation,
    passwordEditValidation
 }