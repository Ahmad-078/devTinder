const express = require('express');
const app = express();
const connectionDB = require('./config/database');
const User = require ('./models/user');

app.use(express.json());


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

connectionDB().then(()=> {
    console.log('Database connected successfully');
    app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
}).catch((error) => {
    console.error('Database connection failed:', error);
});
 
