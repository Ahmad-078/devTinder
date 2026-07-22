const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');

//  app.use('/', (req,res)=>{
//     res.send('Hello from server');
// });

app.post('/signup', async (req,res)=>{
    const user = new User({
        firstName :"Ahmad",
        lastName :"Sufiyan",
        email :"ahmad@sufiyan.com",
        password :"Ahmad@123"
    })
    try{
         await user.save();
         res.send("User added successfully");
    } catch (error) {
        res.status(400).send("Error adding user :"+ error.message);
    }
})
connectDB().then(()=>{
    console.log('Database connected successfully');
    app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})
})
.catch((err)=>{
    console.error('Database connection error:', err);
});

