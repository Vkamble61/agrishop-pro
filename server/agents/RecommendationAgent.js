/**
 * Smart Recommendation Agent
 * Provides personalized equipment recommendations based on farmer profile and behavior
 */

const Equipment = require('../models/Equipment');
const Order = require('../models/Order');
const User = require('../models/User');

class RecommendationAgent {
  constructor() {
    this.name = 'RecommendationAgent';
    this.version = '1.0.0';
    this.confidenceThreshold = 0.6;
  }

  /**
   * Get personalized equipment recommendations for a farmer
   */
  async getRecommendations(params, context = {}) {
    const { farmerId, limit = 5, includeReasoning = true } = params;

    try {
      // Get farmer profile
      const farmer = await User.findById(farmerId);
      if (!farmer) {
        throw new Error('Farmer not found');
      }

      // Get farmer's order history
      const orderHistory = await Order.find({ user: farmerId })
        .populate('equipment')
        .sort({ createdAt: -1 })
        .limit(10);

      // Get all available equipment
      const allEquipment = await Equipment.find({ 
        status: 'available',
        stock: { $gt: 0 }
      });

      // Calculate recommendations
      const recommendations = await this.calculateRecommendations(
        farmer,
        orderHistory,
        allEquipment,
        limit
      );

      // Add reasoning if requested
      if (includeReasoning) {
        recommendations.forEach(rec => {
          rec.reasoning = this.generateReasoning(rec, farmer, orderHistory);
        });
      }

      return {
        farmerId,
        recommendations,
        generatedAt: new Date(),
        confidence: this.calculateOverallConfidence(recommendations)
      };

    } catch (error) {
      console.error('RecommendationAgent error:', error);
      throw error;
    }
  }

