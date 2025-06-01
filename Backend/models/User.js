const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

   Name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  profileImage: {
    type: String,  // URL of profile image
    default: ''
  },
  bio: {
    type: String,
    maxlength: 150,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export the User model
module.exports = mongoose.model('User', userSchema);
