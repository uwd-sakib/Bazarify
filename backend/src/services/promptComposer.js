/**
 * MunshiJi Prompt Composer
 * 
 * Composes high-quality prompts for AI responses with:
 * - Bangla language
 * - Experienced business mentor tone
 * - Real numbers from business context
 * - Specific, actionable advice (no generic advice)
 * 
 * Structure:
 * 1. Situation summary
 * 2. Key problem identification
 * 3. Clear recommendation
 * 4. Action steps (when applicable)
 */

class PromptComposer {
  /**
   * Compose system prompt for MunshiJi
   * @returns {String} System prompt in Bangla
   */
  composeSystemPrompt() {
    return `আপনি "মুন্সিজি" - একজন অভিজ্ঞ বাংলাদেশী ব্যবসায়িক পরামর্শদাতা এবং মেন্টর।

**আপনার ভূমিকা:**
- আপনি ছোট ও মাঝারি ব্যবসায়ীদের (SME) বিশ্বস্ত উপদেষ্টা
- ৩০+ বছরের ব্যবসায়িক অভিজ্ঞতা আছে
- বাংলাদেশের বাজার ও ব্যবসায়িক পরিবেশ সম্পর্কে গভীর জ্ঞান আছে
- প্রতিটি ব্যবসার নির্দিষ্ট সংখ্যা ও তথ্যের উপর ভিত্তি করে পরামর্শ দেন

**উত্তরের গঠন (সবসময় এই ক্রম অনুসরণ করুন):**

১. **পরিস্থিতি সংক্ষেপ** 
   - ব্যবসার বর্তমান অবস্থা সংক্ষেপে বর্ণনা করুন
   - প্রকৃত সংখ্যা ও পরিসংখ্যান ব্যবহার করুন (যেমন: "আপনার ৪৫টি পণ্য আছে", "গত সপ্তাহে ৳১২,০০০ বিক্রয়")
   - সাধারণ বক্তব্য এড়িয়ে চলুন

২. **মূল সমস্যা চিহ্নিতকরণ**
   - একটি বা দুইটি প্রধান সমস্যা বা সুযোগ চিহ্নিত করুন
   - সুনির্দিষ্ট হোন (যেমন: "৫টি পণ্যের স্টক ১০-এর নিচে" না লিখে "স্টক কম")
   - জরুরী বিষয়গুলো প্রথমে উল্লেখ করুন

৩. **স্পষ্ট সুপারিশ**
   - সুনির্দিষ্ট এবং কার্যকর পরামর্শ দিন
   - ব্যবসার বাস্তব সংখ্যার সাথে সম্পর্কিত করুন
   - কেন এই পরামর্শ দিচ্ছেন তা ব্যাখ্যা করুন

৪. **কর্মপদক্ষেপ** (যখন প্রযোজ্য)
   - ধাপে ধাপে কী করতে হবে তা বলুন
   - অগ্রাধিকার অনুযায়ী সাজান
   - বাস্তবায়নযোগ্য পদক্ষেপ দিন

**আপনার স্টাইল:**
- বাংলায় কথা বলুন (সবসময়)
- বন্ধুত্বপূর্ণ কিন্তু পেশাদার
- সরাসরি এবং সৎ (কোনো কিছু লুকাবেন না)
- উৎসাহব্যঞ্জক এবং ইতিবাচক
- ব্যবহারকারীকে "আপনি" সম্বোধন করুন

**যা করবেন না:**
❌ সাধারণ পরামর্শ (যেমন: "ভালো সেবা দিন", "মার্কেটিং করুন")
❌ অস্পষ্ট বক্তব্য (যেমন: "কিছু পণ্য", "প্রায়", "সম্ভবত")
❌ প্রকৃত সংখ্যা উল্লেখ না করা
❌ দীর্ঘ প্যারাগ্রাফ - সংক্ষিপ্ত ও পয়েন্ট আকারে লিখুন
❌ ইংরেজি শব্দ (প্রয়োজন ছাড়া)

**উদাহরণ (ভালো উত্তর):**

**পরিস্থিতি:** আপনার ব্যবসায়ে বর্তমানে ৪৫টি পণ্য আছে এবং গত সপ্তাহে ৳৮২,০০০ টাকা বিক্রয় হয়েছে। মোট ১২৩টি অর্ডার এসেছে।

**মূল সমস্যা:** ৫টি জনপ্রিয় পণ্যের স্টক ১০-এর নিচে নেমে গেছে এবং ২টি পণ্য সম্পূর্ণ শেষ। এর ফলে আপনি নতুন অর্ডার হারাচ্ছেন।

**সুপারিশ:** অবিলম্বে এই ৭টি পণ্যের স্টক পুনরায় পূরণ করুন। গত মাসে এই পণ্যগুলো থেকে ৩৫% আয় এসেছে, তাই দ্রুত পদক্ষেপ না নিলে বিক্রয় কমবে।

**পদক্ষেপ:**
১. আজই সরবরাহকারীকে অর্ডার দিন
২. প্রতি পণ্যের জন্য ন্যূনতম ২০টি স্টক রাখুন
৩. সপ্তাহে একবার স্টক পরীক্ষা করুন`;
  }

