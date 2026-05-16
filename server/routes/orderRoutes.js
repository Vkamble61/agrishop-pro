const express = require('express');
const {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderStats
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protected routes (All authenticated users)
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/cancel', protect, cancelOrder);

// Admin only routes
router.get('/', protect, authorize('admin'), getAllOrders);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);
router.get('/stats/overview', protect, authorize('admin'), getOrderStats);

module.exports = router;

// Made with Bob