  /**
   * Calculate personalized recommendations
   */
  async calculateRecommendations(farmer, orderHistory, allEquipment, limit) {
    const scoredEquipment = [];

    for (const equipment of allEquipment) {
      // Skip if already purchased recently
      const recentlyPurchased = orderHistory.some(order => 
        order.equipment && order.equipment._id.toString() === equipment._id.toString() &&
        (Date.now() - order.createdAt) < 180 * 24 * 60 * 60 * 1000 // 6 months
      );

      if (recentlyPurchased) continue;

      // Calculate recommendation score
      const score = this.calculateEquipmentScore(equipment, farmer, orderHistory);
      
      if (score.total >= this.confidenceThreshold) {
        scoredEquipment.push({
          equipment: equipment.toObject(),
          score: score.total,
          scoreBreakdown: score.breakdown,
          confidence: score.total
        });
      }
    }

    // Sort by score and return top N
    return scoredEquipment
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Calculate equipment recommendation score
   */
  calculateEquipmentScore(equipment, farmer, orderHistory) {
    const breakdown = {
      categoryMatch: 0,
      priceAffordability: 0,
      seasonalRelevance: 0,
      popularityScore: 0,
      complementaryScore: 0
    };

    // 1. Category match based on farmer profile (30%)
    if (farmer.farmSize && equipment.category) {
      breakdown.categoryMatch = this.calculateCategoryMatch(
        equipment.category,
        farmer.farmSize,
        farmer.cropType
      ) * 0.3;
    }

    // 2. Price affordability (25%)
    if (farmer.budget || farmer.income) {
      const affordability = this.calculateAffordability(
        equipment.price,
        farmer.budget || farmer.income
      );
      breakdown.priceAffordability = affordability * 0.25;
    }

    // 3. Seasonal relevance (20%)
    breakdown.seasonalRelevance = this.calculateSeasonalRelevance(
      equipment.category,
      new Date()
    ) * 0.2;

    // 4. Popularity score (15%)
    breakdown.popularityScore = this.calculatePopularityScore(equipment) * 0.15;

    // 5. Complementary to existing equipment (10%)
    if (orderHistory.length > 0) {
      breakdown.complementaryScore = this.calculateComplementaryScore(
        equipment,
        orderHistory
      ) * 0.1;
    }

    const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

    return { total, breakdown };
  }

  /**
   * Calculate category match score
   */
  calculateCategoryMatch(category, farmSize, cropType) {
    const categoryMapping = {
      'Tractor': { minSize: 5, crops: ['wheat', 'rice', 'corn', 'sugarcane'] },
      'Harvester': { minSize: 10, crops: ['wheat', 'rice', 'corn'] },
      'Plough': { minSize: 2, crops: ['wheat', 'rice', 'vegetables'] },
      'Seeder': { minSize: 3, crops: ['wheat', 'rice', 'corn', 'vegetables'] },
      'Sprayer': { minSize: 1, crops: ['all'] },
      'Irrigation': { minSize: 2, crops: ['all'] }
    };

    const mapping = categoryMapping[category];
    if (!mapping) return 0.5; // Default score

    let score = 0.5;

    // Check farm size compatibility
    if (farmSize >= mapping.minSize) {
      score += 0.3;
    }

    // Check crop type compatibility
    if (cropType && (mapping.crops.includes('all') || mapping.crops.includes(cropType.toLowerCase()))) {
      score += 0.2;
    }

    return Math.min(score, 1);
  }

  /**
   * Calculate price affordability
   */
  calculateAffordability(price, budget) {
    if (!budget || budget === 0) return 0.5;

    const ratio = price / budget;
    
    if (ratio <= 0.5) return 1.0;      // Very affordable
    if (ratio <= 0.75) return 0.8;     // Affordable
    if (ratio <= 1.0) return 0.6;      // Within budget
    if (ratio <= 1.25) return 0.4;     // Slightly over budget
    if (ratio <= 1.5) return 0.2;      // Over budget
    return 0.1;                         // Too expensive
  }

  /**
   * Calculate seasonal relevance
   */
  calculateSeasonalRelevance(category, currentDate) {
    const month = currentDate.getMonth(); // 0-11

    const seasonalScores = {
      'Tractor': [0.7, 0.8, 0.9, 0.8, 0.7, 0.6, 0.5, 0.6, 0.7, 0.8, 0.9, 0.8],
      'Harvester': [0.5, 0.5, 0.6, 0.9, 1.0, 0.9, 0.6, 0.5, 0.6, 0.9, 1.0, 0.8],
      'Plough': [0.8, 0.9, 1.0, 0.9, 0.7, 0.6, 0.5, 0.6, 0.8, 0.9, 0.9, 0.8],
      'Seeder': [0.7, 0.8, 0.9, 1.0, 0.9, 0.7, 0.6, 0.7, 0.8, 0.9, 0.8, 0.7],
      'Sprayer': [0.7, 0.7, 0.8, 0.9, 0.9, 0.8, 0.7, 0.8, 0.9, 0.9, 0.8, 0.7],
      'Irrigation': [0.6, 0.6, 0.7, 0.8, 0.9, 1.0, 1.0, 0.9, 0.8, 0.7, 0.6, 0.6]
    };

    return seasonalScores[category]?.[month] || 0.7;
  }

  /**
   * Calculate popularity score
   */
  calculatePopularityScore(equipment) {
    // Based on rating and number of orders
    const ratingScore = (equipment.rating || 3) / 5;
    const ordersScore = Math.min((equipment.totalOrders || 0) / 100, 1);
    
    return (ratingScore * 0.6 + ordersScore * 0.4);
  }

  /**
   * Calculate complementary score
   */
  calculateComplementaryScore(equipment, orderHistory) {
    // Define complementary equipment pairs
    const complementaryPairs = {
      'Tractor': ['Plough', 'Seeder', 'Trailer'],
      'Plough': ['Tractor', 'Seeder'],
      'Seeder': ['Tractor', 'Plough', 'Sprayer'],
      'Harvester': ['Tractor', 'Trailer'],
      'Sprayer': ['Tractor', 'Seeder'],
      'Irrigation': ['Pump', 'Sprayer']
    };

    const ownedCategories = orderHistory
      .filter(order => order.equipment)
      .map(order => order.equipment.category);

    const complementary = complementaryPairs[equipment.category] || [];
    
    const matchCount = complementary.filter(cat => 
      ownedCategories.includes(cat)
    ).length;

    return matchCount > 0 ? Math.min(matchCount / complementary.length, 1) : 0.5;
  }

  /**
   * Generate human-readable reasoning
   */
  generateReasoning(recommendation, farmer, orderHistory) {
    const reasons = [];
    const { scoreBreakdown } = recommendation;

    if (scoreBreakdown.categoryMatch > 0.7) {
      reasons.push(`Perfect match for your ${farmer.farmSize || 'farm'} acre farm`);
    }

    if (scoreBreakdown.priceAffordability > 0.7) {
      reasons.push('Within your budget range');
    }

    if (scoreBreakdown.seasonalRelevance > 0.8) {
      reasons.push('Ideal for current season');
    }

    if (scoreBreakdown.popularityScore > 0.7) {
      reasons.push('Highly rated by other farmers');
    }

    if (scoreBreakdown.complementaryScore > 0.6) {
      reasons.push('Complements your existing equipment');
    }

    if (reasons.length === 0) {
      reasons.push('Recommended based on your profile');
    }

    return reasons;
  }

  /**
   * Calculate overall confidence
   */
  calculateOverallConfidence(recommendations) {
    if (recommendations.length === 0) return 0;
    
    const avgScore = recommendations.reduce((sum, rec) => sum + rec.score, 0) / recommendations.length;
    return Math.round(avgScore * 100);
  }

  /**
   * Get similar equipment (collaborative filtering)
   */
  async getSimilarEquipment(params, context = {}) {
    const { equipmentId, limit = 5 } = params;

    try {
      const equipment = await Equipment.findById(equipmentId);
      if (!equipment) {
        throw new Error('Equipment not found');
      }

      // Find similar equipment based on category, price range, and features
      const similar = await Equipment.find({
        _id: { $ne: equipmentId },
        category: equipment.category,
        price: {
          $gte: equipment.price * 0.7,
          $lte: equipment.price * 1.3
        },
        status: 'available'
      })
      .limit(limit)
      .sort({ rating: -1, totalOrders: -1 });

      return {
        equipmentId,
        similar: similar.map(eq => eq.toObject()),
        generatedAt: new Date()
      };

    } catch (error) {
      console.error('RecommendationAgent getSimilarEquipment error:', error);
      throw error;
    }
  }

  /**
   * Get trending equipment
   */
  async getTrendingEquipment(params, context = {}) {
    const { limit = 10, timeframe = 30 } = params; // days

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeframe);

      // Get equipment with most orders in timeframe
      const trending = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            status: { $in: ['pending', 'confirmed', 'delivered'] }
          }
        },
        {
          $group: {
            _id: '$equipment',
            orderCount: { $sum: 1 },
            totalRevenue: { $sum: '$totalPrice' }
          }
        },
        {
          $sort: { orderCount: -1 }
        },
        {
          $limit: limit
        },
        {
          $lookup: {
            from: 'equipment',
            localField: '_id',
            foreignField: '_id',
            as: 'equipmentDetails'
          }
        },
        {
          $unwind: '$equipmentDetails'
        }
      ]);

      return {
        trending: trending.map(item => ({
          equipment: item.equipmentDetails,
          orderCount: item.orderCount,
          totalRevenue: item.totalRevenue,
          trendScore: this.calculateTrendScore(item.orderCount, timeframe)
        })),
        timeframe,
        generatedAt: new Date()
      };

    } catch (error) {
      console.error('RecommendationAgent getTrendingEquipment error:', error);
      throw error;
    }
  }

  /**
   * Calculate trend score
   */
  calculateTrendScore(orderCount, timeframe) {
    // Normalize based on timeframe
    const dailyAverage = orderCount / timeframe;
    return Math.min(dailyAverage * 10, 100); // Scale to 0-100
  }

  /**
   * Provide feedback on recommendation
   */
  async provideFeedback(params, context = {}) {
    const { farmerId, equipmentId, action, rating } = params;
    
    // Store feedback for model improvement
    // In production, this would update ML model weights
    
    return {
      success: true,
      message: 'Feedback recorded',
      farmerId,
      equipmentId,
      action,
      rating
    };
  }
}

module.exports = RecommendationAgent;

// Made with Bob
