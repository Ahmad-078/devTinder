const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');


requestRouter.post('/request/send/:status/:toUserId', userAuth, async(req,res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatus = ['interested', 'ignored'];
        if(!allowedStatus.includes(status)){
           throw new Error('Invalid status. Allowed values are "interested" or "ignored".');
        }   
        const toUser = await User.findById(toUserId);
        if(!toUser){
            throw new Error('The user you are trying to connect with does not exist.');
        }   
        const existingRequest  = await ConnectionRequestModel.findOne({
            $or:[
                
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })
         if(existingRequest){
            throw new Error('Connection request already exists between these users.');
         }
        const connectionRequest = new ConnectionRequestModel ({
            fromUserId,
            toUserId,
            status
        })
        await connectionRequest.save();
        res.status(200).send('Connection request sent successfully.');
    }
    catch(error){
        res.status(400).send('Error : ' + error.message);
    }
 })
  
 requestRouter.post('/request/review/:status/:requestId', userAuth, async(req,res) =>{
    try {
         const loggedInUserId = req.user._id;
         const {status, requestedId} = req.params;
         const allowedStatus = ['accepted', 'rejected'];
         if(!allowedStatus.includes(status)){
            throw new Error('Invalid status.');
         }

        const connectionRequest = await ConnectionRequestModel.findOne(
            {
                _id:requestedId,
                toUserId: loggedInUserId,
                status:'interested'

        })
        if(!connectionRequest){
            throw new Error('No connection request found to review.');
        }
        connectionRequest.status = status;
        await connectionRequest.save();
        res.status(200).send(`Connection request ${status} successfully.`); 

    } catch (error) {
        res.status(400).send('Error : ' + error.message);
    }
 })

 module.exports = requestRouter;