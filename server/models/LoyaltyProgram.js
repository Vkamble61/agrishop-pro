const mongoose = require('mongoose');

const loyaltyProgramSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  tier: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
    default: 'Bronze'
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  totalOrders: {
    type: Number,
    default: 0,
    min: 0
  },
  pointsHistory: [{
    points: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ['earned', 'redeemed', 'expired', 'bonus'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  rewards: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    pointsRequired: {
      type: Number,
      required: true
    },
    redeemedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'delivered'],
      default: 'pending'
    }
  }],
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referrals: [{
    referredUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    pointsEarned: {
      type: Number,
      default: 0
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  lastTierUpdate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for points expiring soon (90 days old)
loyaltyProgramSchema.virtual('expiringPoints').get(function() {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  
  return this.pointsHistory
    .filter(h => h.type === 'earned' && h.date < ninetyDaysAgo)
    .reduce((sum, h) => sum + h.points, 0);
});

// Method to calculate tier based on total spent
loyaltyProgramSchema.methods.updateTier = function() {
  const oldTier = this.tier;
  
  if (this.totalSpent >= 500000) {
    this.tier = 'Platinum';
  } else if (this.totalSpent >= 250000) {
    this.tier = 'Gold';
  } else if (this.totalSpent >= 100000) {
    this.tier = 'Silver';
  } else {
    this.tier = 'Bronze';
  }
  
  if (oldTier !== this.tier) {
    this.lastTierUpdate = new Date();
    
    // Bonus points for tier upgrade
    const bonusPoints = {
      'Silver': 500,
      'Gold': 1000,
      'Platinum': 2000
    };
    
    if (bonusPoints[this.tier]) {
      this.points += bonusPoints[this.tier];
      this.pointsHistory.push({
        points: bonusPoints[this.tier],
        type: 'bonus',
        description: `Tier upgrade bonus to ${this.tier}`
      });
    }
  }
  
  return this.tier;
};

// Method to add points from order
loyaltyProgramSchema.methods.addPointsFromOrder = function(orderId, orderAmount) {
  // 1 point per ₹100 spent
  const pointsEarned = Math.floor(orderAmount / 100);
  
  this.points += pointsEarned;
  this.totalSpent += orderAmount;
  this.totalOrders += 1;
  
  this.pointsHistory.push({
    points: pointsEarned,
    type: 'earned',
    description: `Points earned from order`,
    orderId: orderId
  });
  
  this.updateTier();
  
  return pointsEarned;
};

// Method to redeem points
loyaltyProgramSchema.methods.redeemPoints = function(points, rewardName, rewardDescription) {
  if (this.points < points) {
    throw new Error('Insufficient points');
  }
  
  this.points -= points;
  
  this.pointsHistory.push({
    points: -points,
    type: 'redeemed',
    description: `Redeemed for: ${rewardName}`
  });
  
  this.rewards.push({
    name: rewardName,
    description: rewardDescription,
    pointsRequired: points,
    status: 'pending'
  });
  
  return true;
};

// Method to generate referral code
loyaltyProgramSchema.methods.generateReferralCode = function() {
  if (!this.referralCode) {
    const code = 'REF' + Math.random().toString(36).substring(2, 8).toUpperCase();
    this.referralCode = code;
  }
  return this.referralCode;
};

// Method to add referral
loyaltyProgramSchema.methods.addReferral = function(referredUserId) {
  const referralPoints = 1000;
  
  this.points += referralPoints;
  this.referrals.push({
    referredUser: referredUserId,
    pointsEarned: referralPoints
  });
  
  this.pointsHistory.push({
    points: referralPoints,
    type: 'bonus',
    description: 'Referral bonus'
  });
  
  return referralPoints;
};

// Index for faster queries
loyaltyProgramSchema.index({ farmer: 1 });
loyaltyProgramSchema.index({ tier: 1 });
loyaltyProgramSchema.index({ referralCode: 1 });

module.exports = mongoose.model('LoyaltyProgram', loyaltyProgramSchema);

// Made with Bob
