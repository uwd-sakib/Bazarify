import User from '../models/User.js';
import Shop from '../models/Shop.js';
import { generateToken } from '../middleware/auth.js';

// @desc    Register new merchant
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, shopName, phone, address } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'এই ইমেইল দিয়ে ইতিমধ্যে একাউন্ট রয়েছে'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: 'merchant'
    });

    // Create shop for the merchant
    const shop = await Shop.create({
      shopName,
      ownerId: user._id,
      phone,
      address
    });

    // Update user with shopId
    user.shopId = shop._id;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'সফলভাবে নিবন্ধন সম্পন্ন হয়েছে',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          shopId: user.shopId
        },
        shop: {
          id: shop._id,
          shopName: shop.shopName
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'নিবন্ধন ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'ভুল ইমেইল বা পাসওয়ার্ড'
      });
    }

    // Check if password matches
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'ভুল ইমেইল বা পাসওয়ার্ড'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'আপনার একাউন্ট নিষ্ক্রিয় করা হয়েছে'
      });
    }

    // Get shop info if merchant
    let shopInfo = null;
    if (user.shopId) {
      const shop = await Shop.findById(user.shopId);
      shopInfo = {
        id: shop._id,
        shopName: shop.shopName
      };
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'সফলভাবে লগইন হয়েছে',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          shopId: user.shopId
        },
        shop: shopInfo,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'লগইন ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    let shopInfo = null;
    if (user.shopId) {
      const shop = await Shop.findById(user.shopId);
      shopInfo = {
        id: shop._id,
        shopName: shop.shopName,
        phone: shop.phone,
        address: shop.address
      };
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          shopId: user.shopId
        },
        shop: shopInfo
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'তথ্য লোড করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'বর্তমান পাসওয়ার্ড সঠিক নয়'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};