  /**
   * Compose user prompt with business context
   * @param {String} userQuestion - User's original question
   * @param {Object} businessContext - Business context with real data
   * @param {Object} toolInsights - Insights from AI tools
   * @returns {String} Structured prompt in Bangla
   */
  composeUserPrompt(userQuestion, businessContext, toolInsights = {}) {
    // Build situation summary with real numbers
    const situation = this.buildSituationSummary(businessContext);
    
    // Extract key problems
    const problems = this.identifyKeyProblems(businessContext);
    
    // Compile tool insights
    const insights = this.compileToolInsights(toolInsights);
    
    return `**ব্যবহারকারীর প্রশ্ন:** "${userQuestion}"

**ব্যবসার বর্তমান পরিস্থিতি:**
${situation}

${problems ? `**চিহ্নিত সমস্যা/সতর্কতা:**\n${problems}\n` : ''}
${insights ? `**AI টুল থেকে প্রাপ্ত বিশ্লেষণ:**\n${insights}\n` : ''}

**নির্দেশনা:**
উপরের প্রকৃত তথ্য ও সংখ্যা ব্যবহার করে ব্যবহারকারীর প্রশ্নের উত্তর দিন। 
নির্ধারিত গঠন অনুসরণ করুন: পরিস্থিতি → সমস্যা → সুপারিশ → পদক্ষেপ।
সাধারণ পরামর্শ এড়িয়ে চলুন। সুনির্দিষ্ট সংখ্যা ও তথ্য উল্লেখ করুন।`;
  }

  /**
   * Build situation summary with real numbers
   * @param {Object} context - Business context
   * @returns {String} Situation summary in Bangla
   */
  buildSituationSummary(context) {
    const parts = [];

    // Products
    if (context.hasProducts) {
      parts.push(`• মোট পণ্য: ${context.totalProducts}টি`);
      
      if (context.categories && context.categories.length > 0) {
        parts.push(`• ক্যাটাগরি: ${context.categories.length}টি (${context.categories.slice(0, 3).join(', ')}${context.categories.length > 3 ? ' ইত্যাদি' : ''})`);
      }
    }

    // Sales & Revenue
    if (context.totalRevenue > 0) {
      parts.push(`• মোট বিক্রয়: ৳${this.formatNumber(context.totalRevenue)}`);
    }

    if (context.totalOrders > 0) {
      parts.push(`• মোট অর্ডার: ${context.totalOrders}টি`);
      
      // Confirmed revenue
      if (context.confirmedRevenue > 0 && context.confirmedRevenue !== context.totalRevenue) {
        parts.push(`• নিশ্চিত আয়: ৳${this.formatNumber(context.confirmedRevenue)}`);
      }
      
      // Average order value
      if (context.averageOrderValue > 0) {
        parts.push(`• গড় অর্ডার মূল্য: ৳${this.formatNumber(context.averageOrderValue)}`);
      }
    }

    // Customers
    if (context.totalCustomers > 0) {
      parts.push(`• মোট গ্রাহক: ${context.totalCustomers} জন`);
    }

    // Recent performance
    if (context.weeklyRevenue > 0) {
      parts.push(`• গত ৭ দিনের বিক্রয়: ৳${this.formatNumber(context.weeklyRevenue)}`);
    }

    // Order status
    if (context.ordersByStatus) {
      const delivered = context.ordersByStatus.delivered || 0;
      const pending = context.ordersByStatus.pending || 0;
      
      if (delivered > 0) {
        parts.push(`• সফল ডেলিভারি: ${delivered}টি`);
      }
      if (pending > 0) {
        parts.push(`• অপেক্ষমাণ: ${pending}টি`);
      }
    }

    return parts.join('\n');
  }

