const  jwt = require('jsonwebtoken');
const User = require('../models/user');
const userAuth = async(req,res,next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            throw new Error('No token provided');
        }
        const decodedData = jwt.verify(token,"Dev@Tinder$078");
        const {_id} = decodedData;
        const user = await User.findById(_id);
        if(!user){
             throw new Error('User not found');
        }
        req.user = user;
        next();
    }
    catch(error){
        res.status(401).send("Error :"+ error.message);
    }
}
module.exports = {userAuth};