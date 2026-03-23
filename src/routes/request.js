const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth');


requestRouter.post('/sendConnectionRequest', userAuth, async(req,res) => {
    try{
        const user = req.user;
         res.send(user.firstName  + ' sent you a connection request!!');

    }
    catch(error){
        res.status(400).send('Error : ' + error.message);
    }
 })

 module.exports = requestRouter;