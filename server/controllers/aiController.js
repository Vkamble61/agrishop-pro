const aiOrchestrator = require('../services/aiOrchestrator');
const RecommendationAgent = require('../agents/RecommendationAgent');

const RECOMMENDATION_AGENT_NAME = 'recommendation';

if (!aiOrchestrator.getAgentStatus(RECOMMENDATION_AGENT_NAME)) {
	aiOrchestrator.registerAgent(RECOMMENDATION_AGENT_NAME, new RecommendationAgent());
}

const buildContext = (req) => ({
	userId: req.user?._id,
	userRole: req.user?.role,
	ip: req.ip,
	userAgent: req.get('user-agent')
});

const executeRecommendation = async (method, params, req, res, next) => {
	try {
		const result = await aiOrchestrator.executeAgent(
			RECOMMENDATION_AGENT_NAME,
			method,
			params,
			buildContext(req)
		);

		if (!result.success) {
			const statusCode = result.error && result.error.toLowerCase().includes('not found') ? 404 : 400;
			return res.status(statusCode).json({
				success: false,
				message: result.error,
				metadata: result.metadata
			});
		}

		return res.status(200).json({
			success: true,
			data: result.data,
			metadata: result.metadata
		});
	} catch (error) {
		return next(error);
	}
};

// @desc    Get equipment recommendations for current/authenticated farmer
// @route   POST /api/ai/recommendations/equipment
// @access  Private
exports.getEquipmentRecommendations = async (req, res, next) => {
	const { farmerId, limit, includeReasoning } = req.body || {};

	return executeRecommendation(
		'getRecommendations',
		{
			farmerId: farmerId || req.user?._id,
			limit: Number(limit) || 5,
			includeReasoning: includeReasoning !== false
		},
		req,
		res,
		next
	);
};

// @desc    Get recommendations for a specific farmer
// @route   GET /api/ai/recommendations/farmer/:farmerId
// @access  Private
exports.getFarmerRecommendations = async (req, res, next) => {
	const { farmerId } = req.params;
	const { limit, includeReasoning } = req.query;

	return executeRecommendation(
		'getRecommendations',
		{
			farmerId,
			limit: Number(limit) || 5,
			includeReasoning: includeReasoning !== 'false'
		},
		req,
		res,
		next
	);
};

// @desc    Submit recommendation feedback
// @route   POST /api/ai/recommendations/feedback
// @access  Private
exports.submitRecommendationFeedback = async (req, res, next) => {
	const { equipmentId, action, rating, farmerId } = req.body || {};

	return executeRecommendation(
		'provideFeedback',
		{
			farmerId: farmerId || req.user?._id,
			equipmentId,
			action,
			rating
		},
		req,
		res,
		next
	);
};

// @desc    Get similar equipment suggestions
// @route   GET /api/ai/recommendations/similar/:equipmentId
// @access  Public
exports.getSimilarEquipment = async (req, res, next) => {
	const { equipmentId } = req.params;
	const { limit } = req.query;

	return executeRecommendation(
		'getSimilarEquipment',
		{
			equipmentId,
			limit: Number(limit) || 5
		},
		req,
		res,
		next
	);
};

// @desc    Get trending equipment
// @route   GET /api/ai/recommendations/trending
// @access  Public
exports.getTrendingEquipment = async (req, res, next) => {
	const { limit, timeframe } = req.query;

	return executeRecommendation(
		'getTrendingEquipment',
		{
			limit: Number(limit) || 10,
			timeframe: Number(timeframe) || 30
		},
		req,
		res,
		next
	);
};

// @desc    Get all agent statuses
// @route   GET /api/ai/agents/status
// @access  Private
exports.getAgentsStatus = async (req, res, next) => {
	try {
		const statuses = aiOrchestrator.getAllAgentsStatus();
		res.status(200).json({
			success: true,
			data: statuses
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Get orchestrator metrics
// @route   GET /api/ai/agents/metrics
// @access  Private
exports.getOrchestratorMetrics = async (req, res, next) => {
	try {
		const metrics = aiOrchestrator.getMetrics();
		res.status(200).json({
			success: true,
			data: metrics
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Change agent status
// @route   POST /api/ai/agents/:agentName/status
// @access  Private/Admin
exports.setAgentStatus = async (req, res, next) => {
	try {
		if (!req.user || req.user.role !== 'admin') {
			return res.status(403).json({
				success: false,
				message: 'Only admin can change agent status'
			});
		}

		const { agentName } = req.params;
		const { status } = req.body || {};

		if (!status || !['active', 'inactive', 'disabled'].includes(status)) {
			return res.status(400).json({
				success: false,
				message: 'Valid status is required: active, inactive, or disabled'
			});
		}

		aiOrchestrator.setAgentStatus(agentName, status);

		res.status(200).json({
			success: true,
			message: `Agent ${agentName} status updated to ${status}`,
			data: aiOrchestrator.getAgentStatus(agentName)
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Get active AI requests
// @route   GET /api/ai/agents/active-requests
// @access  Private
exports.getActiveRequests = async (req, res, next) => {
	try {
		const requests = aiOrchestrator.getActiveRequests();
		res.status(200).json({
			success: true,
			count: requests.length,
			data: requests
		});
	} catch (error) {
		next(error);
	}
};

// @desc    AI health check
// @route   GET /api/ai/health
// @access  Public
exports.healthCheck = async (req, res, next) => {
	try {
		const metrics = aiOrchestrator.getMetrics();
		res.status(200).json({
			success: true,
			status: 'healthy',
			timestamp: new Date().toISOString(),
			data: {
				orchestrator: metrics,
				agents: aiOrchestrator.getAllAgentsStatus()
			}
		});
	} catch (error) {
		next(error);
	}
};

module.exports = exports;

