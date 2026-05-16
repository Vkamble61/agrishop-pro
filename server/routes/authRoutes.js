const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone number is required'),
  body('village').if(body('role').equals('farmer')).notEmpty().withMessage('Village is required for farmers'),
  body('district').if(body('role').equals('farmer')).notEmpty().withMessage('District is required for farmers'),
  body('state').if(body('role').equals('farmer')).notEmpty().withMessage('State is required for farmers')
];

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;

// Made with Bob
