import { aiService } from '../services/aiService.js';
import { munshiJiService } from '../services/munshiJiService.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Generate product description using AI
// @route   POST /api/ai/generate-description
// @access  Private
export const generateProductDescription = async (req, res) => {
  try {
    const { productName, category, price, features } = req.body;

    if (!productName || !category) {
      return res.status(400).json({
        success: false,
        message: 'পণ্যের নাম এবং ক্যাটাগরি প্রয়োজন'
      });
    }

    const description = await aiService.generateProductDescription(
      productName,
      category,
      price,
      features
    );

    res.status(200).json({
      success: true,
      message: 'AI দ্বারা বর্ণনা তৈরি হয়েছে',
      data: { description }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'AI বর্ণনা তৈরি করতে ব্যর্থ হয়েছে'
    });
  }
};

// @desc    Get AI business insights
// @route   GET /api/ai/business-insights
// @access  Private
export const getBusinessInsights = async (req, res) => {
  try {
    const shopId = req.user.shopId;

    // Fetch stats
    const [products, orders] = await Promise.all([
      Product.find({ shopId }),
      Order.find({ shopId })
    ]);

    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Count unique customers
    const uniqueCustomers = new Set(orders.map(o => o.customerId.toString())).size;

    const stats = {
      totalSales,
      totalOrders,
      totalProducts,
      totalCustomers: uniqueCustomers,
      averageOrderValue: avgOrderValue.toFixed(2)
    };

    const insights = await aiService.generateBusinessInsights(stats);

    res.status(200).json({
      success: true,
      data: { insights, stats }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'AI বিশ্লেষণ করতে ব্যর্থ হয়েছে'
    });
  }
};

// @desc    Generate customer message
// @route   POST /api/ai/generate-message
// @access  Private
export const generateCustomerMessage = async (req, res) => {
  try {
    const { customerName, messageType, context } = req.body;

    if (!customerName || !messageType) {
      return res.status(400).json({
        success: false,
        message: 'গ্রাহকের নাম এবং বার্তার ধরন প্রয়োজন'
      });
    }

    const message = await aiService.generateCustomerMessage(
      customerName,
      messageType,
      context
    );

    res.status(200).json({
      success: true,
      message: 'AI দ্বারা বার্তা তৈরি হয়েছে',
      data: { message }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'AI বার্তা তৈরি করতে ব্যর্থ হয়েছে'
    });
  }
};

// @desc    Analyze sales trend
// @route   GET /api/ai/sales-analysis
// @access  Private
export const analyzeSalesTrend = async (req, res) => {
  try {
    const shopId = req.user.shopId;

    // Get last 7 days sales
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const orders = await Order.find({
      shopId,
      createdAt: { $gte: sevenDaysAgo }
    }).sort({ createdAt: 1 });

    // Group by day
    const salesByDay = {};
    orders.forEach(order => {
      const day = order.createdAt.toISOString().split('T')[0];
      if (!salesByDay[day]) {
        salesByDay[day] = { amount: 0, count: 0 };
      }
      salesByDay[day].amount += order.totalAmount;
      salesByDay[day].count += 1;
    });

    const salesData = Object.values(salesByDay);

    if (salesData.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'পর্যাপ্ত তথ্য নেই',
        data: { analysis: 'গত ৭ দিনে কোনো বিক্রয় নেই। বিক্রয় বাড়ানোর জন্য প্রচার শুরু করুন।' }
      });
    }

    const analysis = await aiService.analyzeSalesTrend(salesData);

    res.status(200).json({
      success: true,
      data: { analysis, salesData }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'বিক্রয় বিশ্লেষণ করতে ব্যর্থ হয়েছে'
    });
  }
};

// @desc    Get inventory recommendations
// @route   GET /api/ai/inventory-advice
// @access  Private
export const getInventoryAdvice = async (req, res) => {
  try {
    const shopId = req.user.shopId;
    const products = await Product.find({ shopId });

    if (products.length === 0) {
      return res.status(200).json({
        success: true,
        data: { advice: 'এখনও কোনো পণ্য যোগ করা হয়নি। পণ্য যোগ করে শুরু করুন।' }
      });
    }

    const advice = await aiService.generateInventoryAdvice(products);

    res.status(200).json({
      success: true,
      data: { advice }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'ইনভেন্টরি পরামর্শ পেতে ব্যর্থ হয়েছে'
    });
  }
};

// @desc    AI Chat assistant
// @route   POST /api/ai/chat
// @access  Private
export const chatWithAI = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'বার্তা প্রয়োজন'
      });
    }

    const response = await aiService.chatWithAI(message, conversationHistory || []);

    res.status(200).json({
      success: true,
      data: { response }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'AI চ্যাট সেবা অনুপলব্ধ'
    });
  }
};

// @desc    Generate order report
// @route   GET /api/ai/order-report
// @access  Private
export const generateOrderReport = async (req, res) => {
  try {
    const shopId = req.user.shopId;
    const { period } = req.query; // 'week', 'month', or 'all'

    let dateFilter = {};
    let periodLabel = 'সব সময়';

    if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { createdAt: { $gte: weekAgo } };
      periodLabel = 'গত ৭ দিন';
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { createdAt: { $gte: monthAgo } };
      periodLabel = 'গত ৩০ দিন';
    }

    const orders = await Order.find({ shopId, ...dateFilter });

    if (orders.length === 0) {
      return res.status(200).json({
        success: true,
        data: { report: `${periodLabel} কোনো অর্ডার নেই।` }
      });
    }

    const report = await aiService.generateOrderReport(orders, periodLabel);

    res.status(200).json({
      success: true,
      data: { report }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'রিপোর্ট তৈরি করতে ব্যর্থ হয়েছে'
    });
  }
};

