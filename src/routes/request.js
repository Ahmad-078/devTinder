const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');
const { connect } = require('mongoose');

requestRouter.post('/request/send/:status/:toUserId',userAuth,  async  (req,res)=>{
  try{
    const loggedInUser = req.user;
    const fromUserId = loggedInUser._id;
    const {status,toUserId} = req.params;
   
    const allowedStatus = ["interested",'ignored'];
    if(!allowedStatus.includes(status)){
      throw new Error('Invalid status');
    }
    const toUser = await User.findOne({_id:toUserId});
    if(!toUser){
       return res.status(404).json({
        message: "user is not defined"
       })
    }
     const existingConnectionRequest = await ConnectionRequest.findOne({
      $or:[
        {toUserId, fromUserId},
        {toUserId: fromUserId, fromUserId: toUserId}
      ]
     })
     if(existingConnectionRequest){
      return res.status(400).json({
        message:"Connection  exists"
      })
     }
     const connectionRequest = await  new ConnectionRequest({
      fromUserId,toUserId,status
     })
     await connectionRequest.save();
     res.json({
      message: `${loggedInUser.firstName} : you request has been made`
     })
  }
  catch(error){
    res.status(400).send('Error :' + error.message);
  }
})

requestRouter.post('/request/review/:status/:requestId',userAuth, async (req,res)=>{
  const loggedInUser = req.user;
  
  const {status,requestId} = req.params;

  const validStatus = ["accepted","rejected"];
  if(!validStatus.includes(status)){
     return res.status(400).json({
      message: "Status is invalid"
     })
    }
   const connectionRequest = await ConnectionRequest.findOne({
    _id: requestId,
    toUserId: loggedInUser._id,
    status:"interested"
   })
    if(!connectionRequest){
       return res.status(404).json({
        message: "Connection request not found"
       })
    }
    connectionRequest.status = status
    const data = await connectionRequest.save();
    res.json({
      message: "connection reviewed succesfully",
      data: data
    })
}

)
 module.exports = requestRouter;