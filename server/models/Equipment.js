const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide equipment name'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please provide equipment category'],
    enum: ['tractor', 'harvester', 'plough', 'seeder', 'sprayer', 'rotavator', 'cultivator', 'other']
  },
  brand: {
    type: String,
    required: [true, 'Please provide brand name'],
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide price'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Please provide description']
  },
  specifications: {
    type: Map,
    of: String
  },
  images: [{
    type: String
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide quantity'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  reorderLevel: {
    type: Number,
    default: 5
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  // EMI options
  emiAvailable: {
    type: Boolean,
    default: true
  },
  minDownPayment: {
    type: Number,
    min: 0
  },
  // Ratings and reviews
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Virtual for checking if reorder is needed
equipmentSchema.virtual('needsReorder').get(function() {
  return this.quantity <= this.reorderLevel;
});

// Update inStock based on quantity
equipmentSchema.pre('save', function(next) {
  this.inStock = this.quantity > 0;
  next();
});

// Index for faster queries
equipmentSchema.index({ category: 1, inStock: 1 });
equipmentSchema.index({ brand: 1 });
equipmentSchema.index({ price: 1 });
equipmentSchema.index({ name: 'text', description: 'text' });

// Method to update rating
equipmentSchema.methods.updateRating = async function(newRating) {
  const totalRating = (this.averageRating * this.totalReviews) + newRating;
  this.totalReviews += 1;
  this.averageRating = totalRating / this.totalReviews;
  await this.save();
};

const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment;

// Made with Bob
