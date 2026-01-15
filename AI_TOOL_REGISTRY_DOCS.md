# AI Tool Registry - Documentation

## Overview

The AI Tool Registry is a centralized system for registering, discovering, and executing AI features in Bazarify. It eliminates duplicated logic and provides a clean, maintainable way to manage AI capabilities.

## Architecture

```
┌─────────────────────────────────────────┐
│         AI Tool Registry                │
│  Single Source of Truth for AI Tools   │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌─────────────┐  ┌─────────────┐
│  Register   │  │   Execute   │
│    Tools    │  │    Tools    │
└─────────────┘  └─────────────┘
       │                │
       └───────┬────────┘
               ▼
      MunshiJiService
```

## File Location

```
backend/src/services/aiToolRegistry.js
```

## Core Concepts

### Tool Definition

Each AI tool is registered with:
- **ID** - Unique identifier (e.g., `'business_insights'`)
- **Name** - Display name in Bangla (e.g., `'ব্যবসা বিশ্লেষণ'`)
- **Icon** - Emoji icon (e.g., `'📊'`)
- **Description** - What the tool does
- **Keywords** - Trigger words for detection
- **shouldExecute()** - Function to determine if tool should run
- **execute()** - Function that performs the actual work
- **Priority** - Execution priority (high/medium/low)

### Tool Structure

```javascript
{
  id: 'business_insights',
  name: 'ব্যবসা বিশ্লেষণ',
  icon: '📊',
  description: 'ব্যবসায়িক তথ্যের উপর ভিত্তি করে পরামর্শ প্রদান করে',
  keywords: ['বিক্রয়', 'sales', 'ব্যবসা', 'business'],
  shouldExecute: (context, query) => context.hasOrders,
  execute: async (context) => { /* ... */ },
  priority: 'medium'
}
```

## Registered Tools

### 1. Business Insights (`business_insights`)
- **Icon:** 📊
- **Purpose:** Analyzes business metrics and provides recommendations
- **Keywords:** বিক্রয়, sales, ব্যবসা, business, বিশ্লেষণ, analysis
- **Condition:** Executes if orders or products exist
- **Priority:** Medium

### 2. Sales Trend (`sales_trend`)
- **Icon:** 📈
- **Purpose:** Analyzes sales patterns and forecasts
- **Keywords:** ট্রেন্ড, trend, পূর্বাভাস, forecast, গত সপ্তাহ
- **Condition:** Executes only if sales data is available
- **Priority:** Medium

### 3. Inventory Advice (`inventory_advice`)
- **Icon:** 📦
- **Purpose:** Provides stock management recommendations
- **Keywords:** স্টক, stock, ইনভেন্টরি, inventory, কম, low
- **Condition:** Executes if products exist
- **Priority:** HIGH if stock issues, otherwise medium

### 4. Order Report (`order_report`)
- **Icon:** 📋
- **Purpose:** Generates detailed order reports
- **Keywords:** রিপোর্ট, report, অর্ডার, order, মাস, month
- **Condition:** Executes if orders exist
- **Priority:** Low

### 5. Product Description (`product_description`)
- **Icon:** 📝
- **Purpose:** Creates product descriptions
- **Keywords:** পণ্য, product, বর্ণনা, description, লিখ, write
- **Condition:** Executes only if query asks for description
- **Priority:** Medium
- **Requires Params:** Yes (productName, category, price)

### 6. Customer Message (`customer_message`)
- **Icon:** 💬
- **Purpose:** Generates customer SMS/messages
- **Keywords:** গ্রাহক, customer, বার্তা, message, SMS
- **Condition:** Executes only if query asks for message
- **Priority:** Low
- **Requires Params:** Yes (customerName, messageType)

### 7. Chat Assistant (`chat_assistant`)
- **Icon:** 💭
- **Purpose:** General business advice (fallback)
- **Keywords:** None (always available)
- **Condition:** Always available
- **Priority:** Low
- **Is Fallback:** Yes

## API Reference

### AIToolRegistry Class

#### Methods

##### `registerTool(toolConfig)`
Register a new AI tool.

```javascript
aiToolRegistry.registerTool({
  id: 'my_tool',
  name: 'আমার টুল',
  icon: '🔧',
  description: 'টুলের বর্ণনা',
  keywords: ['keyword1', 'keyword2'],
  shouldExecute: (context, query) => true,
  execute: async (context) => { /* ... */ },
  priority: 'medium'
});
```

##### `getTool(toolId)`
Get a tool by its ID.

```javascript
const tool = aiToolRegistry.getTool('business_insights');
console.log(tool.name); // 'ব্যবসা বিশ্লেষণ'
```

##### `getAllTools()`
Get array of all registered tools.

