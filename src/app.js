const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');

//  app.use('/', (req,res)=>{
//     res.send('Hello from server');
// });
 app.use(express.json());

app.post('/signup', async (req,res)=>{

    const user = new User(req.body)
    try{
         await user.save();
         res.send("User added successfully");
    } catch (error) {
        res.status(400).send("Error adding user :"+ error.message);
    }
})
 app.get('/user', async(req,res)=>{
 const userEmail = req.body.email;
  
 try{
    const user = await User.findOne({email:userEmail});
    if(!user){
         return res.status(404).send("User not found");
    }
    else{
         res.send(user);
    }
 }
 catch (error) {
    res.status(400).send("Error fetching user :"+ error.message);
 }})
app.get('/feed', async(req,res) =>{
    try{
        const users = await User.find({});
    if(users.length === 0){
        return res.status(404).send("No users found");
    }
    res.send(users);
    }
    catch(error){
        res.status(400).send("Something went wrong :"+ error.message);
    }
})
 app.delete('/user', async(req, res)=>{
    const userId = req.body.userId;
    try{
          await User.findByIdAndDelete({_id:userId});
          res.send("User deleted successfully");
    }
    catch(error){
        res.status(400).send("Something went wrong :"+ error.message);
    }
 })
 
 app.patch('/user/:userId' , async(req,res) =>{
    const userId = req.params.userId;
    const data = req.body;
    
    
    try{
    const validfields =['firstName','lastName', 'age', 'gender','photoUrl',"skills"];
     const isValid = Object.keys(req.body).every((field)=> validfields.includes(field));
     if(!isValid){
          throw new Error("Invalid request body");
     }
    await User.findByIdAndUpdate(userId,data,{runValidators:true,returnDocument:'after' });
         res.send("User updated successfully");
    }
    catch(error){
        res.status(400).send("Something went wrong :"+ error.message);
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

