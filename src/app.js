const express = require('express');
const app = express();
 app.get("/user", (req,res) => {
    res.send({firstName: "John", lastName: "Doe"});
 });

 app.post("/user",(req,res) =>{
    res.send("User created successfully");
 })

 app.use("/test", (req,res) => {
    res.send("I am testing my server")
 });
 
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});