```javascript
const allTools = aiToolRegistry.getAllTools();
console.log(allTools.length); // 7
```

##### `findRelevantTools(query, context)`
Find tools relevant to a query and context.

```javascript
const relevantTools = aiToolRegistry.findRelevantTools(
  "আমার ব্যবসার অবস্থা দেখান",
  businessContext
);

// Returns:
[
  {
    toolId: 'business_insights',
    tool: { /* tool config */ },
    priority: 'medium',
    reason: 'ব্যবসায়িক বিশ্লেষণ প্রয়োজন'
  },
  // ... more tools
]
```

##### `executeTool(toolId, context, params)`
Execute a single tool.

```javascript
const result = await aiToolRegistry.executeTool(
  'business_insights',
  businessContext
);
```

##### `executeTools(toolIds, context, params)`
Execute multiple tools in parallel.

```javascript
const results = await aiToolRegistry.executeTools(
  ['business_insights', 'sales_trend'],
  businessContext
);

// Returns:
{
  business_insights: "...",
  sales_trend: "..."
}
```

##### `getToolMetadata()`
Get metadata for all tools (for frontend).

```javascript
const metadata = aiToolRegistry.getToolMetadata();
// Returns: [{ id, name, icon, description }, ...]
```

##### `toolRequiresParams(toolId)`
Check if a tool requires additional parameters.

```javascript
const needsParams = aiToolRegistry.toolRequiresParams('product_description');
// Returns: true
```

## Usage Examples

### Example 1: Find and Execute Relevant Tools

```javascript
import { aiToolRegistry } from './aiToolRegistry.js';

// User asks about business status
const query = "আমার ব্যবসার অবস্থা কেমন?";
const context = { /* business context */ };

// Find relevant tools
const relevantTools = aiToolRegistry.findRelevantTools(query, context);

// Extract tool IDs
const toolIds = relevantTools.map(rt => rt.toolId);
// ['business_insights', 'sales_trend']

// Execute all tools
const results = await aiToolRegistry.executeTools(toolIds, context);
```

### Example 2: Add a New Tool

```javascript
aiToolRegistry.registerTool({
  id: 'profit_analysis',
  name: 'লাভ বিশ্লেষণ',
  icon: '💰',
  description: 'লাভ-ক্ষতি বিশ্লেষণ করে',
  keywords: ['লাভ', 'profit', 'মুনাফা', 'margin'],
  shouldExecute: (context, query) => {
    return context.hasOrders && context.totalRevenue > 0;
  },
  execute: async (context) => {
    const revenue = context.confirmedRevenue;
    const cost = context.totalCost || (revenue * 0.7); // Estimate
    const profit = revenue - cost;
    return `আপনার আনুমানিক লাভ: ৳${profit.toFixed(2)}`;
  },
  priority: 'medium'
});
```

### Example 3: Conditional Execution

```javascript
// Tool with dynamic priority based on context
aiToolRegistry.registerTool({
  id: 'urgent_alerts',
  name: 'জরুরি সতর্কতা',
  icon: '🚨',
  description: 'জরুরি সমস্যা সনাক্ত করে',
  keywords: ['সমস্যা', 'problem', 'issue'],
  shouldExecute: (context, query) => {
    // Only execute if there are actual issues
    return context.hasOutOfStock || context.hasLowStock;
  },
  execute: async (context) => {
    const alerts = [];
    if (context.hasOutOfStock) {
      alerts.push(`${context.outOfStockProducts.length}টি পণ্য স্টক শেষ!`);
    }
    if (context.hasLowStock) {
      alerts.push(`${context.lowStockProducts.length}টি পণ্যের স্টক কম!`);
    }
    return alerts.join('\n');
  },
  priority: (context) => {
    // Dynamic priority based on severity
    return context.hasOutOfStock ? 'high' : 'medium';
  }
});
```

## Integration with MunshiJiService

MunshiJiService uses the registry for intelligent tool selection:

```javascript
// OLD WAY (Duplicated Logic)
if (message.includes('স্টক') || message.includes('stock')) {
  insights.inventory = await aiService.generateInventoryAdvice(products);
}
if (message.includes('বিক্রয়') || message.includes('sales')) {
  insights.sales = await aiService.generateBusinessInsights(stats);
}
// ... more duplicated if/else statements

// NEW WAY (Registry-Based)
const relevantTools = aiToolRegistry.findRelevantTools(message, context);
const insights = await aiToolRegistry.executeTools(
  relevantTools.map(rt => rt.toolId),
  context
);
```

## Benefits

### 1. No Duplicated Logic
- Keywords defined once per tool
- Execution logic in one place
- Easy to maintain and update

### 2. Easy to Extend
Adding a new tool is simple:
```javascript
aiToolRegistry.registerTool({ /* config */ });
```

