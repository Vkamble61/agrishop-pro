/**
 * AI Agent Routes
 * Exposes AI agent functionality through REST API
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// Recommendation Agent Routes
router.post('/recommendations/equipment', protect, aiController.getEquipmentRecommendations);
router.get('/recommendations/farmer/:farmerId', protect, aiController.getFarmerRecommendations);
router.post('/recommendations/feedback', protect, aiController.submitRecommendationFeedback);
router.get('/recommendations/similar/:equipmentId', aiController.getSimilarEquipment);
router.get('/recommendations/trending', aiController.getTrendingEquipment);

// AI Orchestrator Management Routes (Admin only)
router.get('/agents/status', protect, aiController.getAgentsStatus);
router.get('/agents/metrics', protect, aiController.getOrchestratorMetrics);
router.post('/agents/:agentName/status', protect, aiController.setAgentStatus);
router.get('/agents/active-requests', protect, aiController.getActiveRequests);

// Health check for AI services
router.get('/health', aiController.healthCheck);

module.exports = router;

// Made with Bob
