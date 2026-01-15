import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

// Import models
import User from '../models/User.js';
import Shop from '../models/Shop.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Order from '../models/Order.js';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding...');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const generateOrderNumber = (index) => {
  return `ORD-${Date.now()}-${index}`;
};

const seedData = async () => {
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Shop.deleteMany({});
    await Product.deleteMany({});
    await Customer.deleteMany({});
    await Order.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create Admin User
    console.log('👤 Creating admin user...');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@bazarify.com',
      phone: '01700000000',
      password: 'admin123',
      role: 'admin',
      isVerified: true
    });
    console.log('✅ Admin user created:', adminUser.email);

    // Create Demo Merchant User
    console.log('👤 Creating demo merchant user...');
    const demoUser = await User.create({
      name: 'আব্দুল করিম',
      email: 'demo@bazarify.com',
      phone: '01711111111',
      password: 'demo123',
      role: 'merchant',
      isVerified: true
    });
    console.log('✅ Demo merchant created:', demoUser.email);

    // Create Demo Shop
    console.log('🏪 Creating demo shop...');
    const demoShop = await Shop.create({
      ownerId: demoUser._id,
      shopName: 'করিম ফ্রেশ মার্ট',
      address: 'মিরপুর ১০, ঢাকা',
      phone: '01711111111',
      description: 'তাজা ও মানসম্পন্ন দৈনন্দিন মুদি পণ্যের ভান্ডার - ফল, সবজি, মসলা, দুগ্ধজাত পণ্য এবং আরো অনেক কিছু।'
    });
    console.log('✅ Demo shop created:', demoShop.shopName);

    // Update user with shop
    demoUser.shopId = demoShop._id;
    await demoUser.save();

    // Create Products
    console.log('📦 Creating products...');
    const products = await Product.insertMany([
      // Vegetables - সবজি
      {
        shopId: demoShop._id,
        name: 'আলু (প্রতি কেজি)',
        category: 'সবজি',
        description: 'তাজা দেশীয় আলু, রান্নার জন্য উপযুক্ত',
        price: 35,
        stock: 500
      },
      {
        shopId: demoShop._id,
        name: 'টমেটো (প্রতি কেজি)',
        category: 'সবজি',
        description: 'তাজা লাল টমেটো, সালাদ ও রান্নার জন্য',
        price: 60,
        stock: 300
      },
      {
        shopId: demoShop._id,
        name: 'পেঁয়াজ (প্রতি কেজি)',
        category: 'সবজি',
        description: 'দেশীয় লাল পেঁয়াজ, উচ্চ মানের',
        price: 45,
        stock: 450
      },
      {
        shopId: demoShop._id,
        name: 'গাজর (প্রতি কেজি)',
        category: 'সবজি',
        description: 'তাজা লাল গাজর, ভিটামিন এ সমৃদ্ধ',
        price: 80,
        stock: 200
      },
      {
        shopId: demoShop._id,
        name: 'মরিচ (প্রতি ২৫০ গ্রাম)',
        category: 'সবজি',
        description: 'কাঁচা মরিচ, ঝাল ও তাজা',
        price: 40,
        stock: 150
      },
      {
        shopId: demoShop._id,
        name: 'শসা (প্রতি কেজি)',
        category: 'সবজি',
        description: 'তাজা সবুজ শসা, সালাদের জন্য',
        price: 50,
        stock: 180
      },
      {
        shopId: demoShop._id,
        name: 'বেগুন (প্রতি কেজি)',
        category: 'সবজি',
        description: 'দেশীয় বেগুন, রান্নার জন্য',
        price: 55,
        stock: 220
      },
      {
        shopId: demoShop._id,
        name: 'কপি (প্রতিটি)',
        category: 'সবজি',
        description: 'তাজা ফুলকপি/বাঁধাকপি',
        price: 40,
        stock: 120
      },

      // Fruits - ফল
      {
        shopId: demoShop._id,
        name: 'কলা (প্রতি ডজন)',
        category: 'ফল',
        description: 'পাকা সবরি কলা, মিষ্টি ও পুষ্টিকর',
        price: 60,
        stock: 250
      },
      {
        shopId: demoShop._id,
        name: 'আপেল (প্রতি কেজি)',
        category: 'ফল',
        description: 'তাজা আমেরিকান আপেল, রসালো',
        price: 180,
        stock: 150
      },
      {
        shopId: demoShop._id,
        name: 'কমলা (প্রতি কেজি)',
        category: 'ফল',
        description: 'মিষ্টি কমলা, ভিটামিন সি সমৃদ্ধ',
        price: 120,
        stock: 200
      },
      {
        shopId: demoShop._id,
        name: 'আঙ্গুর (প্রতি কেজি)',
        category: 'ফল',
        description: 'সবুজ/কালো আঙ্গুর, তাজা',
        price: 220,
        stock: 100
      },
      {
        shopId: demoShop._id,
        name: 'পেঁপে (প্রতি কেজি)',
        category: 'ফল',
        description: 'পাকা পেঁপে, হজমের জন্য ভালো',
        price: 70,
        stock: 180
      },
      {
        shopId: demoShop._id,
        name: 'আনার (প্রতি কেজি)',
        category: 'ফল',
        description: 'রসালো ডালিম, পুষ্টিগুণ সমৃদ্ধ',
        price: 250,
        stock: 80
      },

      // Rice & Grains - চাল ও শস্য
      {
        shopId: demoShop._id,
        name: 'মিনিকেট চাল (প্রতি কেজি)',
        category: 'চাল ও শস্য',
        description: 'উচ্চ মানের মিনিকেট চাল, সুগন্ধযুক্ত',
        price: 65,
        stock: 800
      },
      {
        shopId: demoShop._id,
        name: 'নাজিরশাইল চাল (প্রতি কেজি)',
        category: 'চাল ও শস্য',
        description: 'দেশীয় নাজিরশাইল চাল, সুগন্ধি',
        price: 75,
        stock: 600
      },
      {
        shopId: demoShop._id,
        name: 'বাসমতী চাল (প্রতি কেজি)',
        category: 'চাল ও শস্য',
        description: 'প্রিমিয়াম বাসমতী চাল, সুগন্ধযুক্ত',
        price: 140,
        stock: 400
      },
      {
        shopId: demoShop._id,
        name: 'মসুর ডাল (প্রতি কেজি)',
        category: 'চাল ও শস্য',
        description: 'লাল মসুর ডাল, প্রোটিন সমৃদ্ধ',
        price: 120,
        stock: 350
      },
      {
        shopId: demoShop._id,
        name: 'ছোলা ডাল (প্রতি কেজি)',
        category: 'চাল ও শস্য',
        description: 'মুগ ডাল, পুষ্টিকর',
        price: 110,
        stock: 300
      },
      {
        shopId: demoShop._id,
        name: 'আটা (প্রতি কেজি)',
        category: 'চাল ও শস্য',
        description: 'গমের আটা, রুটি তৈরির জন্য',
        price: 55,
        stock: 500
      },

      // Spices - মসলা
      {
        shopId: demoShop._id,
        name: 'হলুদ গুঁড়া (প্রতি ২৫০ গ্রাম)',
        category: 'মসলা',
        description: 'খাঁটি হলুদ গুঁড়া, উচ্চ মানের',
        price: 100,
        stock: 200
      },
      {
        shopId: demoShop._id,
        name: 'মরিচ গুঁড়া (প্রতি ২৫০ গ্রাম)',
        category: 'মসলা',
        description: 'খাঁটি মরিচের গুঁড়া, ঝাল',
        price: 120,
        stock: 180
      },
      {
        shopId: demoShop._id,
        name: 'ধনে গুঁড়া (প্রতি ২৫০ গ্রাম)',
        category: 'মসলা',
        description: 'ধনিয়ার গুঁড়া, সুগন্ধযুক্ত',
        price: 80,
        stock: 150
      },
      {
        shopId: demoShop._id,
        name: 'জিরা (প্রতি ১০০ গ্রাম)',
        category: 'মসলা',
        description: 'খাঁটি জিরা, সুগন্ধি',
        price: 70,
        stock: 120
      },
      {
        shopId: demoShop._id,
        name: 'গরম মসলা (প্রতি ১০০ গ্রাম)',
        category: 'মসলা',
        description: 'মিশ্র গরম মসলা, রান্নার জন্য',
        price: 150,
        stock: 100
      },
      {
        shopId: demoShop._id,
        name: 'লবণ (প্রতি কেজি)',
        category: 'মসলা',
        description: 'বিশুদ্ধ লবণ, আয়োডিনযুক্ত',
        price: 30,
        stock: 600
      },

      // Dairy Products - দুগ্ধজাত পণ্য
      {
        shopId: demoShop._id,
        name: 'দুধ (প্রতি লিটার)',
        category: 'দুগ্ধজাত পণ্য',
        description: 'তাজা গরুর দুধ, পাস্তুরিত',
        price: 85,
        stock: 200
      },
      {
        shopId: demoShop._id,
        name: 'দই (প্রতি ৫০০ গ্রাম)',
        category: 'দুগ্ধজাত পণ্য',
        description: 'তাজা টক দই, প্রোবায়োটিক সমৃদ্ধ',
        price: 60,
        stock: 150
      },
      {
        shopId: demoShop._id,
        name: 'পনির (প্রতি ২৫০ গ্রাম)',
        category: 'দুগ্ধজাত পণ্য',
        description: 'তাজা পনির, রান্নার জন্য',
        price: 120,
        stock: 80
      },
      {
        shopId: demoShop._id,
        name: 'মাখন (প্রতি ২৫০ গ্রাম)',
        category: 'দুগ্ধজাত পণ্য',
        description: 'খাঁটি গরুর মাখন',
        price: 180,
        stock: 60
      },
      {
        shopId: demoShop._id,
        name: 'ঘি (প্রতি ৫০০ গ্রাম)',
        category: 'দুগ্ধজাত পণ্য',
        description: 'খাঁটি গাওয়া ঘি, সুগন্ধযুক্ত',
        price: 450,
        stock: 50
      },

      // Cooking Oil & Essentials - তেল ও রান্নার উপকরণ
      {
        shopId: demoShop._id,
        name: 'সয়াবিন তেল (প্রতি লিটার)',
        category: 'তেল ও রান্নার উপকরণ',
        description: 'রান্নার তেল, স্বাস্থ্যকর',
        price: 140,
        stock: 300
      },
      {
        shopId: demoShop._id,
        name: 'সরিষার তেল (প্রতি লিটার)',
        category: 'তেল ও রান্নার উপকরণ',
        description: 'খাঁটি সরিষার তেল, সুগন্ধযুক্ত',
        price: 180,
        stock: 200
      },
      {
        shopId: demoShop._id,
        name: 'চিনি (প্রতি কেজি)',
        category: 'তেল ও রান্নার উপকরণ',
        description: 'বিশুদ্ধ সাদা চিনি',
        price: 70,
        stock: 400
      },
      {
        shopId: demoShop._id,
        name: 'ভিনেগার (প্রতি ৫০০ মিলি)',
        category: 'তেল ও রান্নার উপকরণ',
        description: 'সাদা ভিনেগার, রান্নার জন্য',
        price: 50,
        stock: 120
      },
      {
        shopId: demoShop._id,
        name: 'টমেটো সস (প্রতি ৫০০ গ্রাম)',
        category: 'তেল ও রান্নার উপকরণ',
        description: 'টমেটো কেচাপ, স্বাদযুক্ত',
        price: 120,
        stock: 150
      },

      // Meat & Protein - মাংস ও প্রোটিন
      {
        shopId: demoShop._id,
        name: 'মুরগির মাংস (প্রতি কেজি)',
        category: 'মাংস ও প্রোটিন',
        description: 'তাজা ব্রয়লার মুরগির মাংস',
        price: 280,
        stock: 100
      },
      {
        shopId: demoShop._id,
        name: 'গরুর মাংস (প্রতি কেজি)',
        category: 'মাংস ও প্রোটিন',
        description: 'তাজা গরুর মাংস, হালাল',
        price: 650,
        stock: 80
      },
      {
        shopId: demoShop._id,
        name: 'ডিম (প্রতি ডজন)',
        category: 'মাংস ও প্রোটিন',
        description: 'তাজা মুরগির ডিম, বাদামি',
        price: 140,
        stock: 300
      },
      {
        shopId: demoShop._id,
        name: 'মাছ - রুই (প্রতি কেজি)',
        category: 'মাংস ও প্রোটিন',
        description: 'তাজা রুই মাছ, দেশীয়',
        price: 380,
        stock: 60
      },
      {
        shopId: demoShop._id,
        name: 'চিংড়ি মাছ (প্রতি কেজি)',
        category: 'মাংস ও প্রোটিন',
        description: 'তাজা গলদা চিংড়ি',
        price: 750,
        stock: 40
      },

      // Snacks & Beverages - স্ন্যাকস ও পানীয়
      {
        shopId: demoShop._id,
        name: 'বিস্কুট (প্রতি প্যাকেট)',
        category: 'স্ন্যাকস ও পানীয়',
        description: 'ক্রিম বিস্কুট, সুস্বাদু',
        price: 30,
        stock: 250
      },
      {
        shopId: demoShop._id,
        name: 'চানাচুর (প্রতি ২৫০ গ্রাম)',
        category: 'স্ন্যাকস ও পানীয়',
        description: 'মজাদার চানাচুর',
        price: 80,
        stock: 180
      },
      {
        shopId: demoShop._id,
        name: 'চা পাতি (প্রতি ৫০০ গ্রাম)',
        category: 'স্ন্যাকস ও পানীয়',
        description: 'খাঁটি চা পাতা, সুগন্ধযুক্ত',
        price: 200,
        stock: 150
      },
      {
        shopId: demoShop._id,
        name: 'কফি (প্রতি ২৫০ গ্রাম)',
        category: 'স্ন্যাকস ও পানীয়',
        description: 'ইনস্ট্যান্ট কফি, আরবিকা',
        price: 280,
        stock: 100
      },
      {
        shopId: demoShop._id,
        name: 'জুস (প্রতি লিটার)',
        category: 'স্ন্যাকস ও পানীয়',
        description: 'মাঙ্গো জুস, প্রাকৃতিক স্বাদ',
        price: 150,
        stock: 120
      },

      // Household Items - গৃহস্থালী সামগ্রী
      {
        shopId: demoShop._id,
        name: 'সাবান (প্রতিটি)',
        category: 'গৃহস্থালী সামগ্রী',
        description: 'গোসলের সাবান, সুগন্ধযুক্ত',
        price: 40,
        stock: 200
      },
      {
        shopId: demoShop._id,
        name: 'ডিটারজেন্ট (প্রতি কেজি)',
        category: 'গৃহস্থালী সামগ্রী',
        description: 'কাপড় ধোয়ার পাউডার',
        price: 90,
        stock: 180
      },
      {
        shopId: demoShop._id,
        name: 'শ্যাম্পু (প্রতি ৪০০ মিলি)',
        category: 'গৃহস্থালী সামগ্রী',
        description: 'চুলের শ্যাম্পু, মাইল্ড',
        price: 180,
        stock: 120
      },
      {
        shopId: demoShop._id,
        name: 'টিস্যু পেপার (প্রতি প্যাকেট)',
        category: 'গৃহস্থালী সামগ্রী',
        description: 'সফট টিস্যু পেপার',
        price: 50,
        stock: 150
      },
      {
        shopId: demoShop._id,
        name: 'ডিশ ওয়াশ লিকুইড (প্রতি ৫০০ মিলি)',
        category: 'গৃহস্থালী সামগ্রী',
        description: 'বাসন পরিষ্কারের তরল',
        price: 120,
        stock: 100
      }
    ]);
    console.log(`✅ ${products.length} products created`);

    // Create Customers
    console.log('👥 Creating customers...');
    const customers = await Customer.insertMany([
      {
        shopId: demoShop._id,
        name: 'রহিম আহমেদ',
        phone: '01712345678',
        email: 'rahim@example.com',
        address: 'ধানমন্ডি ১৫, ঢাকা'
      },
      {
        shopId: demoShop._id,
        name: 'সালমা বেগম',
        phone: '01823456789',
        email: 'salma@example.com',
        address: 'মিরপুর ১১, ঢাকা'
      },
      {
        shopId: demoShop._id,
        name: 'করিম হোসেন',
        phone: '01934567890',
        address: 'মোহাম্মদপুর, ঢাকা'
      },
      {
        shopId: demoShop._id,
        name: 'ফাতেমা খাতুন',
        phone: '01645678901',
        email: 'fatema@example.com',
        address: 'বনানী, ঢাকা'
      },
      {
        shopId: demoShop._id,
        name: 'জামাল উদ্দিন',
        phone: '01756789012',
        address: 'গুলশান ২, ঢাকা'
      },
      {
        shopId: demoShop._id,
        name: 'হাসিনা আক্তার',
        phone: '01867890123',
        email: 'hasina@example.com',
        address: 'উত্তরা সেক্টর ৭, ঢাকা'
      },
      {
        shopId: demoShop._id,
        name: 'হাসান মাহমুদ',
        phone: '01978901234',
        address: 'বসুন্ধরা, ঢাকা'
      },
      {
        shopId: demoShop._id,
        name: 'নাজমা সুলতানা',
        phone: '01589012345',
        email: 'nazma@example.com',
        address: 'শ্যামলী, ঢাকা'
      },
      {
        shopId: demoShop._id,
        name: 'আলী আকবর',
        phone: '01690123456',
        address: 'কলাবাগান, ঢাকা'
      },
      {
        shopId: demoShop._id,
        name: 'রুমানা পারভীন',
        phone: '01701234567',
        email: 'rumana@example.com',
        address: 'ঝিগাতলা, ঢাকা'
      }
    ]);
    console.log(`✅ ${customers.length} customers created`);

    // Create Orders
    console.log('📋 Creating orders...');
    const orders = [];
    
    // Order 1: Weekly grocery shopping - Delivered
    const order1Items = [
      {
        productId: products[14]._id,  // মিনিকেট চাল
        productName: products[14].name,
        quantity: 5,
        price: products[14].price,
        subtotal: products[14].price * 5
      },
      {
        productId: products[0]._id,  // আলু
        productName: products[0].name,
        quantity: 3,
        price: products[0].price,
        subtotal: products[0].price * 3
      },
      {
        productId: products[2]._id,  // পেঁয়াজ
        productName: products[2].name,
        quantity: 2,
        price: products[2].price,
        subtotal: products[2].price * 2
      },
      {
        productId: products[31]._id,  // সয়াবিন তেল
        productName: products[31].name,
        quantity: 2,
        price: products[31].price,
        subtotal: products[31].price * 2
      },
      {
        productId: products[37]._id,  // ডিম
        productName: products[37].name,
        quantity: 2,
        price: products[37].price,
        subtotal: products[37].price * 2
      }
    ];
    const order1Total = order1Items.reduce((sum, item) => sum + item.subtotal, 0);
    orders.push({
      shopId: demoShop._id,
      orderNumber: generateOrderNumber(1),
      customerId: customers[0]._id,
      customerName: customers[0].name,
      customerPhone: customers[0].phone,
      items: order1Items,
      totalAmount: order1Total,
      status: 'delivered',
      paymentStatus: 'paid',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    });

    // Order 2: Fruits and Vegetables - Delivered
    const order2Items = [
      {
        productId: products[8]._id,  // কলা
        productName: products[8].name,
        quantity: 2,
        price: products[8].price,
        subtotal: products[8].price * 2
      },
      {
        productId: products[9]._id,  // আপেল
        productName: products[9].name,
        quantity: 1,
        price: products[9].price,
        subtotal: products[9].price
      },
      {
        productId: products[1]._id,  // টমেটো
        productName: products[1].name,
        quantity: 2,
        price: products[1].price,
        subtotal: products[1].price * 2
      },
      {
        productId: products[3]._id,  // গাজর
        productName: products[3].name,
        quantity: 1,
        price: products[3].price,
        subtotal: products[3].price
      },
      {
        productId: products[5]._id,  // শসা
        productName: products[5].name,
        quantity: 1,
        price: products[5].price,
        subtotal: products[5].price
      }
    ];
    const order2Total = order2Items.reduce((sum, item) => sum + item.subtotal, 0);
    orders.push({
      shopId: demoShop._id,
      orderNumber: generateOrderNumber(2),
      customerId: customers[1]._id,
      customerName: customers[1].name,
      customerPhone: customers[1].phone,
      items: order2Items,
      totalAmount: order2Total,
      status: 'delivered',
      paymentStatus: 'paid',
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    });

    // Order 3: Dairy Products - Processing
    const order3Items = [
      {
        productId: products[26]._id,  // দুধ
        productName: products[26].name,
        quantity: 3,
        price: products[26].price,
        subtotal: products[26].price * 3
      },
      {
        productId: products[27]._id,  // দই
        productName: products[27].name,
        quantity: 2,
        price: products[27].price,
        subtotal: products[27].price * 2
      },
      {
        productId: products[28]._id,  // পনির
        productName: products[28].name,
        quantity: 1,
        price: products[28].price,
        subtotal: products[28].price
      },
      {
        productId: products[41]._id,  // বিস্কুট
        productName: products[41].name,
        quantity: 5,
        price: products[41].price,
        subtotal: products[41].price * 5
      }
    ];
    const order3Total = order3Items.reduce((sum, item) => sum + item.subtotal, 0);
    orders.push({
      shopId: demoShop._id,
      orderNumber: generateOrderNumber(3),
      customerId: customers[2]._id,
      customerName: customers[2].name,
      customerPhone: customers[2].phone,
      items: order3Items,
      totalAmount: order3Total,
      status: 'processing',
      paymentStatus: 'unpaid',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    });

    // Order 4: Spices and Cooking Essentials - Delivered
    const order4Items = [
      {
        productId: products[20]._id,  // হলুদ গুঁড়া
        productName: products[20].name,
        quantity: 2,
        price: products[20].price,
        subtotal: products[20].price * 2
      },
      {
        productId: products[21]._id,  // মরিচ গুঁড়া
        productName: products[21].name,
        quantity: 2,
        price: products[21].price,
        subtotal: products[21].price * 2
      },
      {
        productId: products[23]._id,  // জিরা
        productName: products[23].name,
        quantity: 1,
        price: products[23].price,
        subtotal: products[23].price
      },
      {
        productId: products[24]._id,  // গরম মসলা
        productName: products[24].name,
        quantity: 1,
        price: products[24].price,
        subtotal: products[24].price
      },
      {
        productId: products[25]._id,  // লবণ
        productName: products[25].name,
        quantity: 2,
        price: products[25].price,
        subtotal: products[25].price * 2
      }
    ];
    const order4Total = order4Items.reduce((sum, item) => sum + item.subtotal, 0);
    orders.push({
      shopId: demoShop._id,
      orderNumber: generateOrderNumber(4),
      customerId: customers[3]._id,
      customerName: customers[3].name,
      customerPhone: customers[3].phone,
      items: order4Items,
      totalAmount: order4Total,
      status: 'delivered',
      paymentStatus: 'paid',
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    });

    // Order 5: Meat & Protein - Pending
    const order5Items = [
      {
        productId: products[35]._id,  // মুরগির মাংস
        productName: products[35].name,
        quantity: 2,
        price: products[35].price,
        subtotal: products[35].price * 2
      },
      {
        productId: products[38]._id,  // মাছ - রুই
        productName: products[38].name,
        quantity: 1,
        price: products[38].price,
        subtotal: products[38].price
      },
      {
        productId: products[37]._id,  // ডিম
        productName: products[37].name,
        quantity: 1,
        price: products[37].price,
        subtotal: products[37].price
      }
    ];
    const order5Total = order5Items.reduce((sum, item) => sum + item.subtotal, 0);
    orders.push({
      shopId: demoShop._id,
      orderNumber: generateOrderNumber(5),
      customerId: customers[4]._id,
      customerName: customers[4].name,
      customerPhone: customers[4].phone,
      items: order5Items,
      totalAmount: order5Total,
      status: 'pending',
      paymentStatus: 'unpaid',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    });

    // Order 6: Household Items - Delivered
    const order6Items = [
      {
        productId: products[46]._id,  // সাবান
        productName: products[46].name,
        quantity: 5,
        price: products[46].price,
        subtotal: products[46].price * 5
      },
      {
        productId: products[47]._id,  // ডিটারজেন্ট
        productName: products[47].name,
        quantity: 2,
        price: products[47].price,
        subtotal: products[47].price * 2
      },
      {
        productId: products[48]._id,  // শ্যাম্পু
        productName: products[48].name,
        quantity: 1,
        price: products[48].price,
        subtotal: products[48].price
      },
      {
        productId: products[49]._id,  // টিস্যু পেপার
        productName: products[49].name,
        quantity: 3,
        price: products[49].price,
        subtotal: products[49].price * 3
      }
    ];
    const order6Total = order6Items.reduce((sum, item) => sum + item.subtotal, 0);
    orders.push({
      shopId: demoShop._id,
      orderNumber: generateOrderNumber(6),
      customerId: customers[5]._id,
      customerName: customers[5].name,
      customerPhone: customers[5].phone,
      items: order6Items,
      totalAmount: order6Total,
      status: 'delivered',
      paymentStatus: 'paid',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    });

    // Order 7: Rice & Lentils - Delivered
    const order7Items = [
      {
        productId: products[16]._id,  // বাসমতী চাল
        productName: products[16].name,
        quantity: 2,
        price: products[16].price,
        subtotal: products[16].price * 2
      },
      {
        productId: products[17]._id,  // মসুর ডাল
        productName: products[17].name,
        quantity: 2,
        price: products[17].price,
        subtotal: products[17].price * 2
      },
      {
        productId: products[18]._id,  // ছোলা ডাল
        productName: products[18].name,
        quantity: 1,
        price: products[18].price,
        subtotal: products[18].price
      }
    ];
    const order7Total = order7Items.reduce((sum, item) => sum + item.subtotal, 0);
    orders.push({
      shopId: demoShop._id,
      orderNumber: generateOrderNumber(7),
      customerId: customers[6]._id,
      customerName: customers[6].name,
      customerPhone: customers[6].phone,
      items: order7Items,
      totalAmount: order7Total,
      status: 'delivered',
      paymentStatus: 'paid',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    });

    // Order 8: Snacks & Beverages - Delivered
    const order8Items = [
      {
        productId: products[43]._id,  // চা পাতি
        productName: products[43].name,
        quantity: 1,
        price: products[43].price,
        subtotal: products[43].price
      },
      {
        productId: products[41]._id,  // বিস্কুট
        productName: products[41].name,
        quantity: 10,
        price: products[41].price,
        subtotal: products[41].price * 10
      },
      {
        productId: products[42]._id,  // চানাচুর
        productName: products[42].name,
        quantity: 2,
        price: products[42].price,
        subtotal: products[42].price * 2
      },
      {
        productId: products[33]._id,  // চিনি
        productName: products[33].name,
        quantity: 2,
        price: products[33].price,
        subtotal: products[33].price * 2
      }
    ];
    const order8Total = order8Items.reduce((sum, item) => sum + item.subtotal, 0);
    orders.push({
      shopId: demoShop._id,
      orderNumber: generateOrderNumber(8),
      customerId: customers[7]._id,
      customerName: customers[7].name,
      customerPhone: customers[7].phone,
      items: order8Items,
      totalAmount: order8Total,
      status: 'delivered',
      paymentStatus: 'paid',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    });

    // Order 9: Mixed grocery - Processing
    const order9Items = [
      {
        productId: products[0]._id,  // আলু
        productName: products[0].name,
        quantity: 5,
        price: products[0].price,
        subtotal: products[0].price * 5
      },
      {
        productId: products[6]._id,  // বেগুন
        productName: products[6].name,
        quantity: 2,
        price: products[6].price,
        subtotal: products[6].price * 2
      },
      {
        productId: products[10]._id,  // কমলা
        productName: products[10].name,
        quantity: 1,
        price: products[10].price,
        subtotal: products[10].price
      },
      {
        productId: products[19]._id,  // আটা
        productName: products[19].name,
        quantity: 3,
        price: products[19].price,
        subtotal: products[19].price * 3
      }
    ];
    const order9Total = order9Items.reduce((sum, item) => sum + item.subtotal, 0);
    orders.push({
      shopId: demoShop._id,
      orderNumber: generateOrderNumber(9),
      customerId: customers[8]._id,
      customerName: customers[8].name,
      customerPhone: customers[8].phone,
      items: order9Items,
      totalAmount: order9Total,
      status: 'processing',
      paymentStatus: 'unpaid',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    });

    // Order 10: Premium items - Delivered
    const order10Items = [
      {
        productId: products[30]._id,  // ঘি
        productName: products[30].name,
        quantity: 1,
        price: products[30].price,
        subtotal: products[30].price
      },
      {
        productId: products[39]._id,  // চিংড়ি মাছ
        productName: products[39].name,
        quantity: 1,
        price: products[39].price,
        subtotal: products[39].price
      },
      {
        productId: products[36]._id,  // গরুর মাংস
        productName: products[36].name,
        quantity: 1,
        price: products[36].price,
        subtotal: products[36].price
      },
      {
        productId: products[16]._id,  // বাসমতী চাল
        productName: products[16].name,
        quantity: 3,
        price: products[16].price,
        subtotal: products[16].price * 3
      }
    ];
    const order10Total = order10Items.reduce((sum, item) => sum + item.subtotal, 0);
    orders.push({
      shopId: demoShop._id,
      orderNumber: generateOrderNumber(10),
      customerId: customers[9]._id,
      customerName: customers[9].name,
      customerPhone: customers[9].phone,
      items: order10Items,
      totalAmount: order10Total,
      status: 'delivered',
      paymentStatus: 'paid',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    });

    // Order 11: Quick essentials - Cancelled
    const order11Items = [
      {
        productId: products[4]._id,  // মরিচ
        productName: products[4].name,
        quantity: 2,
        price: products[4].price,
        subtotal: products[4].price * 2
      },
      {
        productId: products[25]._id,  // লবণ
        productName: products[25].name,
        quantity: 1,
        price: products[25].price,
        subtotal: products[25].price
      }
    ];
    const order11Total = order11Items.reduce((sum, item) => sum + item.subtotal, 0);
    orders.push({
      shopId: demoShop._id,
      orderNumber: generateOrderNumber(11),
      customerId: customers[0]._id,
      customerName: customers[0].name,
      customerPhone: customers[0].phone,
      items: order11Items,
      totalAmount: order11Total,
      status: 'cancelled',
      paymentStatus: 'unpaid',
      notes: 'গ্রাহক পণ্য নিতে আসেননি',
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)
    });

    // Additional orders for customer 0 (High trust - many orders, all paid)
    for (let i = 0; i < 8; i++) {
      const additionalItems = [
        {
          productId: products[Math.floor(Math.random() * 10)]._id,
          productName: products[Math.floor(Math.random() * 10)].name,
          quantity: Math.floor(Math.random() * 3) + 1,
          price: products[Math.floor(Math.random() * 10)].price,
          subtotal: products[Math.floor(Math.random() * 10)].price * (Math.floor(Math.random() * 3) + 1)
        }
      ];
      const total = additionalItems.reduce((sum, item) => sum + item.subtotal, 0);
      orders.push({
        shopId: demoShop._id,
        orderNumber: generateOrderNumber(12 + i),
        customerId: customers[0]._id,
        customerName: customers[0].name,
        customerPhone: customers[0].phone,
        items: additionalItems,
        totalAmount: total,
        status: 'delivered',
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - (15 + i * 5) * 24 * 60 * 60 * 1000)
      });
    }

    // Additional orders for customer 1 (Medium-High trust - many orders, mostly paid)
    for (let i = 0; i < 5; i++) {
      const additionalItems = [
        {
          productId: products[Math.floor(Math.random() * 10)]._id,
          productName: products[Math.floor(Math.random() * 10)].name,
          quantity: Math.floor(Math.random() * 2) + 1,
          price: products[Math.floor(Math.random() * 10)].price,
          subtotal: products[Math.floor(Math.random() * 10)].price * (Math.floor(Math.random() * 2) + 1)
        }
      ];
      const total = additionalItems.reduce((sum, item) => sum + item.subtotal, 0);
      orders.push({
        shopId: demoShop._id,
        orderNumber: generateOrderNumber(20 + i),
        customerId: customers[1]._id,
        customerName: customers[1].name,
        customerPhone: customers[1].phone,
        items: additionalItems,
        totalAmount: total,
        status: i === 4 ? 'pending' : 'delivered',
        paymentStatus: i === 4 ? 'unpaid' : 'paid',
        createdAt: new Date(Date.now() - (10 + i * 3) * 24 * 60 * 60 * 1000)
      });
    }

    // Additional orders for customer 2 (Medium trust - some paid, some unpaid)
    for (let i = 0; i < 3; i++) {
      const additionalItems = [
        {
          productId: products[Math.floor(Math.random() * 10)]._id,
          productName: products[Math.floor(Math.random() * 10)].name,
          quantity: 1,
          price: products[Math.floor(Math.random() * 10)].price,
          subtotal: products[Math.floor(Math.random() * 10)].price
        }
      ];
      const total = additionalItems.reduce((sum, item) => sum + item.subtotal, 0);
      orders.push({
        shopId: demoShop._id,
        orderNumber: generateOrderNumber(25 + i),
        customerId: customers[2]._id,
        customerName: customers[2].name,
        customerPhone: customers[2].phone,
        items: additionalItems,
        totalAmount: total,
        status: i === 0 ? 'pending' : 'delivered',
        paymentStatus: i === 0 ? 'unpaid' : 'paid',
        createdAt: new Date(Date.now() - (8 + i * 2) * 24 * 60 * 60 * 1000)
      });
    }

    // Additional orders for customer 3 (High trust - multiple orders, all paid)
    for (let i = 0; i < 6; i++) {
      const additionalItems = [
        {
          productId: products[Math.floor(Math.random() * 10)]._id,
          productName: products[Math.floor(Math.random() * 10)].name,
          quantity: Math.floor(Math.random() * 3) + 1,
          price: products[Math.floor(Math.random() * 10)].price,
          subtotal: products[Math.floor(Math.random() * 10)].price * (Math.floor(Math.random() * 3) + 1)
        }
      ];
      const total = additionalItems.reduce((sum, item) => sum + item.subtotal, 0);
      orders.push({
        shopId: demoShop._id,
        orderNumber: generateOrderNumber(28 + i),
        customerId: customers[3]._id,
        customerName: customers[3].name,
        customerPhone: customers[3].phone,
        items: additionalItems,
        totalAmount: total,
        status: 'delivered',
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - (20 + i * 4) * 24 * 60 * 60 * 1000)
      });
    }

    // Customer 5: Add 2 more delivered orders (medium trust)
    for (let i = 0; i < 2; i++) {
      const additionalItems = [
        {
          productId: products[Math.floor(Math.random() * 10)]._id,
          productName: products[Math.floor(Math.random() * 10)].name,
          quantity: 1,
          price: products[Math.floor(Math.random() * 10)].price,
          subtotal: products[Math.floor(Math.random() * 10)].price
        }
      ];
      const total = additionalItems.reduce((sum, item) => sum + item.subtotal, 0);
      orders.push({
        shopId: demoShop._id,
        orderNumber: generateOrderNumber(34 + i),
        customerId: customers[5]._id,
        customerName: customers[5].name,
        customerPhone: customers[5].phone,
        items: additionalItems,
        totalAmount: total,
        status: 'delivered',
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - (12 + i * 3) * 24 * 60 * 60 * 1000)
      });
    }

    await Order.insertMany(orders);
    console.log(`✅ ${orders.length} orders created`);

    console.log('\n🎉 ========================================');
    console.log('✅ Database seeded successfully!');
    console.log('🎉 ========================================\n');
    
    console.log('📝 Login Credentials:\n');
    console.log('👑 ADMIN ACCOUNT:');
    console.log('   Email: admin@bazarify.com');
    console.log('   Password: admin123');
    console.log('   Role: Administrator\n');
    
    console.log('🏪 DEMO MERCHANT ACCOUNT:');
    console.log('   Email: demo@bazarify.com');
    console.log('   Password: demo123');
    console.log('   Phone: 01711111111');
    console.log('   Shop: করিম ফ্রেশ মার্ট (Grocery Store)\n');
    
    console.log('📊 Seeded Data Summary:');
    console.log(`   - Products: ${products.length} (Grocery items across multiple categories)`);
    console.log(`   - Customers: ${customers.length}`);
    console.log(`   - Orders: ${orders.length}`);
    console.log(`   - Total Revenue: ৳${orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}`);
    console.log('\n📦 Product Categories:');
    console.log('   - সবজি (Vegetables): 8 items');
    console.log('   - ফল (Fruits): 6 items');
    console.log('   - চাল ও শস্য (Rice & Grains): 6 items');
    console.log('   - মসলা (Spices): 6 items');
    console.log('   - দুগ্ধজাত পণ্য (Dairy): 5 items');
    console.log('   - তেল ও রান্নার উপকরণ (Cooking Oil & Essentials): 5 items');
    console.log('   - মাংস ও প্রোটিন (Meat & Protein): 5 items');
    console.log('   - স্ন্যাকস ও পানীয় (Snacks & Beverages): 5 items');
    console.log('   - গৃহস্থালী সামগ্রী (Household Items): 5 items');
    console.log('\n========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

// Run seeding
connectDB().then(() => {
  seedData();
});
