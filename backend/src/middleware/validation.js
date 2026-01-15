import { body, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'সঠিক তথ্য প্রদান করুন',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Validation rules
export const registerValidation = [
  body('name').trim().notEmpty().withMessage('নাম প্রয়োজন'),
  body('email').isEmail().withMessage('সঠিক ইমেইল প্রদান করুন'),
  body('password').isLength({ min: 6 }).withMessage('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'),
  body('shopName').trim().notEmpty().withMessage('দোকানের নাম প্রয়োজন')
];

export const loginValidation = [
  body('email').isEmail().withMessage('সঠিক ইমেইল প্রদান করুন'),
  body('password').notEmpty().withMessage('পাসওয়ার্ড প্রয়োজন')
];

export const productValidation = [
  body('name').trim().notEmpty().withMessage('পণ্যের নাম প্রয়োজন'),
  body('price').isNumeric().withMessage('মূল্য সংখ্যায় হতে হবে').isFloat({ min: 0 }).withMessage('মূল্য ০ বা তার বেশি হতে হবে'),
  body('stock').isInt({ min: 0 }).withMessage('স্টক ০ বা তার বেশি হতে হবে'),
  body('category').trim().notEmpty().withMessage('ক্যাটাগরি প্রয়োজন')
];

export const customerValidation = [
  body('name').trim().notEmpty().withMessage('নাম প্রয়োজন'),
  body('phone').trim().notEmpty().withMessage('ফোন নম্বর প্রয়োজন')
];

export const orderValidation = [
  body('customerId').notEmpty().withMessage('গ্রাহক নির্বাচন করুন'),
  body('items').isArray({ min: 1 }).withMessage('কমপক্ষে একটি পণ্য যোগ করুন'),
  body('items.*.productId').notEmpty().withMessage('পণ্য নির্বাচন করুন'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('পরিমাণ কমপক্ষে ১ হতে হবে')
];
