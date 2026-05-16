const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

// Basic health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Detailed health check with dependencies
router.get('/health/detailed', async (req, res) => {
  const health = {
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    services: {}
  };

  // Check database connection
  try {
    const dbState = mongoose.connection.readyState;
    const dbStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    health.services.database = {
      status: dbState === 1 ? 'healthy' : 'unhealthy',
      state: dbStates[dbState],
      host: mongoose.connection.host,
      name: mongoose.connection.name
    };

    if (dbState !== 1) {
      health.success = false;
      health.status = 'unhealthy';
    }
  } catch (error) {
    health.services.database = {
      status: 'unhealthy',
      error: error.message
    };
    health.success = false;
    health.status = 'unhealthy';
  }

  // Check memory usage
  const memoryUsage = process.memoryUsage();
  health.services.memory = {
    status: 'healthy',
    rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
    external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
  };

  // Check CPU usage
  const cpuUsage = process.cpuUsage();
  health.services.cpu = {
    status: 'healthy',
    user: cpuUsage.user,
    system: cpuUsage.system
  };

  // Log health check
  if (!health.success) {
    logger.error('Health check failed', health);
  }

  const statusCode = health.success ? 200 : 503;
  res.status(statusCode).json(health);
});

// Readiness probe (for Kubernetes/Docker)
router.get('/ready', async (req, res) => {
  try {
    // Check if database is ready
    const dbState = mongoose.connection.readyState;
    
    if (dbState !== 1) {
      return res.status(503).json({
        success: false,
        status: 'not ready',
        message: 'Database not connected'
      });
    }

    // Check if we can perform a simple database operation
    await mongoose.connection.db.admin().ping();

    res.status(200).json({
      success: true,
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Readiness check failed', { error: error.message });
    res.status(503).json({
      success: false,
      status: 'not ready',
      error: error.message
    });
  }
});

// Liveness probe (for Kubernetes/Docker)
router.get('/live', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'alive',
    timestamp: new Date().toISOString()
  });
});

// System metrics
router.get('/metrics', (req, res) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    platform: process.platform,
    nodeVersion: process.version,
    pid: process.pid
  };

  res.status(200).json({
    success: true,
    data: metrics
  });
});

// API version info
router.get('/version', (req, res) => {
  const packageJson = require('../../package.json');
  
  res.status(200).json({
    success: true,
    data: {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      environment: process.env.NODE_ENV,
      nodeVersion: process.version
    }
  });
});

module.exports = router;

// Made with Bob
