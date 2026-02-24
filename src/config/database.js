
const mongoose = require('mongoose');
 const connectionDB = async ()=> {
    await mongoose.connect("mongodb+srv://ahmadSufiyan:37Q2M7C2vzOVcIkp@namastenode.y9nwzma.mongodb.net/divTinder")
 }

  module.exports = connectionDB;