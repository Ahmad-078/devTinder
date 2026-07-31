const mongoose = require('mongoose');
 const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
    },
    status:{
        type: String,
        enum:{
            values:['interested','ignored','accepted','rejected'],
            message:"{VALUE} is not a valid status"
        }
    }
 },{
    timestamps:true,
 })

 connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

 connectionRequestSchema.pre('save',  async function(){
    const connectionRequest  = this;
    if(connectionRequest.toUserId.equals(connectionRequest.fromUserId)){
        throw new Error("You cann't request yourself")
    }
    
 })

const ConnectionRequestModel =mongoose.model("ConnectionRequestModel",connectionRequestSchema);
module.exports = ConnectionRequestModel;