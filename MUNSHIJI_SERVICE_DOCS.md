# MunshiJiService - Technical Documentation

## Overview

`MunshiJiService` is the central AI orchestration service for Bazarify. It acts as the "brain" that decides which AI features to use based on user queries and business context.

## Architecture

```
User Query → MunshiJiService → Decision Engine → Execute AI Modules → Unified Response
```

## Key Responsibilities

### 1. **Business Context Fetching**
- Retrieves all relevant business data (products, orders, customers)
- Calculates key metrics (revenue, average order value, etc.)
- Analyzes inventory health (low stock, out of stock)
- Processes sales trends (last 7 days)

### 2. **Intent Analysis & Planning**
- Analyzes user query for keywords and intent
- Determines which AI modules are relevant
- Creates an action plan with reasoning
- Prioritizes urgent issues (e.g., stock shortages)

### 3. **AI Module Execution**
- Calls existing AI service functions based on plan
- Handles errors gracefully
- Collects insights from multiple sources

### 4. **Response Unification**
- Merges insights from all AI modules
- Uses AI to create coherent Bangla response
- Maintains professional and helpful tone

## Class Structure

```javascript
class MunshiJiService {
  // Main entry point
  async processRequest(userMessage, conversationHistory, shopId)
  
  // Context fetching
  async fetchBusinessContext(shopId)
  
  // Intent analysis
  async analyzeIntentAndPlan(userMessage, conversationHistory, businessContext)
  
  // Helper for keyword detection
  containsKeywords(message, keywords)
  
  // Module execution
  async executeAIModules(actionPlan, businessContext)
  
  // Response generation
  async generateUnifiedResponse(userMessage, conversationHistory, businessContext, insights, actionPlan)
  
  // Health scoring
  getBusinessHealth(businessContext)
}
```

## Decision Logic

### Keyword-Based Intent Detection

The service uses keyword matching to understand user intent:

#### Product Queries
**Keywords:** `পণ্য`, `product`, `বর্ণনা`, `description`, `লিখ`, `write`  
**Action:** Call `product_description` tool

#### Inventory Queries
**Keywords:** `স্টক`, `stock`, `ইনভেন্টরি`, `inventory`, `কম`, `low`, `শেষ`, `finish`  
**Action:** Call `inventory_advice` tool  
**Priority:** HIGH if low/out of stock detected

#### Business Analysis Queries
**Keywords:** `বিক্রয়`, `sales`, `ব্যবসা`, `business`, `বিশ্লেষণ`, `analysis`, `অবস্থা`, `status`  
**Action:** Call `business_insights` + `sales_trend` (if data available)

#### Sales Trend Queries
**Keywords:** `ট্রেন্ড`, `trend`, `প্রবণতা`, `পূর্বাভাস`, `forecast`, `গত`, `last`, `সপ্তাহ`, `week`  
**Action:** Call `sales_trend` tool

#### Customer Message Queries
**Keywords:** `গ্রাহক`, `customer`, `বার্তা`, `message`, `SMS`, `পাঠা`, `send`, `reminder`  
**Action:** Call `customer_message` tool

#### Report Queries
**Keywords:** `রিপোর্ট`, `report`, `প্রতিবেদন`, `অর্ডার`, `order`, `মাস`, `month`  
**Action:** Call `order_report` tool

#### Comprehensive Queries
**Keywords:** `সব`, `all`, `সম্পূর্ণ`, `complete`, `সার্বিক`, `overall`, `পরামর্শ`, `advice`  
**Action:** Call multiple tools for complete analysis

## Business Context Structure

```javascript
{
  // Raw data
  products: [...],
  orders: [...],
  customers: [...],
  
  // Metrics
  totalProducts: 45,
  totalOrders: 123,
  totalCustomers: 67,
  totalRevenue: 156000,
  confirmedRevenue: 142000,
  averageOrderValue: 1268.29,
  
  // Inventory insights
  lowStockProducts: [...],      // Stock < 10
  outOfStockProducts: [...],    // Stock = 0
  wellStockedProducts: [...],   // Stock >= 10
  inventoryHealth: {
    total: 45,
    lowStock: 5,
    outOfStock: 2,
    wellStocked: 38
  },
  
  // Sales insights
  salesData: [
    { amount: 12000, count: 8 },
    { amount: 15000, count: 10 },
    // ... last 7 days
  ],
  recentOrders: [...],
  weeklyRevenue: 82000,
  
  // Order breakdown
  ordersByStatus: {
    pending: 12,
    processing: 8,
    delivered: 95,
    cancelled: 8
  },
  
  // Categories
  categories: ['Electronics', 'Fashion', ...],
  
  // Flags
  hasLowStock: true,
  hasOutOfStock: true,
  hasSalesData: true,
  hasOrders: true,
  hasProducts: true
}
```

## Action Plan Structure

```javascript
{
  toolsToUse: ['business_insights', 'sales_trend', 'inventory_advice'],
  reasoning: [
    'ব্যবহারকারী পূর্ণ বিশ্লেষণ চাইছেন',
    'বিক্রয় ট্রেন্ড ডেটা উপলব্ধ',
    'জরুরি: স্টক সমস্যা সনাক্ত'
  ],
  priority: 'high'  // or 'medium', 'low'
}
```

## Response Structure

```javascript
{
  response: "বাংলায় সম্পূর্ণ উত্তর...",
  insights: {
    businessInsights: "...",
    salesTrend: "...",
    inventoryAdvice: "..."
  },
  toolsUsed: ['business_insights', 'sales_trend', 'inventory_advice'],
  reasoning: ["কারণ ১", "কারণ ২", ...],
  context: {
    totalProducts: 45,
    totalOrders: 123,
    totalRevenue: 156000,
    lowStockCount: 5
  }
}
```

