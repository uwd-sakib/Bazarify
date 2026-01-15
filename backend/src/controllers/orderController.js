import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';

// @desc    Get all orders for a shop
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const shopId = req.user.shopId;

    // Build query
    const query = { shopId };
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const orders = await Order.find(query)
      .populate('customerId', 'name phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'অর্ডার লোড করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name phone email address')
      .populate('items.productId', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'অর্ডার খুঁজে পাওয়া যায়নি'
      });
    }

    // Check if order belongs to user's shop
    if (order.shopId.toString() !== req.user.shopId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'আপনার এই অর্ডারে প্রবেশাধিকার নেই'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'অর্ডার লোড করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { customerId, items, notes } = req.body;
    const shopId = req.user.shopId;

    // Verify customer belongs to shop
    const customer = await Customer.findOne({ _id: customerId, shopId });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'গ্রাহক খুঁজে পাওয়া যায়নি'
      });
    }

    // Process order items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findOne({ _id: item.productId, shopId });
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `পণ্য খুঁজে পাওয়া যায়নি: ${item.productId}`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} - পর্যাপ্ত স্টক নেই`
        });
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Generate order number
    const orderCount = await Order.countDocuments({ shopId });
    const orderNumber = `ORD-${Date.now()}-${orderCount + 1}`;

    // Create order
    const order = await Order.create({
      orderNumber,
      customerId,
      customerName: customer.name,
      customerPhone: customer.phone,
      items: orderItems,
      totalAmount,
      notes,
      shopId
    });

    res.status(201).json({
      success: true,
      message: 'অর্ডার সফলভাবে তৈরি হয়েছে',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'অর্ডার তৈরি করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'অর্ডার খুঁজে পাওয়া যায়নি'
      });
    }

    // Check if order belongs to user's shop
    if (order.shopId.toString() !== req.user.shopId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'আপনার এই অর্ডার আপডেট করার অধিকার নেই'
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'অর্ডার স্ট্যাটাস আপডেট হয়েছে',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'অর্ডার আপডেট করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'অর্ডার খুঁজে পাওয়া যায়নি'
      });
    }

    // Check if order belongs to user's shop
    if (order.shopId.toString() !== req.user.shopId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'আপনার এই অর্ডার মুছে ফেলার অধিকার নেই'
      });
    }

    // Restore product stock if order is not delivered
    if (order.status !== 'delivered') {
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'অর্ডার সফলভাবে মুছে ফেলা হয়েছে'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'অর্ডার মুছে ফেলতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};
