const Supplier = require('../models/Supplier');

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private/Admin
exports.getAllSuppliers = async (req, res, next) => {
  try {
    const { search, category, isActive, page = 1, limit = 20, sort = '-createdAt' } = req.query;

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.categories = category;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const suppliers = await Supplier.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    // Get total count
    const total = await Supplier.countDocuments(query);

    res.status(200).json({
      success: true,
      count: suppliers.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: suppliers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single supplier
// @route   GET /api/suppliers/:id
// @access  Private/Admin
exports.getSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    res.status(200).json({
      success: true,
      data: supplier
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create supplier
// @route   POST /api/suppliers
// @access  Private/Admin
exports.createSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      data: supplier
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private/Admin
exports.updateSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Supplier updated successfully',
      data: supplier
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private/Admin
exports.deleteSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    // Soft delete
    supplier.isActive = false;
    await supplier.save();

    res.status(200).json({
      success: true,
      message: 'Supplier deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get supplier statistics
// @route   GET /api/suppliers/stats/overview
// @access  Private/Admin
exports.getSupplierStats = async (req, res, next) => {
  try {
    const totalSuppliers = await Supplier.countDocuments({ isActive: true });
    const verifiedSuppliers = await Supplier.countDocuments({ isActive: true, isVerified: true });
    
    const purchaseStats = await Supplier.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalPurchases: { $sum: '$totalPurchases' },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const topSuppliers = await Supplier.find({ isActive: true })
      .sort('-totalAmount')
      .limit(5)
      .select('name companyName totalAmount totalPurchases');

    res.status(200).json({
      success: true,
      data: {
        totalSuppliers,
        verifiedSuppliers,
        totalPurchases: purchaseStats[0]?.totalPurchases || 0,
        totalAmount: purchaseStats[0]?.totalAmount || 0,
        topSuppliers
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;

// Made with Bob
