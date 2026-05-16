import React, { useState, useEffect } from 'react';
import { FaTrophy, FaStar, FaGift, FaUsers, FaCopy, FaCheck, FaHistory } from 'react-icons/fa';
import loyaltyService from '../services/loyaltyService';
import './CustomerLoyalty.css';

const CustomerLoyalty = () => {
  const [loyalty, setLoyalty] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [loyaltyRes, rewardsRes, leaderboardRes] = await Promise.all([
        loyaltyService.getMyLoyalty(),
        loyaltyService.getRewardsCatalog(),
        loyaltyService.getLeaderboard({ limit: 10 })
      ]);

      if (loyaltyRes.success) {
        setLoyalty(loyaltyRes.data);
      }
      if (rewardsRes.success) {
        setRewards(rewardsRes.data);
      }
      if (leaderboardRes.success) {
        setLeaderboard(leaderboardRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemClick = (reward) => {
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  const handleRedeemConfirm = async () => {
    if (!selectedReward) return;

    try {
      const response = await loyaltyService.redeemPoints({
        points: selectedReward.pointsRequired,
        rewardName: selectedReward.name,
        rewardDescription: selectedReward.description
      });

      if (response.success) {
        alert('Reward redeemed successfully!');
        setShowRedeemModal(false);
        setSelectedReward(null);
        fetchData();
      }
    } catch (error) {
      alert(error.message || 'Failed to redeem reward');
    }
  };

  const handleApplyReferral = async () => {
    if (!referralCode.trim()) {
      alert('Please enter a referral code');
      return;
    }

    try {
      const response = await loyaltyService.applyReferral(referralCode);
      if (response.success) {
        alert(response.message);
        setReferralCode('');
        fetchData();
      }
    } catch (error) {
      alert(error.message || 'Failed to apply referral code');
    }
  };

  const copyReferralCode = () => {
    if (loyalty?.referralCode) {
      navigator.clipboard.writeText(loyalty.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getTierColor = (tier) => {
    const colors = {
      Bronze: '#cd7f32',
      Silver: '#c0c0c0',
      Gold: '#ffd700',
      Platinum: '#e5e4e2'
    };
    return colors[tier] || '#667eea';
  };

  const getTierBenefits = (tier) => {
    const benefits = {
      Bronze: ['1x points on purchases', 'Basic support', 'Monthly newsletter'],
      Silver: ['1.5x points on purchases', 'Priority support', 'Exclusive offers', 'Free delivery on orders >₹10,000'],
      Gold: ['2x points on purchases', '24/7 priority support', 'Premium offers', 'Free delivery on all orders', 'Early access to new products'],
      Platinum: ['3x points on purchases', 'Dedicated account manager', 'VIP offers', 'Free delivery + installation', 'Early access + beta testing', 'Annual gift']
    };
    return benefits[tier] || [];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loyalty-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading loyalty program...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loyalty-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">
            <FaTrophy /> Loyalty Program
          </h1>
          <p className="page-subtitle">
            Earn points, unlock rewards, and enjoy exclusive benefits
          </p>
        </div>

        {/* Tier Card */}
        <div className="tier-card" style={{ borderColor: getTierColor(loyalty?.tier) }}>
          <div className="tier-header">
            <div className="tier-info">
              <h2 className="tier-name" style={{ color: getTierColor(loyalty?.tier) }}>
                {loyalty?.tier} Member
              </h2>
              <p className="tier-subtitle">Keep shopping to maintain your tier status</p>
            </div>
            <div className="tier-icon" style={{ background: getTierColor(loyalty?.tier) }}>
              <FaStar />
            </div>
          </div>

          <div className="tier-stats">
            <div className="stat-box">
              <div className="stat-value">{loyalty?.points?.toLocaleString() || 0}</div>
              <div className="stat-label">Available Points</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{formatCurrency(loyalty?.totalSpent || 0)}</div>
              <div className="stat-label">Total Spent</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{loyalty?.totalOrders || 0}</div>
              <div className="stat-label">Total Orders</div>
            </div>
          </div>

          <div className="tier-progress">
            <div className="progress-label">
              <span>Progress to next tier</span>
              <span>{loyalty?.tier === 'Platinum' ? 'Max Tier' : 'Keep going!'}</span>
            </div>
            {loyalty?.tier !== 'Platinum' && (
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${Math.min((loyalty?.totalSpent / getNextTierAmount(loyalty?.tier)) * 100, 100)}%`,
                    background: getTierColor(loyalty?.tier)
                  }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'rewards' ? 'active' : ''}`}
            onClick={() => setActiveTab('rewards')}
          >
            <FaGift /> Rewards
          </button>
          <button 
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <FaHistory /> History
          </button>
          <button 
            className={`tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            <FaUsers /> Leaderboard
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-content">
              {/* Tier Benefits */}
              <div className="benefits-card">
                <h3>Your {loyalty?.tier} Benefits</h3>
                <ul className="benefits-list">
                  {getTierBenefits(loyalty?.tier).map((benefit, idx) => (
                    <li key={idx}>
                      <FaCheck className="check-icon" /> {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Referral Section */}
              <div className="referral-card">
                <h3>Refer & Earn</h3>
                <p>Share your referral code and earn 1000 points for each friend who signs up!</p>
                
                <div className="referral-code-box">
                  <div className="code-display">
                    <span className="code">{loyalty?.referralCode || 'Loading...'}</span>
                    <button onClick={copyReferralCode} className="copy-btn">
                      {copied ? <FaCheck /> : <FaCopy />}
                    </button>
                  </div>
                </div>

                <div className="referral-stats">
                  <div className="referral-stat">
                    <span className="stat-number">{loyalty?.referrals?.length || 0}</span>
                    <span className="stat-text">Referrals</span>
                  </div>
                  <div className="referral-stat">
                    <span className="stat-number">
                      {loyalty?.referrals?.reduce((sum, r) => sum + r.pointsEarned, 0) || 0}
                    </span>
                    <span className="stat-text">Points Earned</span>
                  </div>
                </div>

                <div className="apply-referral">
                  <h4>Have a referral code?</h4>
                  <div className="referral-input-group">
                    <input
                      type="text"
                      placeholder="Enter referral code"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      className="referral-input"
                    />
                    <button onClick={handleApplyReferral} className="btn btn-primary">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="rewards-grid">
              {rewards.map(reward => (
                <div key={reward.id} className="reward-card">
                  <div className="reward-header">
                    <FaGift className="reward-icon" />
                    <span className="reward-points">{reward.pointsRequired} pts</span>
                  </div>
                  <h3 className="reward-name">{reward.name}</h3>
                  <p className="reward-description">{reward.description}</p>
                  <button
                    onClick={() => handleRedeemClick(reward)}
                    disabled={loyalty?.points < reward.pointsRequired}
                    className={`btn ${loyalty?.points >= reward.pointsRequired ? 'btn-primary' : 'btn-disabled'}`}
                  >
                    {loyalty?.points >= reward.pointsRequired ? 'Redeem' : 'Insufficient Points'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-content">
              <h3>Points History</h3>
              {loyalty?.pointsHistory && loyalty.pointsHistory.length > 0 ? (
                <div className="history-list">
                  {loyalty.pointsHistory.slice().reverse().map((item, idx) => (
                    <div key={idx} className="history-item">
                      <div className="history-info">
                        <span className="history-description">{item.description}</span>
                        <span className="history-date">{formatDate(item.date)}</span>
                      </div>
                      <span className={`history-points ${item.points > 0 ? 'positive' : 'negative'}`}>
                        {item.points > 0 ? '+' : ''}{item.points}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-message">No points history yet</p>
              )}

              {loyalty?.rewards && loyalty.rewards.length > 0 && (
                <>
                  <h3 style={{ marginTop: '2rem' }}>Redeemed Rewards</h3>
                  <div className="redeemed-list">
                    {loyalty.rewards.map((reward, idx) => (
                      <div key={idx} className="redeemed-item">
                        <div className="redeemed-info">
                          <span className="redeemed-name">{reward.name}</span>
                          <span className="redeemed-date">{formatDate(reward.redeemedAt)}</span>
                        </div>
                        <span className={`status-badge status-${reward.status}`}>
                          {reward.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="leaderboard-content">
              <h3>Top Members</h3>
              <div className="leaderboard-list">
                {leaderboard.map((member, idx) => (
                  <div key={member._id} className="leaderboard-item">
                    <div className="rank" style={{ 
                      background: idx < 3 ? getTierColor(['Gold', 'Silver', 'Bronze'][idx]) : '#e2e8f0'
                    }}>
                      {idx + 1}
                    </div>
                    <div className="member-info">
                      <span className="member-name">{member.farmer?.name || 'Anonymous'}</span>
                      <span className="member-tier" style={{ color: getTierColor(member.tier) }}>
                        {member.tier}
                      </span>
                    </div>
                    <div className="member-stats">
                      <span className="member-points">{member.points.toLocaleString()} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Redeem Modal */}
        {showRedeemModal && selectedReward && (
          <div className="modal-overlay" onClick={() => setShowRedeemModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Confirm Redemption</h2>
                <button className="modal-close" onClick={() => setShowRedeemModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="reward-preview">
                  <FaGift className="preview-icon" />
                  <h3>{selectedReward.name}</h3>
                  <p>{selectedReward.description}</p>
                  <div className="points-info">
                    <span>Points Required: <strong>{selectedReward.pointsRequired}</strong></span>
                    <span>Your Points: <strong>{loyalty?.points}</strong></span>
                    <span>Remaining: <strong>{loyalty?.points - selectedReward.pointsRequired}</strong></span>
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button onClick={() => setShowRedeemModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button onClick={handleRedeemConfirm} className="btn btn-primary">
                  <FaCheck /> Confirm Redemption
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function
const getNextTierAmount = (currentTier) => {
  const amounts = {
    Bronze: 100000,
    Silver: 250000,
    Gold: 500000,
    Platinum: 500000
  };
  return amounts[currentTier] || 100000;
};

export default CustomerLoyalty;

// Made with Bob
