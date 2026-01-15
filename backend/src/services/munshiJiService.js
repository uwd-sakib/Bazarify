import { aiService } from './aiService.js';
import { aiToolRegistry } from './aiToolRegistry.js';
import { promptComposer } from './promptComposer.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Customer from '../models/Customer.js';

/**
 * MunshiJi Service - Central AI Business Advisor
 * 
 * Acts as the orchestrator for all AI features.
 * Intelligently decides which AI modules to invoke based on:
 * - User query intent
 * - Business context (sales, inventory, profit)
 * - Data availability
 * 
 * Responsibilities:
 * 1. Analyze user request
 * 2. Fetch relevant business data
 * 3. Build unified business context
 * 4. Decide which AI modules to call
 * 5. Merge outputs into coherent Bangla response
 */

class MunshiJiService {
  /**
   * Main entry point for MunshiJi
   * @param {String} userMessage - User's question/request in Bangla
   * @param {Array} conversationHistory - Previous conversation
   * @param {String} shopId - Shop/Business ID
   * @returns {Object} { response, insights, toolsUsed, reasoning }
   */
  async processRequest(userMessage, conversationHistory, shopId) {
    try {
      // Step 1: Fetch comprehensive business context
      const businessContext = await this.fetchBusinessContext(shopId);

      // Step 2: Analyze intent and determine which insights to generate
      const actionPlan = await this.analyzeIntentAndPlan(
        userMessage,
        conversationHistory,
        businessContext
      );

      // Step 3: Execute AI modules based on action plan
      const insights = await this.executeAIModules(actionPlan, businessContext);

      // Step 4: Merge all insights into unified Bangla response
      const finalResponse = await this.generateUnifiedResponse(
        userMessage,
        conversationHistory,
        businessContext,
        insights,
        actionPlan
      );

      // Step 5: Extract structured, UI-renderable actions
      const actions = this.extractStructuredActions(
        finalResponse,
        businessContext,
        insights
      );

      return {
        response: finalResponse,
        actions: actions,
        insights: insights,
        toolsUsed: actionPlan.toolsToUse,
        reasoning: actionPlan.reasoning,
        context: {
          totalProducts: businessContext.totalProducts,
          totalOrders: businessContext.totalOrders,
          totalRevenue: businessContext.totalRevenue,
          lowStockCount: businessContext.lowStockProducts.length
        }
      };
    } catch (error) {
      console.error('MunshiJi Service Error:', error);
      throw new Error('মুন্সিজি সেবা বর্তমানে অনুপলব্ধ। পরে আবার চেষ্টা করুন।');
    }
  }

  /**
   * Fetch comprehensive business context
   * @param {String} shopId - Shop ID
   * @returns {Object} Complete business context
   */
  async fetchBusinessContext(shopId) {
    try {
      const [products, orders, customers] = await Promise.all([
        Product.find({ shopId }).lean(),
        Order.find({ shopId }).lean(),
        Customer.find({ shopId }).lean()
      ]);

      // Validate data - ensure arrays
      const validProducts = Array.isArray(products) ? products : [];
      const validOrders = Array.isArray(orders) ? orders : [];
      const validCustomers = Array.isArray(customers) ? customers : [];

      // Calculate key metrics with safe defaults
      const totalRevenue = validOrders.reduce((sum, order) => {
        const amount = Number(order.totalAmount) || 0;
        return sum + amount;
      }, 0);
      
      const totalOrders = validOrders.length;
      const totalProducts = validProducts.length;
      const totalCustomers = validCustomers.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Inventory analysis with validation
      const lowStockProducts = validProducts.filter(p => {
        const stock = Number(p.stock) || 0;
        return stock > 0 && stock < 10;
      });
      
      const outOfStockProducts = validProducts.filter(p => {
        const stock = Number(p.stock) || 0;
        return stock === 0;
      });
      
      const wellStockedProducts = validProducts.filter(p => {
        const stock = Number(p.stock) || 0;
        return stock >= 10;
      });

      // Sales analysis (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentOrders = validOrders.filter(o => {
        try {
          return new Date(o.createdAt) >= sevenDaysAgo;
        } catch (e) {
          return false;
        }
      });
      
