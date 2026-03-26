const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');

const userRouter = express.Router();

userRouter.get('/user/requests/pending', userAuth,async(req,res) => {
    try{ 
        const loggedInUser = req.user;
        const pendingRequests = await ConnectionRequestModel.find(
            {
                toUserId: loggedInUser._id,
                status:'interested'
            }
        ).populate('fromUserId','firstName lastName ');
         res.json({message:'Pending connection requests retrieved successfully', pendingRequests});
    }
        catch(error){
            res.status(400).send('Error : ' + error.message);
        }

})
userRouter.get('/user/connections',userAuth, async(req,res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequestModel.find({
            $or:[
                {fromUserId: loggedInUser._id,status:'accepted'},
                {toUserId: loggedInUser._id,status:'accepted'}

            ]
        }).populate('fromUserId','firstName lastName')
          .populate('toUserId','firstName lastName') 

          const data = connections.map(row => {
            if(row.fromUserId._id.equals(loggedInUser._id)){
                return row.toUserId;
            }
             return row.fromUserId;
          })

          res.json(data);

        
    } catch (error) {
        res.status(400).send('Error : ' + error.message);
    }
})

userRouter.get('/feed', userAuth, async(req,res) =>{
     try {
         const loggedInUser = req.user;
         const connections = await ConnectionRequestModel.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
         }).select('fromUserId toUserId');
         const hideUserFromFeed = new Set();

         connections.forEach(connection =>{
             hideUserFromFeed.add(connection.fromUserId.toString());
             hideUserFromFeed.add(connection.toUserId.toString());
         })
         const feedUsers = await User.find({
            $and:[
                {_id:{$ne: loggedInUser._id}},
                {_id: {$nin: Array.from(hideUserFromFeed)}}
            ]
         })

         res.json({data:feedUsers});
        
     } catch (error) {
        res.status(400).send('Error : ' + error.message);
     }
})

module.exports = userRouter;