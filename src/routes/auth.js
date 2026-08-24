const express = require('express');
const authRouter = express.Router();
const {signUpValidation, loginValidation} = require('../utils/validations');
const User = require('../models/user');
const bcrypt = require('bcrypt');

authRouter.post('/signup', async (req,res)=>{

    try{
        // validate the request body
        signUpValidation(req);
        const {firstName, lastName, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new User({
            firstName, 
            lastName,
            email,
            password:hashedPassword 
        })
         await user.save();
         res.send("User added successfully");
    } catch (error) {
        res.status(400).send("Error :"+ error.message);
    }
})
 authRouter.post('/login', async(req,res)=>{
    try{
         loginValidation(req);
         const {email, password} = req.body;
         const user = await User.findOne({email});
         if(!user){
             throw new Error('Invalid credentials');
              
         }
        const  isMatch = await user.validatePassword(password);
        if(isMatch){
            const token = await user.getJWT();
            res.cookie('token',token);

            return res.send(user);
        }
        else{
            throw new Error('Invalid credentials');
        }
         
    }catch(error){
         res.status(400).send("Error :"+ error.message);
    }

 })
 authRouter.post('/logout', (req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
    });
     res.send("Logout successful");
 })

 module.exports = authRouter;