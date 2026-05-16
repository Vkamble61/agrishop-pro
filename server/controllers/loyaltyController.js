const LoyaltyProgram = require('../models/LoyaltyProgram');
const User = require('../models/User');

// Get loyalty program for current user
exports.getMyLoyalty = async (req, res, next) => {
  try {
    let loyalty = await LoyaltyProgram.findOne({ farmer: req.user.id })
      .populate('farmer', 'name email phone');
    
    // Create loyalty program if doesn't exist
    if (!loyalty) {
      loyalty = await LoyaltyProgram.create({
        farmer: req.user.id
      });
      loyalty = await loyalty.populate('farmer', 'name email phone');
    }
    
    // Generate referral code if doesn't exist
    if (!loyalty.referralCode) {
      loyalty.generateReferralCode();
      await loyalty.save();
    }
    
    res.status(200).json({
      success: true,
      data: loyalty
    });
  } catch (error) {
    next(error);
  }
};

// Get loyalty program by farmer ID (admin only)
exports.getLoyaltyByFarmer = async (req, res, next) => {
  try {
    const loyalty = await LoyaltyProgram.findOne({ farmer: req.params.farmerId })
      .populate('farmer', 'name email phone')
      .populate('pointsHistory.orderId', 'orderNumber totalAmount');
    
    if (!loyalty) {
      return res.status(404).json({
        success: false,
        message: 'Loyalty program not found for this farmer'
      });
    }
    
    res.status(200).json({
      success: true,
      data: loyalty
    });
  } catch (error) {
    next(error);
  }
};

// Get all loyalty programs (admin only)
exports.getAllLoyalty = async (req, res, next) => {
  try {
    const { tier, minPoints, sortBy = '-points' } = req.query;
    
    const query = {};
    
    if (tier) {
      query.tier = tier;
    }
    
    if (minPoints) {
      query.points = { $gte: Number(minPoints) };
    }
    
    const loyalty = await LoyaltyProgram.find(query)
      .populate('farmer', 'name email phone')
      .sort(sortBy)
      .limit(100);
    
    // Get statistics
    const stats = await LoyaltyProgram.aggregate([
      {
        $group: {
          _id: '$tier',
          count: { $sum: 1 },
          avgPoints: { $avg: '$points' },
          totalSpent: { $sum: '$totalSpent' }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      count: loyalty.length,
      stats,
      data: loyalty
    });
  } catch (error) {
    next(error);
  }
};

// Redeem points for reward
exports.redeemPoints = async (req, res, next) => {
  try {
    const { points, rewardName, rewardDescription } = req.body;
    
    if (!points || !rewardName) {
      return res.status(400).json({
        success: false,
        message: 'Points and reward name are required'
      });
    }
    
    const loyalty = await LoyaltyProgram.findOne({ farmer: req.user.id });
    
    if (!loyalty) {
      return res.status(404).json({
        success: false,
        message: 'Loyalty program not found'
      });
    }
    
    if (loyalty.points < points) {
      return res.status(400).json({
        success: false,
        message: `Insufficient points. You have ${loyalty.points} points but need ${points}`
      });
    }
    
    loyalty.redeemPoints(points, rewardName, rewardDescription);
    await loyalty.save();
    
    res.status(200).json({
      success: true,
      message: 'Points redeemed successfully',
      data: loyalty
    });
  } catch (error) {
    next(error);
  }
};

// Apply referral code
exports.applyReferral = async (req, res, next) => {
  try {
    const { referralCode } = req.body;
    
    if (!referralCode) {
      return res.status(400).json({
        success: false,
        message: 'Referral code is required'
      });
    }
    
    // Find the referrer's loyalty program
    const referrerLoyalty = await LoyaltyProgram.findOne({ referralCode });
    
    if (!referrerLoyalty) {
      return res.status(404).json({
        success: false,
        message: 'Invalid referral code'
      });
    }
    
    // Check if user is trying to use their own code
    if (referrerLoyalty.farmer.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot use your own referral code'
      });
    }
    
    // Check if user already used a referral
    const userLoyalty = await LoyaltyProgram.findOne({ farmer: req.user.id });
    
    if (userLoyalty && userLoyalty.pointsHistory.some(h => h.type === 'bonus' && h.description.includes('Welcome bonus'))) {
      return res.status(400).json({
        success: false,
        message: 'You have already used a referral code'
      });
    }
    
    // Add referral to referrer
    const pointsEarned = referrerLoyalty.addReferral(req.user.id);
    await referrerLoyalty.save();
    
    // Give welcome bonus to new user
    if (!userLoyalty) {
      const newLoyalty = await LoyaltyProgram.create({
        farmer: req.user.id,
        points: 500
      });
      
      newLoyalty.pointsHistory.push({
        points: 500,
        type: 'bonus',
        description: 'Welcome bonus from referral'
      });
      
      await newLoyalty.save();
    } else {
      userLoyalty.points += 500;
      userLoyalty.pointsHistory.push({
        points: 500,
        type: 'bonus',
        description: 'Welcome bonus from referral'
      });
      await userLoyalty.save();
    }
    
    res.status(200).json({
      success: true,
      message: `Referral applied! You received 500 points and the referrer received ${pointsEarned} points`,
      data: { pointsReceived: 500 }
    });
  } catch (error) {
    next(error);
  }
};