  /**
   * Identify key problems from context
   * @param {Object} context - Business context
   * @returns {String} Problems in Bangla
   */
  identifyKeyProblems(context) {
    const problems = [];

    // Handle completely empty shop
    if (!context.hasProducts && !context.hasOrders && !context.hasCustomers) {
      return `নতুন দোকান: প্রথমে পণ্য যোগ করুন, তারপর গ্রাহকদের জানান`;
    }

    // No products (but has other data)
    if (!context.hasProducts) {
      problems.push(`🛍️ কোনো পণ্য যোগ করা হয়নি - প্রথমে পণ্য যোগ করুন`);
      return problems.join('\n');
    }

    // Critical: Out of stock
    if (context.hasOutOfStock && context.outOfStockProducts.length > 0) {
      const productNames = context.outOfStockProducts.slice(0, 3).map(p => p.name).join(', ');
      problems.push(`🚨 জরুরী: ${context.outOfStockProducts.length}টি পণ্য সম্পূর্ণ শেষ (${productNames}${context.outOfStockProducts.length > 3 ? ' ইত্যাদি' : ''})`);
    }

    // Important: Low stock
    if (context.hasLowStock && context.lowStockProducts.length > 0) {
      const productNames = context.lowStockProducts.slice(0, 3).map(p => p.name).join(', ');
      problems.push(`⚠️ সতর্কতা: ${context.lowStockProducts.length}টি পণ্যের স্টক কম (১০-এর নিচে) - ${productNames}${context.lowStockProducts.length > 3 ? ' সহ আরো' : ''}`);
    }

    // No sales data
    if (!context.hasSalesData && context.hasProducts) {
      problems.push(`📊 গত ৭ দিনে কোনো বিক্রয় নেই - মার্কেটিং ও প্রচার প্রয়োজন`);
    }

    // No orders at all
    if (!context.hasOrders && context.hasProducts) {
      problems.push(`📉 এখনো কোনো অর্ডার আসেনি - প্রচার শুরু করুন, গ্রাহকদের জানান`);
    }

    // Low order count (only if has orders)
    if (context.totalOrders > 0 && context.totalOrders < 10) {
      problems.push(`📉 অর্ডার সংখ্যা কম (মাত্র ${context.totalOrders}টি) - গ্রাহক আকর্ষণ প্রয়োজন`);
    }

    // Poor delivery rate (only if enough orders)
    if (context.ordersByStatus && context.totalOrders > 10) {
      const delivered = context.ordersByStatus.delivered || 0;
      const deliveryRate = (delivered / context.totalOrders) * 100;
      if (deliveryRate < 70) {
        problems.push(`📦 ডেলিভারি হার কম (${Math.round(deliveryRate)}%) - অর্ডার প্রসেসিং উন্নত করুন`);
      }
    }

    return problems.length > 0 ? problems.join('\n') : '';
  }

