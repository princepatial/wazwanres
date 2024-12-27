const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
    unique: true, 
  },
});

// Export the User model based on the schema
module.exports = mongoose.model('User', userSchema);
