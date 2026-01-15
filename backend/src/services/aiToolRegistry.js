import { aiService } from './aiService.js';

/**
 * AI Tool Registry
 * 
 * Central registry for all AI tools available to MunshiJi.
 * Defines tool metadata, execution logic, and conditions for when to use each tool.
 * 
 * Benefits:
 * - Single source of truth for all AI capabilities
 * - Easy to add new tools
 * - No duplicated logic
 * - Conditional execution based on context
 */

class AIToolRegistry {
  constructor() {
    this.tools = new Map();
    this.registerAllTools();
  }

  /**
   * Register all available AI tools
   */
  registerAllTools() {
    // 1. Business Insights Tool
    this.registerTool({
      id: 'business_insights',
      name: 'ব্যবসা বিশ্লেষণ',
      icon: '📊',
      description: 'ব্যবসায়িক তথ্যের উপর ভিত্তি করে পরামর্শ এবং অন্তর্দৃষ্টি প্রদান করে',
      keywords: ['বিক্রয়', 'sales', 'ব্যবসা', 'business', 'বিশ্লেষণ', 'analysis', 'অবস্থা', 'status', 'কেমন', 'how'],
      shouldExecute: (context, query) => {
        // Execute if query is about business or has sufficient data
        return context.hasOrders || context.hasProducts;
      },
      execute: async (context) => {
        const stats = {
          totalSales: context.totalRevenue,
          totalOrders: context.totalOrders,
          totalProducts: context.totalProducts,
          totalCustomers: context.totalCustomers,
          averageOrderValue: context.averageOrderValue.toFixed(2)
        };
        return await aiService.generateBusinessInsights(stats);
      },
      priority: 'medium'
    });

    // 2. Sales Trend Analysis Tool
    this.registerTool({
      id: 'sales_trend',
      name: 'বিক্রয় ট্রেন্ড',
      icon: '📈',
      description: 'বিক্রয় প্রবণতা বিশ্লেষণ করে এবং পূর্বাভাস প্রদান করে',
      keywords: ['ট্রেন্ড', 'trend', 'প্রবণতা', 'পূর্বাভাস', 'forecast', 'ভবিষ্যত', 'future', 'গত', 'last', 'সপ্তাহ', 'week', 'দিন', 'day'],
      shouldExecute: (context, query) => {
        // Execute only if sales data is available
        return context.hasSalesData && context.salesData.length > 0;
      },
      execute: async (context) => {
        if (context.salesData.length === 0) {
          return 'গত ৭ দিনে পর্যাপ্ত বিক্রয় তথ্য নেই।';
        }
        return await aiService.analyzeSalesTrend(context.salesData);
      },
      priority: 'medium'
    });

    // 3. Inventory Advice Tool
    this.registerTool({
      id: 'inventory_advice',
      name: 'ইনভেন্টরি পরামর্শ',
      icon: '📦',
      description: 'ইনভেন্টরি ব্যবস্থাপনার জন্য স্মার্ট পরামর্শ প্রদান করে',
      keywords: ['স্টক', 'stock', 'ইনভেন্টরি', 'inventory', 'কম', 'low', 'শেষ', 'finish', 'পণ্য', 'product'],
      shouldExecute: (context, query) => {
        // Execute if has products, especially if stock issues exist
        return context.hasProducts;
      },
      execute: async (context) => {
        if (context.products.length === 0) {
          return 'এখনও কোনো পণ্য যোগ করা হয়নি।';
        }
        return await aiService.generateInventoryAdvice(context.products);
      },
      priority: (context) => {
        // High priority if stock issues exist
        return (context.hasLowStock || context.hasOutOfStock) ? 'high' : 'medium';
      }
    });

    // 4. Order Report Tool
    this.registerTool({
      id: 'order_report',
      name: 'অর্ডার রিপোর্ট',
      icon: '📋',
      description: 'অর্ডারের বিস্তারিত রিপোর্ট তৈরি করে',
      keywords: ['রিপোর্ট', 'report', 'প্রতিবেদন', 'অর্ডার', 'order', 'মাস', 'month', 'সপ্তাহ', 'week'],
      shouldExecute: (context, query) => {
        // Execute if orders exist
        return context.hasOrders && context.orders.length > 0;
      },
      execute: async (context) => {
        if (context.orders.length === 0) {
          return 'এখনও কোনো অর্ডার নেই।';
        }
        return await aiService.generateOrderReport(context.orders, 'সব সময়');
      },
      priority: 'low'
    });

    // 5. Product Description Tool
    this.registerTool({
      id: 'product_description',
      name: 'পণ্য বর্ণনা',
      icon: '📝',
      description: 'পণ্যের জন্য আকর্ষণীয় বাংলা বর্ণনা তৈরি করে',
      keywords: ['পণ্য', 'product', 'বর্ণনা', 'description', 'লিখ', 'write', 'তৈরি', 'create'],
      shouldExecute: (context, query) => {
        // Execute only if query specifically asks for product description
        const descKeywords = ['বর্ণনা', 'description', 'লিখ', 'write'];
        return descKeywords.some(kw => query.toLowerCase().includes(kw.toLowerCase()));
      },
      execute: async (context, params = {}) => {
        if (params.productName && params.category) {
          return await aiService.generateProductDescription(
            params.productName,
            params.category,
            params.price || 0,
            params.features || []
          );
        }
        return 'পণ্যের বর্ণনা তৈরি করতে, অনুগ্রহ করে পণ্যের নাম, ক্যাটাগরি এবং মূল্য উল্লেখ করুন।';
      },
      priority: 'medium',
      requiresParams: true
    });

    // 6. Customer Message Tool
    this.registerTool({
      id: 'customer_message',
      name: 'গ্রাহক বার্তা',
      icon: '💬',
      description: 'গ্রাহকদের জন্য পেশাদার SMS/বার্তা তৈরি করে',
      keywords: ['গ্রাহক', 'customer', 'বার্তা', 'message', 'SMS', 'sms', 'পাঠা', 'send', 'reminder', 'রিমাইন্ডার'],
      shouldExecute: (context, query) => {
        // Execute only if query specifically asks for customer message
        const msgKeywords = ['বার্তা', 'message', 'sms', 'পাঠা', 'send'];
        return msgKeywords.some(kw => query.toLowerCase().includes(kw.toLowerCase()));
      },
      execute: async (context, params = {}) => {
        if (params.customerName && params.messageType) {
          return await aiService.generateCustomerMessage(
            params.customerName,
            params.messageType,
            params.context || {}
          );
        }
        return 'গ্রাহক বার্তা তৈরি করতে, গ্রাহকের নাম এবং বার্তার ধরন (payment reminder, promotional ইত্যাদি) উল্লেখ করুন।';
      },
      priority: 'low',
      requiresParams: true
    });

    // 7. AI Chat Assistant Tool
    this.registerTool({
      id: 'chat_assistant',
      name: 'AI চ্যাট',
      icon: '💭',
      description: 'সাধারণ ব্যবসায়িক প্রশ্নের উত্তর দেয়',
      keywords: [], // No specific keywords - used as fallback
      shouldExecute: (context, query) => {
        // Always available as fallback
        return true;
      },
      execute: async (context, params = {}) => {
        const { userMessage, conversationHistory } = params;
        if (!userMessage) return null;
        return await aiService.chatWithAI(userMessage, conversationHistory || []);
      },
      priority: 'low',
      isFallback: true
    });
  }