      // Group sales by day with validation
      const salesByDay = {};
      recentOrders.forEach(order => {
        try {
          const day = new Date(order.createdAt).toISOString().split('T')[0];
          if (!salesByDay[day]) {
            salesByDay[day] = { amount: 0, count: 0 };
          }
          const amount = Number(order.totalAmount) || 0;
          salesByDay[day].amount += amount;
          salesByDay[day].count += 1;
        } catch (e) {
          console.error('Error processing order date:', e);
        }
      });

      const salesData = Object.values(salesByDay);

      // Order status breakdown with validation
      const ordersByStatus = {
        pending: validOrders.filter(o => o.status === 'pending').length,
        processing: validOrders.filter(o => o.status === 'processing').length,
        delivered: validOrders.filter(o => o.status === 'delivered').length,
        cancelled: validOrders.filter(o => o.status === 'cancelled').length
      };

      // Profit estimation (simplified) with validation
      const deliveredOrders = validOrders.filter(o => o.status === 'delivered');
      const confirmedRevenue = deliveredOrders.reduce((sum, o) => {
        const amount = Number(o.totalAmount) || 0;
        return sum + amount;
      }, 0);

      // Weekly revenue with validation
      const weeklyRevenue = recentOrders.reduce((sum, o) => {
        const amount = Number(o.totalAmount) || 0;
        return sum + amount;
      }, 0);

      // Extract unique categories with validation
      const categories = [...new Set(
        validProducts
          .map(p => p.category)
          .filter(cat => cat && typeof cat === 'string')
      )];

