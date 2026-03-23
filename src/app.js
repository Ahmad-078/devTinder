const express = require('express');
const app = express();
const connectionDB = require('./config/database');
const authRouter = require('./routes/auth');
const requestRouter = require('./routes/request');
const profileRouter = require('./routes/profile');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
app.use(express.json());
app.use(cookieParser());

 app.use("/",authRouter);
 app.use("/",requestRouter);
 app.use("/",profileRouter);   

 


 

connectionDB().then(()=> {
    console.log('Database connected successfully');
    app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
}).catch((error) => {
    console.error('Database connection failed:', error);
});
 