  /**
   * Compile insights from AI tools
   * @param {Object} toolInsights - Results from AI tools
   * @returns {String} Compiled insights in Bangla
   */
  compileToolInsights(toolInsights) {
    const insights = [];

    // Map tool IDs to Bangla names
    const toolNames = {
      business_insights: '📊 ব্যবসায়িক বিশ্লেষণ',
      sales_trend: '📈 বিক্রয় প্রবণতা',
      inventory_advice: '📦 ইনভেন্টরি পরামর্শ',
      order_report: '📋 অর্ডার রিপোর্ট',
      product_description: '📝 পণ্য বর্ণনা',
      customer_message: '💬 গ্রাহক বার্তা',
      chat_assistant: '💭 সাধারণ পরামর্শ'
    };

    for (const [toolId, insight] of Object.entries(toolInsights)) {
      if (!insight || insight.length === 0) continue;
      
      const toolName = toolNames[toolId] || toolId;
      insights.push(`\n**${toolName}:**\n${insight}`);
    }

    return insights.join('\n');
  }

  /**
   * Format number for Bangla display
   * @param {Number} num - Number to format
   * @returns {String} Formatted number
   */
  formatNumber(num) {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * Compose follow-up prompt for clarification
   * @param {String} userQuestion - User's question
   * @param {Array} missingInfo - List of missing information
   * @returns {String} Clarification prompt in Bangla
   */
  composeClairificationPrompt(userQuestion, missingInfo) {
    return `আপনার প্রশ্ন "${userQuestion}" এর সঠিক উত্তর দিতে নিম্নলিখিত তথ্য প্রয়োজন:

${missingInfo.map((info, idx) => `${idx + 1}. ${info}`).join('\n')}

দয়া করে এই তথ্যগুলো প্রদান করুন।`;
  }

  /**
   * Compose success response template
   * @param {String} actionTaken - Action that was taken
   * @param {Object} result - Result details
   * @returns {String} Success message in Bangla
   */
  composeSuccessMessage(actionTaken, result = {}) {
    return `✅ সফল: ${actionTaken}

${result.details ? result.details : ''}

${result.nextSteps ? `**পরবর্তী পদক্ষেপ:**\n${result.nextSteps}` : ''}`;
  }

  /**
   * Compose error response with helpful guidance
   * @param {String} errorType - Type of error
   * @param {String} context - Error context
   * @returns {String} Error message in Bangla
   */
  composeErrorMessage(errorType, context = '') {
    const errorMessages = {
      no_data: 'দুঃখিত, পর্যাপ্ত তথ্য পাওয়া যায়নি। প্রথমে পণ্য ও অর্ডার যোগ করুন।',
      api_error: 'একটি প্রযুক্তিগত সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।',
      invalid_input: 'আপনার প্রশ্ন বুঝতে পারিনি। অনুগ্রহ করে আরো স্পষ্ট করে জিজ্ঞাসা করুন।',
      insufficient_permissions: 'এই কাজটি করার অনুমতি নেই।'
    };

    const message = errorMessages[errorType] || 'একটি সমস্যা হয়েছে।';
    
    return `❌ ${message}

${context ? `\n${context}` : ''}

কোনো সাহায্য লাগলে আবার জিজ্ঞাসা করুন।`;
  }

  /**
   * Validate if response follows structure
   * @param {String} response - AI generated response
   * @returns {Object} Validation result
   */
  validateResponseStructure(response) {
    const hasRealNumbers = /\d+/.test(response);
    const hasBangla = /[\u0980-\u09FF]/.test(response);
    const isNotGeneric = !response.includes('সাধারণভাবে') && !response.includes('সাধারণত');
    
    return {
      valid: hasRealNumbers && hasBangla && isNotGeneric,
      hasRealNumbers,
      hasBangla,
      isNotGeneric,
      feedback: !hasRealNumbers ? 'প্রকৃত সংখ্যা উল্লেখ করুন' :
                !hasBangla ? 'বাংলায় উত্তর দিন' :
                !isNotGeneric ? 'সুনির্দিষ্ট পরামর্শ দিন' : 'ভালো আছে'
    };
  }
}

// Export singleton instance
export const promptComposer = new PromptComposer();
