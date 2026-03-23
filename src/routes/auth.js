const express = require('express');
const authRouter = express.Router();
const User = require ('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const {signUpValidation} = require('../utils/validate');


  authRouter.post('/login', async (req,res) =>{
    try{
        const {emailId,password} = req.body;
        const user = await User.findOne({emailId:emailId});
        if(!user){
            throw new Error('Invalid Credentials');
        }
        const isPasswordValid = await bcrypt.compare (password , user.password);

        
        if(isPasswordValid){
             const token = jwt.sign({_id: user._id},"Ahmad@078", {expiresIn: '7d'});
            res.cookie('token', token);
            res.send('Login successful!!');

        }
        else{
            throw new Error('Invalid Credentials');
        }
        

    }
    catch(error){
        res.status(400).send ('Error : ' + error.message);
    }
 })

 authRouter.post('/signup',async (req , res)=> {
    
       
    try{
        signUpValidation(req);
        const {firstName,lastName, emailId, password} = req.body;

         const hashedPassword = await bcrypt.hash(password,10);


        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashedPassword,
        });
        await user.save();
        res.send ('User created succesfully!!');
    }
    catch(error){
        res.status(400).send('Error'+ error.message);
    }
});
  authRouter.post('/logout', (req,res) => {
   res.cookie('token', null, {
     expires : new Date (Date.now())
   });
    res.send('Logout successfull');
 })
 module.exports = authRouter;