const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const currentLogLevel = process.env.LOG_LEVEL || 'info';

class Logger {
  constructor() {
    this.logFile = process.env.LOG_FILE || path.join(logsDir, 'app.log');
    this.errorLogFile = path.join(logsDir, 'error.log');
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaString = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${metaString}\n`;
  }

  writeToFile(filename, message) {
    try {
      fs.appendFileSync(filename, message);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  shouldLog(level) {
    return logLevels[level] <= logLevels[currentLogLevel];
  }

  error(message, meta = {}) {
    if (this.shouldLog('error')) {
      const formattedMessage = this.formatMessage('error', message, meta);
      console.error(formattedMessage);
      this.writeToFile(this.errorLogFile, formattedMessage);
      this.writeToFile(this.logFile, formattedMessage);
    }
  }

  warn(message, meta = {}) {
    if (this.shouldLog('warn')) {
      const formattedMessage = this.formatMessage('warn', message, meta);
      console.warn(formattedMessage);
      this.writeToFile(this.logFile, formattedMessage);
    }
  }

  info(message, meta = {}) {
    if (this.shouldLog('info')) {
      const formattedMessage = this.formatMessage('info', message, meta);
      console.log(formattedMessage);
      this.writeToFile(this.logFile, formattedMessage);
    }
  }

  debug(message, meta = {}) {
    if (this.shouldLog('debug')) {
      const formattedMessage = this.formatMessage('debug', message, meta);
      console.log(formattedMessage);
      this.writeToFile(this.logFile, formattedMessage);
    }
  }

  // Log HTTP requests
  logRequest(req) {
    const message = `${req.method} ${req.originalUrl}`;
    const meta = {
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user?.id
    };
    this.info(message, meta);
  }

  // Log HTTP responses
  logResponse(req, res, responseTime) {
    const message = `${req.method} ${req.originalUrl} - ${res.statusCode}`;
    const meta = {
      responseTime: `${responseTime}ms`,
      userId: req.user?.id
    };
    
    if (res.statusCode >= 500) {
      this.error(message, meta);
    } else if (res.statusCode >= 400) {
      this.warn(message, meta);
    } else {
      this.info(message, meta);
    }
  }

  // Log database operations
  logDatabase(operation, collection, meta = {}) {
    const message = `Database ${operation} on ${collection}`;
    this.debug(message, meta);
  }

  // Log authentication events
  logAuth(event, userId, meta = {}) {
    const message = `Auth event: ${event}`;
    this.info(message, { userId, ...meta });
  }

  // Rotate logs (call this periodically, e.g., daily)
  rotateLogs() {
    const timestamp = new Date().toISOString().split('T')[0];
    
    try {
      if (fs.existsSync(this.logFile)) {
        const archiveFile = path.join(logsDir, `app-${timestamp}.log`);
        fs.renameSync(this.logFile, archiveFile);
      }
      
      if (fs.existsSync(this.errorLogFile)) {
        const archiveFile = path.join(logsDir, `error-${timestamp}.log`);
        fs.renameSync(this.errorLogFile, archiveFile);
      }
      
      this.info('Log rotation completed');
    } catch (error) {
      console.error('Failed to rotate logs:', error);
    }
  }

  // Clean old logs (keep last 30 days)
  cleanOldLogs(daysToKeep = 30) {
    try {
      const files = fs.readdirSync(logsDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      files.forEach(file => {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime < cutoffDate && file !== 'app.log' && file !== 'error.log') {
          fs.unlinkSync(filePath);
          this.info(`Deleted old log file: ${file}`);
        }
      });
    } catch (error) {
      console.error('Failed to clean old logs:', error);
    }
  }
}

// Create singleton instance
const logger = new Logger();

// Request logging middleware
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  logger.logRequest(req);
  
  // Log response when finished
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    logger.logResponse(req, res, responseTime);
  });
  
  next();
};

module.exports = { logger, requestLogger };

// Made with Bob
