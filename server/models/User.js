const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['farmer', 'admin'],
    default: 'farmer'
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  // Farmer-specific fields
  village: {
    type: String,
    required: function() { return this.role === 'farmer'; }
  },
  district: {
    type: String,
    required: function() { return this.role === 'farmer'; }
  },
  state: {
    type: String,
    required: function() { return this.role === 'farmer'; }
  },
  farmSize: {
    type: Number,
    min: 0
  },
  cropType: {
    type: String,
    enum: ['wheat', 'rice', 'cotton', 'sugarcane', 'vegetables', 'fruits', 'pulses', 'other', '']
  },
  referredBy: {
    type: String
  },
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;

// Made with Bob
