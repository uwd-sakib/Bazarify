import Shop from '../models/Shop.js';
import User from '../models/User.js';

// @desc    Get shop information
// @route   GET /api/shop
// @access  Private
export const getShopInfo = async (req, res) => {
  try {
    const shop = await Shop.findById(req.user.shopId);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'দোকান খুঁজে পাওয়া যায়নি'
      });
    }

    res.status(200).json({
      success: true,
      data: shop
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'দোকানের তথ্য লোড করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

// @desc    Update shop information
// @route   PUT /api/shop
// @access  Private
export const updateShopInfo = async (req, res) => {
  try {
    const { shopName, phone, address, description } = req.body;

    const shop = await Shop.findByIdAndUpdate(
      req.user.shopId,
      { shopName, phone, address, description },
      { new: true, runValidators: true }
    );

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'দোকান খুঁজে পাওয়া যায়নি'
      });
    }

    res.status(200).json({
      success: true,
      message: 'দোকানের তথ্য সফলভাবে আপডেট হয়েছে',
      data: shop
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'দোকানের তথ্য আপডেট করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/shop/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if email is already taken by another user
    if (email !== req.user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'এই ইমেইল ইতিমধ্যে ব্যবহৃত হচ্ছে'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'প্রোফাইল সফলভাবে আপডেট হয়েছে',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};
