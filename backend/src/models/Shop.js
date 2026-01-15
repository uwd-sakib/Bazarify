import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: [true, 'দোকানের নাম প্রয়োজন'],
    trim: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Shop', shopSchema);
