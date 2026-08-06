const express = require('express');
const userRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/user');
const User_Safe_Data = "firstName lastName age skills gender"

userRouter.get('/user/request/received',userAuth,async (req,res)=>{
    try{
       const loggedInUser = req.user;
       const connectionRequest =  await ConnectionRequest.find({
        toUserId : loggedInUser._id,
        status : "interested"
       }).populate("fromUserId",User_Safe_Data)
      
       res.json({
        message: "Connection request received",
        data: connectionRequest
       })
    
    
    }
    catch(error){
        res.status(400).send("Error :"+ error.message);
    }

})
userRouter.get('/user/connections',userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const  connections = await ConnectionRequest.find({
            $or:[
                {fromUserId: loggedInUser._id, status:"accepted"},
                {toUserId: loggedInUser._id, status:"accepted"}
            ]
        }).populate("fromUserId",User_Safe_Data).populate("toUserId",User_Safe_Data);

        const data = connections.map(connection =>{
            if(connection.fromUserId._id.equals(loggedInUser._id)){
                return connection.toUserId;
            }
            return connection.fromUserId;
        })
        res.json({
            message: "Connections fetched successfully",
            data: data
        })
    }
    catch(error){
        res.status(400).send("Error :"+ error.message);
    }
})
userRouter.get('/feed',userAuth, async(req,res)=>{
    try{
         const loggedInUser = req.user;
         const connectionRequests = await ConnectionRequest.find({
            $or: [
                {
                    toUserId: loggedInUser._id,
                },
                {
                    fromUserId: loggedInUser._id,
                }
            ]
         })
         const hideUsersFromFeed = new Set();
         connectionRequests.forEach(request =>{
            hideUsersFromFeed.add(request.toUserId);
            hideUsersFromFeed.add(request.fromUserId);
         })
         const users = await User.find({
           $and:[
            {_id: {$ne: loggedInUser._id}},
            {_id: {$nin: Array.from(hideUsersFromFeed)}}]
         }).select(User_Safe_Data);
         res.json({
            message: "Feed fetched successfully",
            data:users
         })
    }
    catch(error){
        res.status(400).send("Error :"+ error.message);
    }
})
module.exports = userRouter;