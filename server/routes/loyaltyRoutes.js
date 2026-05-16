const express = require('express');
const router = express.Router();
const {
  getMyLoyalty,
  getLoyaltyByFarmer,
  getAllLoyalty,
  redeemPoints,
  applyReferral,
  getRewardsCatalog,
  updateRewardStatus,
  getLeaderboard
} = require('../controllers/loyaltyController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/rewards-catalog', getRewardsCatalog);
router.get('/leaderboard', getLeaderboard);

// Protected routes (farmers)
router.use(protect);
router.get('/my-loyalty', getMyLoyalty);
router.post('/redeem', redeemPoints);
router.post('/apply-referral', applyReferral);

// Admin only routes
router.get('/all', authorize('admin'), getAllLoyalty);
router.get('/farmer/:farmerId', authorize('admin'), getLoyaltyByFarmer);
router.put('/reward/:farmerId/:rewardId', authorize('admin'), updateRewardStatus);

module.exports = router;

// Made with Bob