### 3. Conditional Execution
Tools decide if they should run based on context:
```javascript
shouldExecute: (context, query) => context.hasOrders
```

### 4. Dynamic Priority
Priority can change based on context:
```javascript
priority: (context) => context.hasOutOfStock ? 'high' : 'medium'
```

### 5. Centralized Metadata
Frontend can fetch tool info without hardcoding:
```javascript
const tools = aiToolRegistry.getToolMetadata();
// Use in UI to show available features
```

## Tool Selection Flow

```
User Query: "আমার স্টক দেখান"
       ↓
aiToolRegistry.findRelevantTools()
       ↓
1. Check each tool's keywords
   - inventory_advice: ✓ matches 'স্টক'
   - business_insights: ✗ no match
   - sales_trend: ✗ no match
       ↓
2. Check shouldExecute()
   - inventory_advice: ✓ context.hasProducts = true
       ↓
3. Determine priority
   - inventory_advice: HIGH (stock issues exist)
       ↓
4. Return relevant tools
   - [{toolId: 'inventory_advice', priority: 'high', reason: '...'}]
```

## Error Handling

Tools handle errors gracefully:

```javascript
async executeTools(toolIds, context, params = {}) {
  const results = {};
  
  for (const toolId of toolIds) {
    try {
      results[toolId] = await this.executeTool(toolId, context, params);
    } catch (error) {
      console.error(`Failed to execute ${toolId}:`, error);
      results[toolId] = `${toolId} এ সমস্যা হয়েছে।`;
      // Continues with other tools
    }
  }
  
  return results;
}
```

## Tool Registration Validation

```javascript
registerTool(toolConfig) {
  const requiredFields = ['id', 'name', 'description', 'execute'];
  const missingFields = requiredFields.filter(field => !toolConfig[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing fields: ${missingFields.join(', ')}`);
  }
  
  // Register with defaults
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
```

## Best Practices

### 1. Clear Tool IDs
Use descriptive, snake_case IDs:
```javascript
✅ 'business_insights'
✅ 'sales_trend_analysis'
❌ 'bi'
❌ 'tool1'
```

### 2. Comprehensive Keywords
Include both Bangla and English:
```javascript
keywords: ['বিক্রয়', 'sales', 'বিক্রি', 'sell']
```

### 3. Context-Aware Execution
Check data availability:
```javascript
shouldExecute: (context, query) => {
  return context.hasSalesData && context.salesData.length > 0;
}
```

### 4. Meaningful Priorities
Use dynamic priorities when needed:
```javascript
priority: (context) => {
  return context.hasOutOfStock ? 'high' : 'medium';
}
```

### 5. Error Messages in Bangla
Return user-friendly messages:
```javascript
execute: async (context) => {
  if (!context.hasProducts) {
    return 'পণ্য যোগ করুন।';
  }
  // ...
}
```

## Testing

### Unit Tests

```javascript
describe('AIToolRegistry', () => {
  it('should register a tool', () => {
    aiToolRegistry.registerTool({
      id: 'test_tool',
      name: 'Test',
      description: 'Test tool',
      execute: async () => 'result'
    });
    
    const tool = aiToolRegistry.getTool('test_tool');
    expect(tool).toBeDefined();
  });

  it('should find relevant tools', () => {
    const tools = aiToolRegistry.findRelevantTools(
      'স্টক দেখান',
      { hasProducts: true, hasLowStock: true }
    );
    
    expect(tools.length).toBeGreaterThan(0);
    expect(tools[0].toolId).toBe('inventory_advice');
  });

  it('should execute tools in parallel', async () => {
    const results = await aiToolRegistry.executeTools(
      ['business_insights', 'sales_trend'],
      mockContext
    );
    
    expect(results.business_insights).toBeDefined();
    expect(results.sales_trend).toBeDefined();
  });
});
```

## Future Enhancements

### 1. Tool Dependencies
```javascript
dependencies: ['business_insights'], // Run after these tools
```

### 2. Tool Caching
```javascript
cacheDuration: 300, // Cache for 5 minutes
```

### 3. Tool Metrics
```javascript
metrics: {
  executionCount: 0,
  averageTime: 0,
  successRate: 100
}
```

### 4. Tool Versioning
```javascript
version: '2.0',
deprecated: false
```

## Summary

✅ **Centralized** - All tools in one registry  
✅ **No Duplication** - Single source of truth  
✅ **Extensible** - Easy to add new tools  
✅ **Conditional** - Smart execution based on context  
✅ **Maintainable** - Clean, organized code  
✅ **Type-Safe** - Clear structure and validation  

**The AI Tool Registry makes MunshiJi truly intelligent and maintainable!** 🚀