// Get available rewards catalog
exports.getRewardsCatalog = async (req, res, next) => {
  try {
    const catalog = [
      {
        id: 1,
        name: '₹500 Discount Voucher',
        description: 'Get ₹500 off on your next purchase',
        pointsRequired: 5000,
        category: 'discount',
        image: '/images/rewards/voucher-500.png'
      },
      {
        id: 2,
        name: '₹1000 Discount Voucher',
        description: 'Get ₹1000 off on your next purchase',
        pointsRequired: 9000,
        category: 'discount',
        image: '/images/rewards/voucher-1000.png'
      },
      {
        id: 3,
        name: 'Free Equipment Service',
        description: 'One free service for any equipment',
        pointsRequired: 7500,
        category: 'service',
        image: '/images/rewards/service.png'
      },
      {
        id: 4,
        name: 'Premium Support (1 Month)',
        description: '24/7 priority customer support for 1 month',
        pointsRequired: 3000,
        category: 'support',
        image: '/images/rewards/support.png'
      },
      {
        id: 5,
        name: 'Agricultural Training Course',
        description: 'Access to online agricultural training course',
        pointsRequired: 6000,
        category: 'education',
        image: '/images/rewards/training.png'
      },
      {
        id: 6,
        name: 'Soil Testing Kit',
        description: 'Professional soil testing kit delivered to your farm',
        pointsRequired: 8000,
        category: 'product',
        image: '/images/rewards/soil-kit.png'
      },
      {
        id: 7,
        name: 'Free Delivery (5 Orders)',
        description: 'Free delivery on your next 5 orders',
        pointsRequired: 4000,
        category: 'delivery',
        image: '/images/rewards/delivery.png'
      },
      {
        id: 8,
        name: '₹2500 Discount Voucher',
        description: 'Get ₹2500 off on your next purchase',
        pointsRequired: 20000,
        category: 'discount',
        image: '/images/rewards/voucher-2500.png'
      }
    ];
    
    res.status(200).json({
      success: true,
      count: catalog.length,
      data: catalog
    });
  } catch (error) {
    next(error);
  }
};

// Update reward status (admin only)
exports.updateRewardStatus = async (req, res, next) => {
  try {
    const { farmerId, rewardId } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'approved', 'delivered'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const loyalty = await LoyaltyProgram.findOne({ farmer: farmerId });
    
    if (!loyalty) {
      return res.status(404).json({
        success: false,
        message: 'Loyalty program not found'
      });
    }
    
    const reward = loyalty.rewards.id(rewardId);
    
    if (!reward) {
      return res.status(404).json({
        success: false,
        message: 'Reward not found'
      });
    }
    
    reward.status = status;
    await loyalty.save();
    
    res.status(200).json({
      success: true,
      message: 'Reward status updated',
      data: loyalty
    });
  } catch (error) {
    next(error);
  }
};

// Get leaderboard
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 10, type = 'points' } = req.query;
    
    let sortField = '-points';
    if (type === 'spent') {
      sortField = '-totalSpent';
    } else if (type === 'orders') {
      sortField = '-totalOrders';
    }
    
    const leaderboard = await LoyaltyProgram.find()
      .populate('farmer', 'name')
      .sort(sortField)
      .limit(Number(limit))
      .select('farmer points tier totalSpent totalOrders');
    
    res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard
    });
  } catch (error) {
    next(error);
  }
};

// Made with Bob
