const express = require('express');
const app = express();
const connectionDB = require('./config/database');
const User = require ('./models/user');

app.use(express.json());

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
 
app.get('/user', async (req,res)=>{
     const userEmail = req.body.emailId;
     try{
        const user = await User.findOne({emailId:userEmail});
        if(!user){
            res.status(404).send('User not found!!');

        }
        else {
            res.send(user);
        }
     }
     catch(error){
        res.status(500).send('Error fetching user data!!'+ error.message);
     }
})
app.post('/signup',async (req , res)=> {
    const user = new User(req.body);
       
    try{
        await user.save();
        res.send ('User created succesfully!!');
    }
    catch(error){
        res.status(500).send('user creation failed!!'+ error.message);
    }
});
app.patch('/signup', async (req,res) =>{
    const userId = req.body._id;
    try {
        await User.findByIdAndUpdate(userId,{firstName: "Raiyaan"});
        res.send ('User updated successfully!!');
    }
    catch(error){
        res.status(500).send('Error updating user data!!'+ error.message);
    }

});

 app.delete('/signup', async(req,res) => {
    const userId = req.body._id;

    try{
         await  User.findByIdAndDelete(userId);
         res.send('user deleted successfully!!');
    }
    catch (error){
        res.status(500).send('Could not delete user' + error.message);
    }
 })

connectionDB().then(()=> {
    console.log('Database connected successfully');
    app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
}).catch((error) => {
    console.error('Database connection failed:', error);
});
 
