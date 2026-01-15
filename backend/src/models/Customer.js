import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'নাম প্রয়োজন'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'ফোন নম্বর প্রয়োজন'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    trim: true
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
customerSchema.index({ shopId: 1 });
customerSchema.index({ shopId: 1, phone: 1 });

export default mongoose.model('Customer', customerSchema);
