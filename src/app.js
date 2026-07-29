const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');
const {userAuth} = require('./middlewares/auth');
const {signUpValidation, loginValidation} = require('./utils/validations');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt=require('jsonwebtoken');



app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req,res)=>{

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
 app.post('/login', async(req,res)=>{
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

            return res.send("Login successful");
        }
        else{
            throw new Error('Invalid credentials');
        }
         
    }catch(error){
         res.status(400).send("Error :"+ error.message);
    }

 })
 app.get('/profile', userAuth, async(req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(400).send('Error :' + error.message);
    }
}); // <-- Fixed: Closes the async function AND the app.get() call properly

connectDB().then(()=>{
    console.log('Database connected successfully');
    app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})
})
.catch((err)=>{
    console.error('Database connection error:', err);
});

