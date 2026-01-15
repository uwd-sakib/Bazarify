# AI Tool Registry - Quick Reference

## 📦 Import

```javascript
import { aiToolRegistry } from './aiToolRegistry.js';
```

---

## 🔧 Registered Tools

| ID | Name | Icon | Keywords (sample) |
|----|------|------|-------------------|
| `business_insights` | ব্যবসা বিশ্লেষণ | 📊 | বিক্রয়, sales, ব্যবসা |
| `sales_trend` | বিক্রয় ট্রেন্ড | 📈 | ট্রেন্ড, trend, পূর্বাভাস |
| `inventory_advice` | ইনভেন্টরি পরামর্শ | 📦 | স্টক, stock, ইনভেন্টরি |
| `order_report` | অর্ডার রিপোর্ট | 📋 | রিপোর্ট, report, অর্ডার |
| `product_description` | পণ্য বর্ণনা | 📝 | বর্ণনা, description |
| `customer_message` | গ্রাহক বার্তা | 💬 | বার্তা, message, SMS |
| `chat_assistant` | AI চ্যাট | 💭 | (fallback) |

---

## 🚀 Common Operations

### Find Relevant Tools
```javascript
const tools = aiToolRegistry.findRelevantTools(
  "আমার স্টক দেখান",
  businessContext
);

// Returns: [{ toolId, tool, priority, reason }]
```

### Execute Tools
```javascript
const results = await aiToolRegistry.executeTools(
  ['business_insights', 'sales_trend'],
  businessContext
);

// Returns: { business_insights: "...", sales_trend: "..." }
```

### Get Single Tool
```javascript
const tool = aiToolRegistry.getTool('inventory_advice');
console.log(tool.name); // 'ইনভেন্টরি পরামর্শ'
```

### Get All Tools
```javascript
const allTools = aiToolRegistry.getAllTools();
console.log(allTools.length); // 7
```

### Get Metadata (for Frontend)
```javascript
const metadata = aiToolRegistry.getToolMetadata();
// [{ id, name, icon, description }, ...]
```

---

## ➕ Add New Tool

```javascript
aiToolRegistry.registerTool({
  id: 'my_tool',              // Unique ID
  name: 'আমার টুল',           // Bangla name
  icon: '🔧',                 // Emoji
  description: 'বর্ণনা',      // What it does
  keywords: ['কীওয়ার্ড'],     // Trigger words
  
  shouldExecute: (context, query) => {
    return context.hasData;   // Condition
  },
  
  execute: async (context, params) => {
    // Your logic here
    return 'ফলাফল';
  },
  
  priority: 'medium',         // or 'high', 'low', or function
  requiresParams: false,      // true if needs params
  isFallback: false          // true if fallback tool
});
```

---

## 🎯 Tool Structure

```javascript
{
  id: String,                    // Required
  name: String,                  // Required
  icon: String,                  // Default: '🔧'
  description: String,           // Required
  keywords: Array<String>,       // Default: []
  shouldExecute: Function,       // Default: () => true
  execute: Function,             // Required (async)
  priority: String|Function,     // Default: 'medium'
  requiresParams: Boolean,       // Default: false
  isFallback: Boolean           // Default: false
}
```

---

## 📊 Priority Levels

- **high** - Urgent issues (stock problems, critical alerts)
- **medium** - Normal operations (analysis, insights)
- **low** - Optional features (reports, messages)

### Dynamic Priority
```javascript
priority: (context) => {
  return context.hasOutOfStock ? 'high' : 'medium';
}
```

---

## ✅ Validation

Required fields: `id`, `name`, `description`, `execute`

```javascript
// Will throw error if missing required fields
aiToolRegistry.registerTool({
  id: 'test',
  // Missing name, description, execute
  // → Error: "Missing fields: name, description, execute"
});
```

---

## 🔍 Tool Selection Logic

1. **Keyword Match** - Check if query contains tool keywords
2. **Condition Check** - Run `shouldExecute(context, query)`
3. **Priority Sort** - Order by priority (high → medium → low)
4. **Return Matches** - Return relevant tools with reasoning

---

## 🎨 Usage in MunshiJiService

### Find Tools
```javascript
const relevantTools = aiToolRegistry.findRelevantTools(
  userMessage,
  businessContext
);

const toolsToUse = relevantTools.map(rt => rt.toolId);
const reasoning = relevantTools.map(rt => rt.reason);
```

### Execute Tools
```javascript
const insights = await aiToolRegistry.executeTools(
  toolsToUse,
  businessContext
);
```

---

## 🛠️ Helper Methods

### Check if Tool Needs Params
```javascript
const needsParams = aiToolRegistry.toolRequiresParams('product_description');
// true
```

### Get Tool Metadata
```javascript
const metadata = aiToolRegistry.getToolMetadata();
// Use in API responses, frontend, etc.
```

---

## ⚠️ Error Handling

Tools handle errors gracefully:

```javascript
try {
  const result = await aiToolRegistry.executeTool('my_tool', context);
} catch (error) {
  // Error logged, returns Bangla error message
  // "my_tool এ সমস্যা হয়েছে।"
}
```

Multiple tools:
```javascript
const results = await aiToolRegistry.executeTools(toolIds, context);
// If one tool fails, others continue
// Failed tool returns error message in Bangla
```

---

## 📝 Example Queries → Tools

| User Query | Detected Tools |
|------------|----------------|
| "আমার স্টক দেখান" | `inventory_advice` |
| "ব্যবসা কেমন চলছে?" | `business_insights`, `sales_trend` |
| "গত সপ্তাহের বিক্রয়" | `sales_trend` |
| "রিপোর্ট তৈরি করুন" | `order_report` |
| "পণ্যের বর্ণনা লিখুন" | `product_description` |
| "সব বিশ্লেষণ করুন" | Multiple tools |

---

## 🎓 Best Practices

### ✅ Do
- Use descriptive tool IDs: `'sales_trend'`
- Include both Bangla and English keywords
- Check data availability in `shouldExecute`
- Return Bangla error messages
- Use dynamic priority when needed

### ❌ Don't
- Use generic IDs: `'tool1'`
- Forget to validate required params
- Assume data always exists
- Return English error messages
- Hardcode priorities if they should be dynamic

---

## 🔗 Related Files

- **Registry:** `backend/src/services/aiToolRegistry.js`
- **Service:** `backend/src/services/munshiJiService.js`
- **AI Services:** `backend/src/services/aiService.js`
- **Docs:** `AI_TOOL_REGISTRY_DOCS.md`

---

**Quick, clean, and maintainable AI tool management! 🚀**
