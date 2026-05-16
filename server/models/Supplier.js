const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide supplier name'],
    trim: true
  },
  companyName: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  alternatePhone: {
    type: String,
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  address: {
    street: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'India'
    }
  },
  gstNumber: {
    type: String,
    trim: true,
    uppercase: true
  },
  panNumber: {
    type: String,
    trim: true,
    uppercase: true
  },
  // Products supplied
  categories: [{
    type: String,
    enum: ['tractor', 'harvester', 'plough', 'seeder', 'sprayer', 'rotavator', 'cultivator', 'other']
  }],
  brands: [{
    type: String,
    trim: true
  }],
  // Payment terms
  paymentTerms: {
    creditDays: {
      type: Number,
      default: 30
    },
    advancePercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  // Bank details
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    branch: String
  },
  // Business metrics
  totalPurchases: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  lastPurchaseDate: {
    type: Date
  },
  // Rating and notes
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  notes: {
    type: String
  },
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
supplierSchema.index({ name: 1 });
supplierSchema.index({ email: 1 });
supplierSchema.index({ isActive: 1 });
supplierSchema.index({ categories: 1 });

// Method to update purchase statistics
supplierSchema.methods.updatePurchaseStats = function(amount) {
  this.totalPurchases += 1;
  this.totalAmount += amount;
  this.lastPurchaseDate = new Date();
  return this.save();
};

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;

// Made with Bob
