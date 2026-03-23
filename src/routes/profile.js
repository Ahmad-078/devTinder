const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const {profileEditValidation,passwordEditValidation} = require('../utils/validate');
const bcrypt = require('bcrypt');

 profileRouter.get('/profile/view', userAuth,async(req,res) =>{
   try{ 
    
    const user = req.user;
    
    res.send(user);
    
   } catch(error){
    res.status(400).send('Error : ' + error.message);
   }
   
})
profileRouter.patch('/profile/edit',userAuth, async(req,res) => {
  try{
     profileEditValidation(req);
     if(!profileEditValidation(req)){
       throw new Error('Please enter valid fields to edit!!');
     }
     const loggedInUser = req.user;
     Object.keys(req.body).forEach(field => loggedInUser[field] = req.body[field]);
     await loggedInUser.save();
     res.send("profile updated successfully!!");


  }
  catch(error){
    res.status(400).send('Error : ' + error.message);
  }
})

 profileRouter.patch('/profile/password/edit', userAuth,async(req,res) => {
  try{
      passwordEditValidation(req);
     const {newPassword, oldPassword} = req.body;
      
      const user = req.user;
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if(!isMatch){
        throw new Error ('Old password is incorrect!!');
      }
      const hashedPassword = await bcrypt.hash(newPassword,10);
      user.password = hashedPassword;
      await user.save();  
      res.send('Password updated successfully!!');

  }
  catch(error){
    res.status(400).send('Error : ' + error.message);
  } 
 })


 module.exports = profileRouter;