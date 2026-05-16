const Equipment = require('../models/Equipment');

// @desc    Get all equipment
// @route   GET /api/equipment
// @access  Public
exports.getAllEquipment = async (req, res, next) => {
  try {
    const { category, brand, minPrice, maxPrice, inStock, search, sort, page = 1, limit = 12 } = req.query;

    // Build query
    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (brand) {
      query.brand = brand;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (inStock === 'true') {
      query.inStock = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    let sortOption = {};
    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else if (sort === 'name') {
      sortOption = { name: 1 };
    } else if (sort === 'rating') {
      sortOption = { averageRating: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const equipment = await Equipment.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate('supplier', 'name contact');

    // Get total count for pagination
    const total = await Equipment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: equipment.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: equipment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single equipment
// @route   GET /api/equipment/:id
// @access  Public
exports.getEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate('supplier', 'name contact email');

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: equipment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create equipment
// @route   POST /api/equipment
// @access  Private/Admin
exports.createEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Equipment created successfully',
      data: equipment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Private/Admin
exports.updateEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Equipment updated successfully',
      data: equipment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
// @access  Private/Admin
exports.deleteEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    // Soft delete - just mark as inactive
    equipment.isActive = false;
    await equipment.save();

    res.status(200).json({
      success: true,
      message: 'Equipment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get equipment categories
// @route   GET /api/equipment/categories/list
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Equipment.distinct('category', { isActive: true });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get equipment brands
// @route   GET /api/equipment/brands/list
// @access  Public
exports.getBrands = async (req, res, next) => {
  try {
    const brands = await Equipment.distinct('brand', { isActive: true });

    res.status(200).json({
      success: true,
      data: brands
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured equipment
// @route   GET /api/equipment/featured/list
// @access  Public
exports.getFeaturedEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.find({ 
      isActive: true, 
      isFeatured: true,
      inStock: true 
    })
      .limit(6)
      .sort({ averageRating: -1 });

    res.status(200).json({
      success: true,
      count: equipment.length,
      data: equipment
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;

// Made with Bob
