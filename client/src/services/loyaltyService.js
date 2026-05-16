import api from './api';

const loyaltyService = {
  // Get current user's loyalty program
  getMyLoyalty: async () => {
    try {
      const response = await api.get('/loyalty/my-loyalty');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch loyalty data' };
    }
  },

  // Get all loyalty programs (admin)
  getAllLoyalty: async (params = {}) => {
    try {
      const response = await api.get('/loyalty/all', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch loyalty programs' };
    }
  },

  // Get loyalty by farmer ID (admin)
  getLoyaltyByFarmer: async (farmerId) => {
    try {
      const response = await api.get(`/loyalty/farmer/${farmerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch farmer loyalty' };
    }
  },

  // Redeem points
  redeemPoints: async (redeemData) => {
    try {
      const response = await api.post('/loyalty/redeem', redeemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to redeem points' };
    }
  },

  // Apply referral code
  applyReferral: async (referralCode) => {
    try {
      const response = await api.post('/loyalty/apply-referral', { referralCode });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to apply referral code' };
    }
  },

  // Get rewards catalog
  getRewardsCatalog: async () => {
    try {
      const response = await api.get('/loyalty/rewards-catalog');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch rewards catalog' };
    }
  },

  // Update reward status (admin)
  updateRewardStatus: async (farmerId, rewardId, status) => {
    try {
      const response = await api.put(`/loyalty/reward/${farmerId}/${rewardId}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update reward status' };
    }
  },

  // Get leaderboard
  getLeaderboard: async (params = {}) => {
    try {
      const response = await api.get('/loyalty/leaderboard', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch leaderboard' };
    }
  }
};

export default loyaltyService;

// Made with Bob
