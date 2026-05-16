const express = require('express');
const {
  getAllSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierStats
} = require('../controllers/supplierController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// Routes
router.get('/stats/overview', getSupplierStats);
router.get('/', getAllSuppliers);
router.get('/:id', getSupplier);
router.post('/', createSupplier);
router.put('/:id', updateSupplier);
router.delete('/:id', deleteSupplier);

module.exports = router;

// Made with Bob
