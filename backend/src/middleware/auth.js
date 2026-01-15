import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'অনুমতি নেই। দয়া করে লগইন করুন'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user || !req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'অনুমতি নেই। টোকেন সঠিক নয়'
    });
  }
};

// Middleware to check if user is merchant
export const isMerchant = (req, res, next) => {
  if (req.user && (req.user.role === 'merchant' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'শুধুমাত্র ব্যবসায়ীদের জন্য'
    });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'শুধুমাত্র অ্যাডমিনদের জন্য'
    });
  }
};

// Generate JWT Token
export const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpire
  });
};
