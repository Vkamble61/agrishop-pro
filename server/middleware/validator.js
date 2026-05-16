const { logger } = require('../utils/logger');

// Generic validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      logger.warn('Validation failed', {
        path: req.path,
        errors
      });

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};

// Sanitize input to prevent XSS
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return obj
        .replace(/[<>]/g, '')
        .trim();
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized = {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  
  if (req.query) {
    req.query = sanitize(req.query);
  }
  
  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
};

// Validate MongoDB ObjectId
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;

    if (!objectIdPattern.test(id)) {
      logger.warn('Invalid ObjectId', {
        path: req.path,
        paramName,
        value: id
      });

      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format`
      });
    }

    next();
  };
};

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Indian format)
const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// Validate password strength
const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Rate limiting per user
const userRateLimit = new Map();

const rateLimitByUser = (maxRequests = 100, windowMs = 900000) => {
  return (req, res, next) => {
    const userId = req.user?.id || req.ip;
    const now = Date.now();
    
    if (!userRateLimit.has(userId)) {
      userRateLimit.set(userId, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    const userLimit = userRateLimit.get(userId);
    
    if (now > userLimit.resetTime) {
      userRateLimit.set(userId, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (userLimit.count >= maxRequests) {
      logger.warn('Rate limit exceeded', {
        userId,
        path: req.path
      });

      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }
    
    userLimit.count++;
    next();
  };
};

// Clean up rate limit map periodically
setInterval(() => {
  const now = Date.now();
  for (const [userId, data] of userRateLimit.entries()) {
    if (now > data.resetTime) {
      userRateLimit.delete(userId);
    }
  }
}, 60000); // Clean every minute

// Validate file upload
const validateFileUpload = (allowedTypes = [], maxSize = 5242880) => {
  return (req, res, next) => {
    if (!req.file && !req.files) {
      return next();
    }

    const files = req.files || [req.file];
    
    for (const file of files) {
      if (file.size > maxSize) {
        logger.warn('File size exceeded', {
          filename: file.originalname,
          size: file.size,
          maxSize
        });

        return res.status(400).json({
          success: false,
          message: `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`
        });
      }

      if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
        logger.warn('Invalid file type', {
          filename: file.originalname,
          mimetype: file.mimetype,
          allowedTypes
        });

        return res.status(400).json({
          success: false,
          message: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
        });
      }
    }

    next();
  };
};

// Validate pagination parameters
const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (page < 1) {
    return res.status(400).json({
      success: false,
      message: 'Page number must be greater than 0'
    });
  }

  if (limit < 1 || limit > 100) {
    return res.status(400).json({
      success: false,
      message: 'Limit must be between 1 and 100'
    });
  }

  req.pagination = {
    page,
    limit,
    skip: (page - 1) * limit
  };

  next();
};

// Validate sort parameters
const validateSort = (allowedFields = []) => {
  return (req, res, next) => {
    const sortBy = req.query.sortBy;
    
    if (!sortBy) {
      return next();
    }

    const field = sortBy.startsWith('-') ? sortBy.substring(1) : sortBy;
    
    if (allowedFields.length > 0 && !allowedFields.includes(field)) {
      return res.status(400).json({
        success: false,
        message: `Invalid sort field. Allowed fields: ${allowedFields.join(', ')}`
      });
    }

    next();
  };
};

// Validate date range
const validateDateRange = (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (startDate && isNaN(Date.parse(startDate))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid start date format'
    });
  }

  if (endDate && isNaN(Date.parse(endDate))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid end date format'
    });
  }

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({
      success: false,
      message: 'Start date must be before end date'
    });
  }

  next();
};

module.exports = {
  validate,
  sanitizeInput,
  validateObjectId,
  validateEmail,
  validatePhone,
  validatePassword,
  rateLimitByUser,
  validateFileUpload,
  validatePagination,
  validateSort,
  validateDateRange
};

// Made with Bob