## Business Health Scoring

The service calculates a business health score (0-100) based on:

### Positive Factors (+)
- Well-stocked inventory (+10)
- Weekly revenue > ₹10,000 (+15)
- Total orders > 50 (+10)
- Delivery rate > 80% (+15)
- Customer base > 20 (+10)

### Negative Factors (-)
- Out of stock products (-15)
- Low stock products (-10)
- Delivery rate < 50% (-10)

### Health Grades
- **চমৎকার** (Excellent): 80-100
- **ভালো** (Good): 60-79
- **মাঝারি** (Medium): 40-59
- **উন্নতি প্রয়োজন** (Needs Improvement): 0-39

## Usage Example

### Basic Usage

```javascript
import { munshiJiService } from '../services/munshiJiService.js';

// In controller
const result = await munshiJiService.processRequest(
  "আমার ব্যবসার অবস্থা কেমন?",
  [],  // conversation history
  shopId
);

console.log(result.response);  // Bangla response
console.log(result.toolsUsed); // ['business_insights', 'sales_trend']
console.log(result.reasoning); // ['ব্যবসায়িক বিশ্লেষণ প্রয়োজন', ...]
```

### Advanced Usage with History

```javascript
const conversationHistory = [
  {
    role: 'user',
    content: 'আমার মোট বিক্রয় কত?'
  },
  {
    role: 'assistant',
    content: 'আপনার মোট বিক্রয় ৳১,৫৬,০০০'
  }
];

const result = await munshiJiService.processRequest(
  "এটা কি ভালো?",
  conversationHistory,
  shopId
);
```

## Integration with Existing AI Services

MunshiJiService **DOES NOT** replace existing AI services. It orchestrates them:

```javascript
// MunshiJiService calls existing functions
await aiService.generateBusinessInsights(stats);
await aiService.analyzeSalesTrend(salesData);
await aiService.generateInventoryAdvice(products);
await aiService.generateOrderReport(orders, period);
await aiService.chatWithAI(message, history);
```

## Error Handling

- Gracefully handles missing data (no products, no orders)
- Continues processing even if one AI module fails
- Provides helpful fallback messages
- Logs errors for debugging

## Performance Considerations

### Optimizations
- Uses `.lean()` for faster MongoDB queries
- Parallel fetching of products, orders, customers
- Caches frequently used calculations
- Removes duplicate tool calls

### Typical Response Times
- Context fetching: 200-500ms
- Intent analysis: 50-100ms
- AI module execution: 1-3s per module
- Response unification: 1-2s
- **Total:** 3-8 seconds (depends on number of tools)

## Future Enhancements

### Planned Features
1. **Machine Learning**: Learn from user preferences over time
2. **Caching**: Cache business context for faster responses
3. **Predictive Analysis**: Proactive suggestions based on patterns
4. **Custom Rules**: Shop-specific business rules
5. **Webhook Integration**: Trigger actions based on AI recommendations

### Potential Optimizations
1. Redis caching for business context
2. WebSocket for real-time updates
3. Background processing for complex analysis
4. Rate limiting for API calls

## Testing

### Unit Tests

```javascript
describe('MunshiJiService', () => {
  it('should detect inventory queries', () => {
    const plan = munshiJiService.analyzeIntentAndPlan(
      'কোন পণ্যের স্টক কম?',
      [],
      mockContext
    );
    expect(plan.toolsToUse).toContain('inventory_advice');
  });

  it('should prioritize urgent stock issues', () => {
    const contextWithLowStock = {
      ...mockContext,
      hasLowStock: true,
      lowStockProducts: [...]
    };
    const plan = munshiJiService.analyzeIntentAndPlan(
      'স্টক দেখান',
      [],
      contextWithLowStock
    );
    expect(plan.priority).toBe('high');
  });
});
```

### Integration Tests

```javascript
describe('MunshiJiService Integration', () => {
  it('should fetch complete business context', async () => {
    const context = await munshiJiService.fetchBusinessContext(testShopId);
    expect(context).toHaveProperty('totalProducts');
    expect(context).toHaveProperty('salesData');
    expect(context).toHaveProperty('inventoryHealth');
  });

  it('should execute multiple AI modules', async () => {
    const result = await munshiJiService.processRequest(
      'সম্পূর্ণ বিশ্লেষণ দিন',
      [],
      testShopId
    );
    expect(result.toolsUsed.length).toBeGreaterThan(1);
  });
});
```

## Debugging

Enable debug logging:

```javascript
// In munshiJiService.js
const DEBUG = process.env.MUNSHIJI_DEBUG === 'true';

if (DEBUG) {
  console.log('Business Context:', businessContext);
  console.log('Action Plan:', actionPlan);
  console.log('Insights:', insights);
}
```

## Comparison: Old vs New

### Before (Direct AI Service)
```javascript
// User had to know which function to call
const insights = await aiService.generateBusinessInsights(stats);
```

### After (MunshiJi Service)
```javascript
// Service decides what to do
const result = await munshiJiService.processRequest(
  "ব্যবসার অবস্থা দেখান",
  [],
  shopId
);
// Automatically calls: business_insights + sales_trend + inventory_advice
```

## Key Benefits

1. ✅ **Intelligent Decision Making**: Automatically selects relevant AI modules
2. ✅ **Context-Aware**: Full business context available for better insights
3. ✅ **Multi-Tool Responses**: Combines multiple AI features in one answer
4. ✅ **Priority Detection**: Identifies urgent issues (stock, delivery)
5. ✅ **Unified Output**: Single coherent Bangla response
6. ✅ **Transparency**: Shows which tools were used and why
7. ✅ **No Breaking Changes**: Existing AI services remain intact

---

**MunshiJiService makes AI truly intelligent for Bangladeshi SME businesses!** 🚀
