/**
 * AI Agent Orchestrator
 * Coordinates all AI agents and manages their lifecycle
 */

const EventEmitter = require('events');

class AIOrchestrator extends EventEmitter {
  constructor() {
    super();
    this.agents = new Map();
    this.activeRequests = new Map();
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0
    };
  }

  /**
   * Register an AI agent
   */
  registerAgent(name, agent) {
    if (this.agents.has(name)) {
      throw new Error(`Agent ${name} is already registered`);
    }
    
    this.agents.set(name, {
      instance: agent,
      status: 'active',
      requestCount: 0,
      errorCount: 0,
      lastUsed: null
    });
    
    console.log(`✅ AI Agent registered: ${name}`);
    this.emit('agent:registered', { name });
  }

  /**
   * Execute an agent task
   */
  async executeAgent(agentName, method, params, context = {}) {
    const startTime = Date.now();
    const requestId = `${agentName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Check if agent exists
      const agentData = this.agents.get(agentName);
      if (!agentData) {
        throw new Error(`Agent ${agentName} not found`);
      }

      // Check if agent is active
      if (agentData.status !== 'active') {
        throw new Error(`Agent ${agentName} is not active (status: ${agentData.status})`);
      }

      // Track active request
      this.activeRequests.set(requestId, {
        agentName,
        method,
        startTime,
        context
      });

      // Execute agent method
      const agent = agentData.instance;
      if (typeof agent[method] !== 'function') {
        throw new Error(`Method ${method} not found on agent ${agentName}`);
      }

      const result = await agent[method](params, context);

      // Update metrics
      const responseTime = Date.now() - startTime;
      this.updateMetrics(agentName, true, responseTime);

      // Clean up
      this.activeRequests.delete(requestId);

      this.emit('agent:success', {
        requestId,
        agentName,
        method,
        responseTime,
        result
      });

      return {
        success: true,
        data: result,
        metadata: {
          requestId,
          agentName,
          method,
          responseTime
        }
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.updateMetrics(agentName, false, responseTime);
      this.activeRequests.delete(requestId);

      this.emit('agent:error', {
        requestId,
        agentName,
        method,
        error: error.message,
        responseTime
      });

      return {
        success: false,
        error: error.message,
        metadata: {
          requestId,
          agentName,
          method,
          responseTime
        }
      };
    }
  }

  /**
   * Update agent metrics
   */
  updateMetrics(agentName, success, responseTime) {
    this.metrics.totalRequests++;
    
    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
    }

    // Update average response time
    const totalTime = this.metrics.averageResponseTime * (this.metrics.totalRequests - 1);
    this.metrics.averageResponseTime = (totalTime + responseTime) / this.metrics.totalRequests;

    // Update agent-specific metrics
    const agentData = this.agents.get(agentName);
    if (agentData) {
      agentData.requestCount++;
      agentData.lastUsed = new Date();
      if (!success) {
        agentData.errorCount++;
      }
    }
  }

  /**
   * Get agent status
   */
  getAgentStatus(agentName) {
    const agentData = this.agents.get(agentName);
    if (!agentData) {
      return null;
    }

    return {
      name: agentName,
      status: agentData.status,
      requestCount: agentData.requestCount,
      errorCount: agentData.errorCount,
      errorRate: agentData.requestCount > 0 
        ? (agentData.errorCount / agentData.requestCount * 100).toFixed(2) + '%'
        : '0%',
      lastUsed: agentData.lastUsed
    };
  }

  /**
   * Get all agents status
   */
  getAllAgentsStatus() {
    const statuses = [];
    for (const [name] of this.agents) {
      statuses.push(this.getAgentStatus(name));
    }
    return statuses;
  }

  /**
   * Get orchestrator metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      activeRequests: this.activeRequests.size,
      registeredAgents: this.agents.size,
      successRate: this.metrics.totalRequests > 0
        ? (this.metrics.successfulRequests / this.metrics.totalRequests * 100).toFixed(2) + '%'
        : '0%'
    };
  }

  /**
   * Enable/disable an agent
   */
  setAgentStatus(agentName, status) {
    const agentData = this.agents.get(agentName);
    if (!agentData) {
      throw new Error(`Agent ${agentName} not found`);
    }

    agentData.status = status;
    this.emit('agent:status_changed', { agentName, status });
    console.log(`🔄 Agent ${agentName} status changed to: ${status}`);
  }

  /**
   * Unregister an agent
   */
  unregisterAgent(agentName) {
    if (!this.agents.has(agentName)) {
      throw new Error(`Agent ${agentName} not found`);
    }

    this.agents.delete(agentName);
    this.emit('agent:unregistered', { agentName });
    console.log(`❌ Agent unregistered: ${agentName}`);
  }

  /**
   * Get active requests
   */
  getActiveRequests() {
    const requests = [];
    for (const [requestId, data] of this.activeRequests) {
      requests.push({
        requestId,
        ...data,
        duration: Date.now() - data.startTime
      });
    }
    return requests;
  }
}

// Singleton instance
const orchestrator = new AIOrchestrator();

module.exports = orchestrator;

// Made with Bob
