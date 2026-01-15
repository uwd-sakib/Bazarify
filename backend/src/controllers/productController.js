import Product from '../models/Product.js';

// @desc    Get all products for a shop
// @route   GET /api/products
// @access  Private
export const getProducts = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    const shopId = req.user.shopId;

    // Build query
    const query = { shopId };
    
    if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'পণ্য লোড করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'পণ্য খুঁজে পাওয়া যায়নি'
      });
    }

    // Check if product belongs to user's shop
    if (product.shopId.toString() !== req.user.shopId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'আপনার এই পণ্যে প্রবেশাধিকার নেই'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'পণ্য লোড করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private
export const createProduct = async (req, res) => {
  try {
    const { name, price, stock, category, description, status } = req.body;

    const product = await Product.create({
      name,
      price,
      stock,
      category,
      description,
      status: status || 'active',
      shopId: req.user.shopId
    });

    res.status(201).json({
      success: true,
      message: 'পণ্য সফলভাবে যোগ করা হয়েছে',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'পণ্য যোগ করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'পণ্য খুঁজে পাওয়া যায়নি'
      });
    }

    // Check if product belongs to user's shop
    if (product.shopId.toString() !== req.user.shopId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'আপনার এই পণ্য সম্পাদনা করার অধিকার নেই'
      });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'পণ্য সফলভাবে আপডেট হয়েছে',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'পণ্য আপডেট করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'পণ্য খুঁজে পাওয়া যায়নি'
      });
    }

    // Check if product belongs to user's shop
    if (product.shopId.toString() !== req.user.shopId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'আপনার এই পণ্য মুছে ফেলার অধিকার নেই'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'পণ্য সফলভাবে মুছে ফেলা হয়েছে'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'পণ্য মুছে ফেলতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

// @desc    Get product categories
// @route   GET /api/products/categories/list
// @access  Private
export const getCategories = async (req, res) => {
  try {
    const shopId = req.user.shopId;
    
    const categories = await Product.distinct('category', { shopId });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ক্যাটাগরি লোড করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};
