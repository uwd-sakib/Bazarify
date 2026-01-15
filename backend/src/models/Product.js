import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'পণ্যের নাম প্রয়োজন'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'মূল্য প্রয়োজন'],
    min: [0, 'মূল্য ০ বা তার বেশি হতে হবে']
  },
  stock: {
    type: Number,
    required: [true, 'স্টক সংখ্যা প্রয়োজন'],
    min: [0, 'স্টক ০ বা তার বেশি হতে হবে'],
    default: 0
  },
  category: {
    type: String,
    required: [true, 'ক্যাটাগরি প্রয়োজন'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
productSchema.index({ shopId: 1, status: 1 });
productSchema.index({ shopId: 1, category: 1 });

export default mongoose.model('Product', productSchema);
