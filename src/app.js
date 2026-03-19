const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const connectionDB = require('./config/database');
const User = require ('./models/user');
const {signUpValidation } = require('./utils/validate');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middlewares/auth');

app.use(express.json());
app.use(cookieParser());

app.get('/feed',async (req,res) => {
    try{
        const users = await User.find({});
        if(users.length === 0){
            res.status(404).send('No users found!!');
        }
        else{
            res.send(users);
        }
    }
    catch(error){
        res.status(500).send('Error fetching users data!!'+ error.message); 
    }
})
 
app.get('/profile', userAuth,async(req,res) =>{
   try{ 
    
    const user = req.user;
    
    res.send(user);
    
   } catch(error){
    res.status(400).send('Error : ' + error.message);
   }
   
})
 app.post('/sendConnectionRequest', userAuth, async(req,res) => {
    try{
        const user = req.user;
         res.send(user.firstName  + ' sent you a connection request!!');

    }
    catch(error){
        res.status(400).send('Error : ' + error.message);
    }
 })
 app.post('/login', async (req,res) =>{
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
app.post('/signup',async (req , res)=> {
    
       
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


 

connectionDB().then(()=> {
    console.log('Database connected successfully');
    app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
}).catch((error) => {
    console.error('Database connection failed:', error);
});
 
