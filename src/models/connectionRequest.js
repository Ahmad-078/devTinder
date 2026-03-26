const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true,

        
    },
    toUserId:{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
    },
    status:{
        type:String,
        enum: {
            values:['interested','ignored','accepted','rejected' ],
            message:'{VALUE} is not supported'
        }
    }
},{
    timestamps:true,
})
 connectionRequestSchema.index({fromUserId:1,toUserId:1});

connectionRequestSchema.pre('save',function(){
    
    if(this.fromUserId.equals(this.toUserId)){
        throw new Error('fromUserId and toUserId cannot be the same');
    }
    
})


 const ConnectionRequestModel= mongoose.model('ConnectionRequest', connectionRequestSchema);
 module.exports = ConnectionRequestModel;