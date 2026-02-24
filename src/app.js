const express = require('express');
const app = express();
const connectionDB = require('./config/database');

connectionDB().then(()=> {
    console.log('Database connected successfully');
}).catch((error) => {
    console.error('Database connection failed:', error);
});
 
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});