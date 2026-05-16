const Order = require('../models/Order');
const Equipment = require('../models/Equipment');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { items, paymentMethod, emiDetails, deliveryAddress, customerNotes } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please add items to order'
      });
    }

    // Calculate total and validate equipment availability
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const equipment = await Equipment.findById(item.equipment);

      if (!equipment) {
        return res.status(404).json({
          success: false,
          message: `Equipment with id ${item.equipment} not found`
        });
      }

      if (!equipment.inStock || equipment.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${equipment.name} is out of stock or insufficient quantity`
        });
      }

      const subtotal = equipment.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        equipment: equipment._id,
        name: equipment.name,
        quantity: item.quantity,
        price: equipment.price,
        subtotal
      });

      // Update equipment quantity
      equipment.quantity -= item.quantity;
      await equipment.save();
    }

    // Create order
    const order = await Order.create({
      customer: req.user.id,
      items: orderItems,
      totalAmount,
      paymentMethod,
      emiDetails,
      deliveryAddress: deliveryAddress || {
        village: req.user.village,
        district: req.user.district,
        state: req.user.state
      },
      customerNotes
    });

    // Calculate and update loyalty points
    const loyaltyPoints = order.calculateLoyaltyPoints();
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { loyaltyPoints: loyaltyPoints }
    });

    // Populate order details
    await order.populate('customer', 'name email phone village');
    await order.populate('items.equipment', 'name brand category');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, sort = '-createdAt' } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate('customer', 'name email phone village')
      .populate('items.equipment', 'name brand')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { customer: req.user.id };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate('items.equipment', 'name brand category images')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone village district state')
      .populate('items.equipment', 'name brand category images specifications');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order or is admin
    if (order.customer._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await order.updateStatus(status, note);

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.customer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`
      });
    }

    // Restore equipment quantities
    for (const item of order.items) {
      await Equipment.findByIdAndUpdate(item.equipment, {
        $inc: { quantity: item.quantity }
      });
    }

    await order.updateStatus('cancelled', req.body.reason || 'Cancelled by user');

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order statistics (Admin)
// @route   GET /api/orders/stats/overview
// @access  Private/Admin
exports.getOrderStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    
    const revenueResult = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;

// Made with Bob
