const mongoose = require('mongoose');
const connectDB = async() => {
     await mongoose.connect ("mongodb+srv://ahmadSufiyan:37Q2M7C2vzOVcIkp@namastenode.y9nwzma.mongodb.net/devTinder")
}
module.exports = connectDB;