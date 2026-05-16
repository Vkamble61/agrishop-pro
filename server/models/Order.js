const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'in_service', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'emi', 'bank_transfer'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded'],
    default: 'pending'
  },
  // EMI details (if applicable)
  emiDetails: {
    isEMI: {
      type: Boolean,
      default: false
    },
    downPayment: {
      type: Number,
      min: 0
    },
    monthlyPayment: {
      type: Number,
      min: 0
    },
    tenure: {
      type: Number,
      min: 1
    },
    interestRate: {
      type: Number,
      min: 0
    },
    totalEMIAmount: {
      type: Number,
      min: 0
    }
  },
  // Delivery details
  deliveryAddress: {
    village: String,
    district: String,
    state: String,
    pincode: String,
    landmark: String
  },
  deliveryDate: {
    type: Date
  },
  // Notes and tracking
  customerNotes: {
    type: String
  },
  adminNotes: {
    type: String
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  // Discount and loyalty
  discountApplied: {
    type: Number,
    default: 0,
    min: 0
  },
  loyaltyPointsEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  loyaltyPointsUsed: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD${year}${month}${(count + 1).toString().padStart(4, '0')}`;
    
    // Add initial status to history
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: 'Order created'
    });
  }
  next();
});

// Method to update status
orderSchema.methods.updateStatus = function(newStatus, note = '') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note: note
  });
  return this.save();
};

// Method to calculate loyalty points
orderSchema.methods.calculateLoyaltyPoints = function() {
  // 1 point per 100 rupees spent
  const points = Math.floor(this.totalAmount / 100);
  this.loyaltyPointsEarned = points;
  return points;
};

// Index for faster queries
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

// Made with Bob
