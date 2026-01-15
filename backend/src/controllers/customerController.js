import Customer from '../models/Customer.js';
import Order from '../models/Order.js';

export const getCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    const shopId = req.user.shopId;

    const query = { shopId };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await Customer.find(query).sort({ createdAt: -1 });

    const customersWithStats = await Promise.all(customers.map(async (customer) => {
      const totalOrders = await Order.countDocuments({ customerId: customer._id });
      const totalSpentData = await Order.aggregate([
        { $match: { customerId: customer._id, status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);
      const totalSpent = totalSpentData[0]?.total || 0;

      return {
        ...customer.toObject(),
        orderCount: totalOrders,
        totalSpent
      };
    }));

    res.status(200).json({
      success: true,
      count: customersWithStats.length,
      data: customersWithStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'গ্রাহক লোড করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

// @desc    Get single customer with order history
// @route   GET /api/customers/:id
// @access  Private
export const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'গ্রাহক খুঁজে পাওয়া যায়নি'
      });
    }

    // Check if customer belongs to user's shop
    if (customer.shopId.toString() !== req.user.shopId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'আপনার এই গ্রাহকে প্রবেশাধিকার নেই'
      });
    }

    // Get customer's order history
    const orders = await Order.find({ customerId: customer._id })
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate customer statistics
    const totalOrders = await Order.countDocuments({ customerId: customer._id });
    const totalSpent = await Order.aggregate([
      { $match: { customerId: customer._id, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        customer,
        orders,
        statistics: {
          totalOrders,
          totalSpent: totalSpent[0]?.total || 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'গ্রাহক লোড করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
export const createCustomer = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;

    // Check if customer with same phone exists in this shop
    const existingCustomer = await Customer.findOne({
      phone,
      shopId: req.user.shopId
    });

    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'এই ফোন নম্বর দিয়ে ইতিমধ্যে গ্রাহক রয়েছে'
      });
    }

    const customer = await Customer.create({
      name,
      phone,
      email,
      address,
      shopId: req.user.shopId
    });

    res.status(201).json({
      success: true,
      message: 'গ্রাহক সফলভাবে যোগ করা হয়েছে',
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'গ্রাহক যোগ করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
export const updateCustomer = async (req, res) => {
  try {
    let customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'গ্রাহক খুঁজে পাওয়া যায়নি'
      });
    }

    // Check if customer belongs to user's shop
    if (customer.shopId.toString() !== req.user.shopId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'আপনার এই গ্রাহক সম্পাদনা করার অধিকার নেই'
      });
    }

    customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'গ্রাহক সফলভাবে আপডেট হয়েছে',
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'গ্রাহক আপডেট করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'গ্রাহক খুঁজে পাওয়া যায়নি'
      });
    }

    // Check if customer belongs to user's shop
    if (customer.shopId.toString() !== req.user.shopId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'আপনার এই গ্রাহক মুছে ফেলার অধিকার নেই'
      });
    }

    // Check if customer has orders
    const hasOrders = await Order.exists({ customerId: customer._id });
    if (hasOrders) {
      return res.status(400).json({
        success: false,
        message: 'এই গ্রাহকের অর্ডার রয়েছে। মুছে ফেলা যাবে না'
      });
    }

    await Customer.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'গ্রাহক সফলভাবে মুছে ফেলা হয়েছে'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'গ্রাহক মুছে ফেলতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};