// @desc    MunshiJi - Unified AI Business Advisor
// @route   POST /api/ai/munshiji
// @access  Private
export const munshiJi = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    const shopId = req.user.shopId;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'বার্তা প্রয়োজন'
      });
    }

    // Use the dedicated MunshiJi Service
    const result = await munshiJiService.processRequest(
      message,
      conversationHistory || [],
      shopId
    );

    res.status(200).json({
      success: true,
      data: {
        response: result.response,
        actions: result.actions,
        toolsUsed: result.toolsUsed,
        reasoning: result.reasoning,
        context: result.context
      }
    });
  } catch (error) {
    console.error('MunshiJi Controller Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'মুন্সিজি সেবা অনুপলব্ধ'
    });
  }
};

// @desc    MunshiJi V1 - Unified AI Business Advisor (Structured Response)
// @route   POST /api/v1/ai/munshiji
// @access  Private
export const munshiJiV1 = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    const shopId = req.user.shopId;

    // 1. Authenticate user (handled by middleware)
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'বার্তা প্রয়োজন'
      });
    }

    // 2. Build business context
    // 3. Decide required AI tools
    // 4. Generate unified prompt
    // 5. Call AI
    const result = await munshiJiService.processRequest(
      message,
      conversationHistory || [],
      shopId
    );

    // 6. Return structured response with advice (Bangla) and suggested actions (JSON)
    const suggestedActions = extractActionsFromResponse(result.response);

    res.status(200).json({
      success: true,
      data: {
        advice: result.response,
        actions: result.actions, // Structured, UI-renderable actions
        suggestedActions, // Text-based action steps
        metadata: {
          toolsUsed: result.toolsUsed,
          reasoning: result.reasoning,
          timestamp: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('MunshiJi V1 Controller Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'মুন্সিজি সেবা অনুপলব্ধ'
    });
  }
};

/**
 * Extract action steps from Bangla response and structure as JSON
 * @param {String} response - MunshiJi's Bangla response
 * @returns {Array} Structured action steps
 */
function extractActionsFromResponse(response) {
  const actions = [];
  
  // Look for action steps section (কর্মপদক্ষেপ)
  const actionSectionMatch = response.match(/\*\*কর্মপদক্ষেপ[:\s]*\*\*[\s\S]*$/i);
  
  if (actionSectionMatch) {
    const actionSection = actionSectionMatch[0];
    
    // Extract numbered steps (১., ২., ৩., etc. or 1., 2., 3., etc.)
    const stepRegex = /[১২৩৪৫৬৭৮৯০1-9]\.\s*([^\n]+)/g;
    let match;
    let priority = 1;
    
    while ((match = stepRegex.exec(actionSection)) !== null) {
      const actionText = match[1].trim();
      
      actions.push({
        priority,
        action: actionText,
        category: categorizeAction(actionText),
        completed: false
      });
      
      priority++;
    }
  }
  
  // If no explicit action section found, try to extract from recommendation section
  if (actions.length === 0) {
    const recommendationMatch = response.match(/\*\*সুপারিশ[:\s]*\*\*[\s\S]*?(?=\*\*|$)/i);
    
    if (recommendationMatch) {
      const recommendation = recommendationMatch[0];
      const sentences = recommendation.split(/[।\n]/).filter(s => s.trim().length > 10);
      
      sentences.slice(0, 3).forEach((sentence, idx) => {
        const cleanSentence = sentence.replace(/\*\*/g, '').trim();
        if (cleanSentence && !cleanSentence.includes('সুপারিশ')) {
          actions.push({
            priority: idx + 1,
            action: cleanSentence,
            category: categorizeAction(cleanSentence),
            completed: false
          });
        }
      });
    }
  }
  
  return actions;
}

/**
 * Categorize action based on keywords
 * @param {String} actionText - Action text in Bangla
 * @returns {String} Category
 */
function categorizeAction(actionText) {
  const text = actionText.toLowerCase();
  
  // Inventory related
  if (text.includes('স্টক') || text.includes('পণ্য') || text.includes('সরবরাহ')) {
    return 'inventory';
  }
  
  // Marketing related
  if (text.includes('মার্কেটিং') || text.includes('প্রচার') || text.includes('বিজ্ঞাপন') || text.includes('সোশ্যাল')) {
    return 'marketing';
  }
  
  // Customer related
  if (text.includes('গ্রাহক') || text.includes('সেবা') || text.includes('যোগাযোগ')) {
    return 'customer';
  }
  
  // Sales related
  if (text.includes('বিক্রয়') || text.includes('অফার') || text.includes('ছাড়')) {
    return 'sales';
  }
  
  // Operations related
  if (text.includes('ডেলিভারি') || text.includes('অর্ডার') || text.includes('প্রসেস')) {
    return 'operations';
  }
  
  // Financial related
  if (text.includes('টাকা') || text.includes('আয়') || text.includes('খরচ') || text.includes('লাভ')) {
    return 'financial';
  }
  
  return 'general';
}
