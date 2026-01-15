import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';

export const getDashboardStats = async (req, res) => {
  try {
    const shopId = req.user.shopId;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    const totalProducts = await Product.countDocuments({ shopId });
    const totalCustomers = await Customer.countDocuments({ shopId });
    const totalOrders = await Order.countDocuments({ shopId });

    const salesData = await Order.aggregate([
      { $match: { shopId, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalSales = salesData[0]?.total || 0;

    const todaySalesData = await Order.aggregate([
      { 
        $match: { 
          shopId, 
          status: 'delivered',
          createdAt: { $gte: todayStart }
        } 
      },
      { 
        $group: { 
          _id: null, 
          sales: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        } 
      }
    ]);
    const todaySales = todaySalesData[0]?.sales || 0;
    const todayOrdersCount = todaySalesData[0]?.count || 0;

    const yesterdaySalesData = await Order.aggregate([
      { 
        $match: { 
          shopId, 
          status: 'delivered',
          createdAt: { $gte: yesterdayStart, $lt: todayStart }
        } 
      },
      { $group: { _id: null, sales: { $sum: '$totalAmount' } } }
    ]);
    const yesterdaySales = yesterdaySalesData[0]?.sales || 1;

    const todayCustomersData = await Order.aggregate([
      { 
        $match: { 
          shopId, 
          createdAt: { $gte: todayStart }
        } 
      },
      { $group: { _id: '$customerId' } },
      { $count: 'count' }
    ]);
    const todayCustomers = todayCustomersData[0]?.count || 0;

    const estimatedCostPercentage = 0.55;
    const todayCost = Math.round(todaySales * estimatedCostPercentage);
    const totalExpenses = Math.round(totalSales * estimatedCostPercentage);
    const todayProfit = todaySales - todayCost;
    
    const salesGrowthAmount = todaySales - yesterdaySales;
    const salesGrowthPercent = yesterdaySales > 0 
      ? ((salesGrowthAmount / yesterdaySales) * 100).toFixed(1)
      : 0;

    const yesterdayProfit = yesterdaySales * (1 - estimatedCostPercentage);
    const profitGrowth = yesterdayProfit > 0 
      ? (((todayProfit - yesterdayProfit) / yesterdayProfit) * 100).toFixed(1)
      : 0;

    const pendingOrders = await Order.countDocuments({ shopId, status: 'pending' });

    const lowStockProducts = await Product.countDocuments({ 
      shopId, 
      stock: { $lt: 50 },
      status: 'active'
    });

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalCustomers,
        totalOrders,
        totalSales,
        todaySales,
        todayProfit,
        profitGrowth: parseFloat(profitGrowth),
        todayCustomers,
        todayOrdersCount,
        salesGrowthAmount,
        salesGrowthPercent: parseFloat(salesGrowthPercent),
        totalExpenses,
        pendingOrders,
        lowStockProducts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'পরিসংখ্যান লোড করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const shopId = req.user.shopId;
    const limit = parseInt(req.query.limit) || 5;

    const orders = await Order.find({ shopId })
      .populate('customerId', 'name phone')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'সাম্প্রতিক অর্ডার লোড করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

export const getSalesChart = async (req, res) => {
  try {
    const shopId = req.user.shopId;
    const { period = 'week' } = req.query;

    let days = 7;
    if (period === 'month') days = 30;
    if (period === 'year') days = 365;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const salesData = await Order.aggregate([
      {
        $match: {
          shopId,
          createdAt: { $gte: startDate },
          status: 'delivered'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          sales: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: salesData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'চার্ট ডেটা লোড করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};

export const getTopProducts = async (req, res) => {
  try {
    const shopId = req.user.shopId;
    const limit = parseInt(req.query.limit) || 5;

    const topProducts = await Order.aggregate([
      { $match: { shopId, status: 'delivered' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          productName: { $first: '$items.productName' },
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.subtotal' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: limit }
    ]);

    res.status(200).json({
      success: true,
      data: topProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'জনপ্রিয় পণ্য লোড করতে ব্যর্থ হয়েছে',
      error: error.message
    });
  }
};
