const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: [true, 'First name is required'] // Custom error message
  },
  lastName: { 
    type: String, 
    required: [true, 'Last name is required']
  },
  bio: { type: String },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'] // Minimum length
  },
  contact: { 
    type: String, 
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v); // Example for 10-digit phone number validation
      },
      message: props => `${props.value} is not a valid contact number!`
    }
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: function(v) {
        return /\S+@\S+\.\S+/.test(v); // Basic email format validation
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  github: { type: String },
  linkedin: { type: String },
  website: { type: String },
  profileImage: { type: String },
}, { timestamps: true });

// Middleware to hash password before saving user document
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
