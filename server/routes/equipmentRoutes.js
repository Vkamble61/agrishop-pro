const express = require('express');
const {
  getAllEquipment,
  getEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getCategories,
  getBrands,
  getFeaturedEquipment
} = require('../controllers/equipmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllEquipment);
router.get('/categories/list', getCategories);
router.get('/brands/list', getBrands);
router.get('/featured/list', getFeaturedEquipment);
router.get('/:id', getEquipment);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createEquipment);
router.put('/:id', protect, authorize('admin'), updateEquipment);
router.delete('/:id', protect, authorize('admin'), deleteEquipment);

module.exports = router;

// Made with Bob