      return {
        // Raw data (validated)
        products: validProducts,
        orders: validOrders,
        customers: validCustomers,
        recentOrders,
        
        // Metrics (all numbers guaranteed safe)
        totalProducts: Math.max(0, totalProducts),
        totalOrders: Math.max(0, totalOrders),
        totalCustomers: Math.max(0, totalCustomers),
        totalRevenue: Math.max(0, totalRevenue),
        confirmedRevenue: Math.max(0, confirmedRevenue),
        weeklyRevenue: Math.max(0, weeklyRevenue),
        averageOrderValue: Math.max(0, averageOrderValue),
        
        // Inventory (validated arrays)
        lowStockProducts,
        outOfStockProducts,
        wellStockedProducts,
        
        // Flags (boolean, never null)
        hasProducts: totalProducts > 0,
        hasOrders: totalOrders > 0,
        hasCustomers: totalCustomers > 0,
        hasLowStock: lowStockProducts.length > 0,
        hasOutOfStock: outOfStockProducts.length > 0,
        hasSalesData: salesData.length > 0,
        
        // Additional data
        salesData,
        ordersByStatus,
        categories
      };
    } catch (error) {
      console.error('Error fetching business context:', error);
      
      // Return safe fallback context
      return {
        products: [],
        orders: [],
        customers: [],
        recentOrders: [],
        totalProducts: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalRevenue: 0,
        confirmedRevenue: 0,
        weeklyRevenue: 0,
        averageOrderValue: 0,
        lowStockProducts: [],
        outOfStockProducts: [],
        wellStockedProducts: [],
        hasProducts: false,
        hasOrders: false,
        hasCustomers: false,
        hasLowStock: false,
        hasOutOfStock: false,
        hasSalesData: false,
        salesData: [],
        ordersByStatus: { pending: 0, processing: 0, delivered: 0, cancelled: 0 },
        categories: []
      };
    }
  }

  /**
   * Analyze user intent and create action plan
   * Uses AI Tool Registry for intelligent tool selection
   * @param {String} userMessage - User's message
   * @param {Array} conversationHistory - Conversation history
   * @param {Object} businessContext - Business context
   * @returns {Object} Action plan with tools to use and reasoning
   */
  async analyzeIntentAndPlan(userMessage, conversationHistory, businessContext) {
    // Use AI Tool Registry to find relevant tools
    const relevantTools = aiToolRegistry.findRelevantTools(userMessage, businessContext);

    // If no tools found, use fallback (chat assistant)
    if (relevantTools.length === 0) {
      const chatTool = aiToolRegistry.getTool('chat_assistant');
      return {
        toolsToUse: ['chat_assistant'],
        reasoning: ['সাধারণ ব্যবসায়িক পরামর্শ প্রদান'],
        priority: 'low'
      };
    }

    // Extract tool IDs and reasoning
    const toolsToUse = relevantTools.map(rt => rt.toolId);
    const reasoning = relevantTools.map(rt => rt.reason);
    const priority = relevantTools[0].priority; // Use highest priority

    return {
      toolsToUse,
      reasoning,
      priority
    };
  }

  /**
   * Helper function to check if message contains keywords
   * @deprecated Use aiToolRegistry.findRelevantTools() instead
   */
  containsKeywords(message, keywords) {
    return keywords.some(keyword => message.includes(keyword.toLowerCase()));
  }

  /**
   * Execute AI modules based on action plan
   * Uses AI Tool Registry for execution
   * @param {Object} actionPlan - Action plan with tools to use
   * @param {Object} businessContext - Business context
   * @returns {Object} Insights from each AI module
   */
  async executeAIModules(actionPlan, businessContext) {
    // Use AI Tool Registry to execute tools in parallel
    const insights = await aiToolRegistry.executeTools(
      actionPlan.toolsToUse,
      businessContext
    );

    return insights;
  }

  /**
   * Generate unified Bangla response from all insights
   * @param {String} userMessage - Original user message
   * @param {Array} conversationHistory - Conversation history
   * @param {Object} businessContext - Business context
   * @param {Object} insights - Insights from AI modules
   * @param {Object} actionPlan - Action plan
   * @returns {String} Unified Bangla response
   */
  async generateUnifiedResponse(userMessage, conversationHistory, businessContext, insights, actionPlan) {
    // Use prompt composer to build structured prompt
    const systemPrompt = promptComposer.composeSystemPrompt();
    const userPrompt = promptComposer.composeUserPrompt(userMessage, businessContext, insights);

    // Call AI to generate unified response
    const unifiedResponse = await aiService.chatWithAI(
      userPrompt,
      [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-4) // Last 4 messages for context
      ]
    );

    // Validate response quality
    const validation = promptComposer.validateResponseStructure(unifiedResponse);
    if (!validation.valid) {
      console.warn('⚠️ Response quality issue:', validation.feedback);
    }

    return unifiedResponse;
  }

  /**
   * Get business health score
   * @param {Object} businessContext - Business context
   * @returns {Object} Health score and recommendations
   */
  getBusinessHealth(businessContext) {
    let score = 50; // Base score
    const issues = [];
    const strengths = [];

    // Inventory health
    if (businessContext.hasOutOfStock) {
      score -= 15;
      issues.push(`${businessContext.outOfStockProducts.length}টি পণ্য স্টক শেষ`);
    }
    if (businessContext.hasLowStock) {
      score -= 10;
      issues.push(`${businessContext.lowStockProducts.length}টি পণ্যের স্টক কম`);
    }
    if (businessContext.wellStockedProducts.length > businessContext.totalProducts * 0.7) {
      score += 10;
      strengths.push('বেশিরভাগ পণ্যের স্টক ভালো আছে');
    }

    // Sales health
    if (businessContext.weeklyRevenue > 10000) {
      score += 15;
      strengths.push('সাপ্তাহিক বিক্রয় ভালো');
    }
    if (businessContext.totalOrders > 50) {
      score += 10;
      strengths.push('ভালো অর্ডার সংখ্যা');
    }

    // Order fulfillment
    const deliveryRate = businessContext.totalOrders > 0 
      ? (businessContext.ordersByStatus.delivered / businessContext.totalOrders) * 100 
      : 0;
    
    if (deliveryRate > 80) {
      score += 15;
      strengths.push('উচ্চ ডেলিভারি হার');
    } else if (deliveryRate < 50) {
      score -= 10;
      issues.push('ডেলিভারি হার কম');
    }

    // Customer base
    if (businessContext.totalCustomers > 20) {
      score += 10;
      strengths.push('ভালো গ্রাহক সংখ্যা');
    }

    return {
      score: Math.min(Math.max(score, 0), 100),
      grade: score >= 80 ? 'চমৎকার' : score >= 60 ? 'ভালো' : score >= 40 ? 'মাঝারি' : 'উন্নতি প্রয়োজন',
      issues,
      strengths
    };
  }

  /**
   * Extract structured, UI-renderable actions from response
   * @param {String} response - MunshiJi's Bangla response
   * @param {Object} businessContext - Business context with data
   * @param {Object} insights - AI tool insights
   * @returns {Array} Structured actions
   */
  extractStructuredActions(response, businessContext, insights) {
    const actions = [];

    // Ensure businessContext has required properties
    if (!businessContext || typeof businessContext !== 'object') {
      return actions;
    }

    // Action 1: Stock Management (if low/out of stock)
    if (businessContext.hasOutOfStock && Array.isArray(businessContext.outOfStockProducts) && businessContext.outOfStockProducts.length > 0) {
      businessContext.outOfStockProducts.forEach(product => {
        actions.push({
          type: 'increase_stock',
          target: {
            entity: 'product',
            productId: product._id,
            productName: product.name,
            currentStock: product.stock,
            suggestedStock: 20
          },
          reason: `"${product.name}" সম্পূর্ণ শেষ। গ্রাহকরা অর্ডার করতে পারছেন না।`,
          priority: 'high',
          urgency: 'urgent'
        });
      });
    }

    if (businessContext.hasLowStock && Array.isArray(businessContext.lowStockProducts) && businessContext.lowStockProducts.length > 0) {
      businessContext.lowStockProducts.slice(0, 5).forEach(product => {
        actions.push({
          type: 'increase_stock',
          target: {
            entity: 'product',
            productId: product._id,
            productName: product.name,
            currentStock: product.stock,
            suggestedStock: Math.max(20, product.stock * 3)
          },
          reason: `"${product.name}" এর স্টক কম (${product.stock}টি)। শীঘ্রই শেষ হয়ে যাবে।`,
          priority: 'medium',
          urgency: 'soon'
        });
      });
    }

    // Action 2: Price Adjustment (if high stock but low sales)
    if (businessContext.hasProducts && Array.isArray(businessContext.products) && Array.isArray(businessContext.recentOrders)) {
      const highStockLowSalesProducts = businessContext.products.filter(p => 
        p.stock > 50 && !businessContext.recentOrders.some(o => 
          Array.isArray(o.items) && o.items.some(item => item.product && item.product.toString() === p._id.toString())
        )
      );

      highStockLowSalesProducts.slice(0, 3).forEach(product => {
        const suggestedDiscount = 10; // 10% discount
        const newPrice = product.price * (1 - suggestedDiscount / 100);

        actions.push({
          type: 'adjust_price',
          target: {
            entity: 'product',
            productId: product._id,
            productName: product.name,
            currentPrice: product.price,
            suggestedPrice: newPrice,
            discount: suggestedDiscount
          },
          reason: `"${product.name}" এর অনেক স্টক আছে (${product.stock}টি) কিন্তু বিক্রয় হচ্ছে না। ${suggestedDiscount}% ছাড় দিলে বিক্রয় বাড়বে।`,
          priority: 'medium',
          urgency: 'normal'
        });
      });
    }

    // Action 3: Promote Top Products
    if (businessContext.hasSalesData && Array.isArray(businessContext.recentOrders) && businessContext.recentOrders.length > 0) {
      // Find top selling products
      const productSales = {};
      businessContext.recentOrders.forEach(order => {
        if (Array.isArray(order.items)) {
          order.items.forEach(item => {
            if (item.product && item.quantity) {
              const productId = item.product.toString();
              productSales[productId] = (productSales[productId] || 0) + item.quantity;
            }
          });
        }
      });

      const topProductIds = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([id]) => id);

      const topProducts = Array.isArray(businessContext.products) 
        ? businessContext.products.filter(p => 
            p._id && topProductIds.includes(p._id.toString())
          )
        : [];

      topProducts.forEach(product => {
        const salesCount = productSales[product._id.toString()];
        
        actions.push({
          type: 'promote_product',
          target: {
            entity: 'product',
            productId: product._id,
            productName: product.name,
            salesCount: salesCount
          },
          reason: `"${product.name}" সবচেয়ে বেশি বিক্রি হয়েছে (${salesCount} বার)। আরো প্রচার করলে বিক্রয় আরো বাড়বে।`,
          priority: 'high',
          urgency: 'normal'
        });
      });
    }

    // Action 4: Marketing Campaign (if low sales)
    if (!businessContext.hasSalesData || businessContext.weeklyRevenue < 5000) {
      actions.push({
        type: 'start_marketing',
        target: {
          entity: 'shop',
          channels: ['facebook', 'instagram', 'whatsapp'],
          budget: 1000
        },
        reason: businessContext.hasSalesData 
          ? `গত সপ্তাহে মাত্র ৳${businessContext.weeklyRevenue.toFixed(0)} বিক্রয় হয়েছে। মার্কেটিং বাড়ালে বিক্রয় বাড়বে।`
          : `গত ৭ দিনে কোনো বিক্রয় নেই। সোশ্যাল মিডিয়ায় প্রচার শুরু করুন।`,
        priority: 'high',
        urgency: 'urgent'
      });
    }

    // Action 5: Customer Engagement (if many customers but low repeat orders)
    if (businessContext.totalCustomers > 10 && businessContext.totalOrders < businessContext.totalCustomers * 2) {
      actions.push({
        type: 'engage_customers',
        target: {
          entity: 'customers',
          count: businessContext.totalCustomers,
          offerType: 'loyalty_discount'
        },
        reason: `${businessContext.totalCustomers} জন গ্রাহক আছেন কিন্তু রিপিট অর্ডার কম। লয়ালটি অফার দিলে তারা আবার কিনবেন।`,
        priority: 'medium',
        urgency: 'normal'
      });
    }

    // Action 6: Improve Delivery (if low delivery rate)
    if (businessContext.ordersByStatus && businessContext.totalOrders > 10) {
      const deliveryRate = businessContext.ordersByStatus.delivered 
        ? (businessContext.ordersByStatus.delivered / businessContext.totalOrders) * 100 
        : 0;

      if (deliveryRate < 70) {
        const pendingCount = businessContext.ordersByStatus.pending || 0;
        
        actions.push({
          type: 'improve_delivery',
          target: {
            entity: 'operations',
            pendingOrders: pendingCount,
            currentRate: deliveryRate,
            targetRate: 90
          },
          reason: `ডেলিভারি হার মাত্র ${deliveryRate.toFixed(0)}%। ${pendingCount}টি অর্ডার অপেক্ষমাণ। দ্রুত ডেলিভার করুন।`,
          priority: 'high',
          urgency: 'urgent'
        });
      }
    }

    // Action 7: Expand Inventory (if doing well)
    if (businessContext.totalRevenue > 50000 && businessContext.totalProducts < 30) {
      actions.push({
        type: 'expand_inventory',
        target: {
          entity: 'shop',
          currentProducts: businessContext.totalProducts,
          suggestedProducts: 50,
          categories: businessContext.categories || []
        },
        reason: `আপনার ব্যবসা ভালো চলছে (৳${businessContext.totalRevenue.toFixed(0)} বিক্রয়)। নতুন পণ্য যোগ করলে আরো বেশি বিক্রয় হবে।`,
        priority: 'low',
        urgency: 'normal'
      });
    }

    // Sort by priority and urgency
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const urgencyOrder = { urgent: 1, soon: 2, normal: 3 };

    actions.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    });

    // Add action IDs and timestamps
    return actions.map((action, index) => ({
      id: `action_${Date.now()}_${index}`,
      ...action,
      createdAt: new Date().toISOString(),
      completed: false
    }));
  }
}

// Export singleton instance
export const munshiJiService = new MunshiJiService();