  /**
   * Register a single tool
   * @param {Object} toolConfig - Tool configuration
   */
  registerTool(toolConfig) {
    const requiredFields = ['id', 'name', 'description', 'execute'];
    const missingFields = requiredFields.filter(field => !toolConfig[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Tool registration failed. Missing fields: ${missingFields.join(', ')}`);
    }

    this.tools.set(toolConfig.id, {
      ...toolConfig,
      keywords: toolConfig.keywords || [],
      icon: toolConfig.icon || '🔧',
      priority: toolConfig.priority || 'medium',
      shouldExecute: toolConfig.shouldExecute || (() => true),
      requiresParams: toolConfig.requiresParams || false,
      isFallback: toolConfig.isFallback || false
    });
  }

  /**
   * Get a tool by ID
   * @param {String} toolId - Tool identifier
   * @returns {Object} Tool configuration
   */
  getTool(toolId) {
    return this.tools.get(toolId);
  }

  /**
   * Get all registered tools
   * @returns {Array} Array of all tools
   */
  getAllTools() {
    return Array.from(this.tools.values());
  }

  /**
   * Find relevant tools based on query and context
   * @param {String} query - User query
   * @param {Object} context - Business context
   * @returns {Array} Array of relevant tool IDs with priority
   */
  findRelevantTools(query, context) {
    const queryLower = query.toLowerCase();
    const relevantTools = [];

    for (const [toolId, tool] of this.tools) {
      // Skip fallback tools in initial matching
      if (tool.isFallback) continue;

      // Check if tool should execute based on context
      if (!tool.shouldExecute(context, query)) continue;

      // Check keyword match
      const hasKeywordMatch = tool.keywords.length === 0 || 
        tool.keywords.some(keyword => queryLower.includes(keyword.toLowerCase()));

      if (hasKeywordMatch) {
        const priority = typeof tool.priority === 'function' 
          ? tool.priority(context) 
          : tool.priority;

        relevantTools.push({
          toolId,
          tool,
          priority,
          reason: this.generateReason(tool, context)
        });
      }
    }

    // Sort by priority: high > medium > low
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    relevantTools.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

    return relevantTools;
  }

  /**
   * Generate reasoning for why a tool was selected
   * @param {Object} tool - Tool configuration
   * @param {Object} context - Business context
   * @returns {String} Reasoning in Bangla
   */
  generateReason(tool, context) {
    const reasons = {
      business_insights: 'ব্যবসায়িক বিশ্লেষণ প্রয়োজন',
      sales_trend: 'বিক্রয় প্রবণতা বিশ্লেষণ প্রয়োজন',
      inventory_advice: context.hasLowStock || context.hasOutOfStock 
        ? 'জরুরি: স্টক সমস্যা সনাক্ত' 
        : 'ইনভেন্টরি পরামর্শ প্রয়োজন',
      order_report: 'অর্ডার রিপোর্ট তৈরির অনুরোধ',
      product_description: 'পণ্যের বর্ণনা তৈরির অনুরোধ',
      customer_message: 'গ্রাহক বার্তা তৈরির অনুরোধ',
      chat_assistant: 'সাধারণ ব্যবসায়িক পরামর্শ'
    };

    return reasons[tool.id] || `${tool.name} প্রয়োজন`;
  }

  /**
   * Execute a tool with given context and parameters
   * @param {String} toolId - Tool ID
   * @param {Object} context - Business context
   * @param {Object} params - Additional parameters
   * @returns {Promise} Tool execution result
   */
  async executeTool(toolId, context, params = {}) {
    const tool = this.getTool(toolId);
    if (!tool) {
      throw new Error(`Tool not found: ${toolId}`);
    }

    try {
      return await tool.execute(context, params);
    } catch (error) {
      console.error(`Error executing tool ${toolId}:`, error);
      throw error;
    }
  }

  /**
   * Execute multiple tools in parallel
   * @param {Array} toolIds - Array of tool IDs
   * @param {Object} context - Business context
   * @param {Object} params - Additional parameters
   * @returns {Object} Map of toolId to result
   */
  async executeTools(toolIds, context, params = {}) {
    const results = {};
    
    const executions = toolIds.map(async (toolId) => {
      try {
        const result = await this.executeTool(toolId, context, params);
        results[toolId] = result;
      } catch (error) {
        console.error(`Failed to execute ${toolId}:`, error);
        results[toolId] = `${toolId} এ সমস্যা হয়েছে।`;
      }
    });

    await Promise.all(executions);
    return results;
  }

  /**
   * Get tool metadata for frontend display
   * @returns {Array} Array of tool metadata
   */
  getToolMetadata() {
    return this.getAllTools().map(tool => ({
      id: tool.id,
      name: tool.name,
      icon: tool.icon,
      description: tool.description
    }));
  }

  /**
   * Check if a tool requires additional parameters
   * @param {String} toolId - Tool ID
   * @returns {Boolean}
   */
  toolRequiresParams(toolId) {
    const tool = this.getTool(toolId);
    return tool ? tool.requiresParams : false;
  }
}

// Export singleton instance
export const aiToolRegistry = new AIToolRegistry();
