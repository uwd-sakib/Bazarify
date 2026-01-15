# MunshiJi Service - Quick Reference

## 🎯 Purpose
Central AI brain that decides which AI features to use based on user queries and business context.

---

## 📁 File Location
```
backend/src/services/munshiJiService.js
```

---

## 🔧 Usage

```javascript
import { munshiJiService } from '../services/munshiJiService.js';

const result = await munshiJiService.processRequest(
  userMessage,      // "আমার ব্যবসার অবস্থা দেখান"
  conversationHistory,  // []
  shopId           // "shop123"
);

console.log(result.response);   // Bangla response
console.log(result.toolsUsed);  // ['business_insights', 'sales_trend']
console.log(result.reasoning);  // ['কারণ 1', 'কারণ 2']
console.log(result.context);    // { totalProducts: 45, ... }
```

---

## 🧠 Decision Keywords

| Intent | Keywords (Bangla/English) | Tools Used |
|--------|---------------------------|------------|
| **Product** | পণ্য, product, বর্ণনা, description | `product_description` |
| **Inventory** | স্টক, stock, ইনভেন্টরি, inventory, কম, low | `inventory_advice` |
| **Business** | বিক্রয়, sales, ব্যবসা, business, বিশ্লেষণ | `business_insights` + `sales_trend` |
| **Sales Trend** | ট্রেন্ড, trend, পূর্বাভাস, forecast, গত সপ্তাহ | `sales_trend` |
| **Customer** | গ্রাহক, customer, বার্তা, message, SMS | `customer_message` |
| **Report** | রিপোর্ট, report, অর্ডার, order | `order_report` |
| **Comprehensive** | সব, all, সম্পূর্ণ, complete, পরামর্শ | Multiple tools |

---

## 📊 Response Structure

```javascript
{
  response: String,        // Unified Bangla response
  insights: Object,        // Individual tool outputs
  toolsUsed: Array,       // ['tool1', 'tool2']
  reasoning: Array,       // ['reason1', 'reason2']
  context: {
    totalProducts: Number,
    totalOrders: Number,
    totalRevenue: Number,
    lowStockCount: Number
  }
}
```

---

## 🎨 Business Context

```javascript
{
  // Data
  products: Array,
  orders: Array,
  customers: Array,
  
  // Metrics
  totalProducts: Number,
  totalOrders: Number,
  totalRevenue: Number,
  averageOrderValue: Number,
  
  // Inventory
  lowStockProducts: Array,     // stock < 10
  outOfStockProducts: Array,   // stock = 0
  wellStockedProducts: Array,  // stock >= 10
  
  // Sales
  salesData: Array,            // Last 7 days
  weeklyRevenue: Number,
  
  // Flags
  hasLowStock: Boolean,
  hasOutOfStock: Boolean,
  hasSalesData: Boolean
}
```

---

## ⚡ Main Methods

### `processRequest()`
Main entry point - handles everything

### `fetchBusinessContext()`
Gets all business data and calculates metrics

### `analyzeIntentAndPlan()`
Decides which AI tools to use

### `executeAIModules()`
Calls selected AI tools in parallel

### `generateUnifiedResponse()`
Merges all insights into one Bangla response

### `getBusinessHealth()`
Calculates health score (0-100)

---

## 🔥 Quick Examples

### Example 1: Check Stock
```javascript
Input: "কোন পণ্যের স্টক কম?"
Tools: ['inventory_advice']
Priority: HIGH (if low stock exists)
```

### Example 2: Business Status
```javascript
Input: "ব্যবসা কেমন চলছে?"
Tools: ['business_insights', 'sales_trend']
Priority: MEDIUM
```

### Example 3: Full Analysis
```javascript
Input: "সব বিশ্লেষণ করুন"
Tools: ['business_insights', 'sales_trend', 'inventory_advice']
Priority: HIGH
```

---

## ✅ Integration Points

### Calls These Existing Services:
- `aiService.generateBusinessInsights()`
- `aiService.analyzeSalesTrend()`
- `aiService.generateInventoryAdvice()`
- `aiService.generateOrderReport()`
- `aiService.chatWithAI()`

### Called By:
- `controllers/aiController.js` → `munshiJi()` function

---

## 🎯 Key Features

✅ **Smart Decision Making** - Keyword-based intent detection  
✅ **Context Awareness** - Full business data available  
✅ **Multi-Tool Execution** - Calls multiple AI modules  
✅ **Unified Response** - One coherent Bangla answer  
✅ **Priority Detection** - Identifies urgent issues  
✅ **Health Scoring** - Business health (0-100)  
✅ **Error Handling** - Graceful degradation  
✅ **Transparency** - Shows which tools and why  

---

## 🚨 Important Notes

⚠️ **Does NOT replace** existing AI services  
⚠️ **Does orchestrate** existing AI services  
⚠️ **All responses** must be in Bangla  
⚠️ **Requires** OpenRouter API key  
⚠️ **Best with** GPT-4 models  

---

## 🐛 Common Issues

### Issue: No tools selected
**Cause:** Query doesn't match any keywords  
**Fix:** Add more keywords or use general business insights

### Issue: Slow response
**Cause:** Multiple AI modules executing  
**Fix:** Expected behavior (3-8s for comprehensive analysis)

### Issue: Missing data
**Cause:** No products/orders in database  
**Fix:** Service handles gracefully with fallback messages

---

## 📚 Documentation

- **Full Docs:** `MUNSHIJI_SERVICE_DOCS.md`
- **Summary:** `MUNSHIJI_SERVICE_SUMMARY.md`
- **User Guide:** `MUNSHIJI_USER_GUIDE_BANGLA.md`
- **Architecture:** `MUNSHIJI_ARCHITECTURE.md`

---

## 🔄 Workflow Diagram

```
User Query
    ↓
MunshiJiService.processRequest()
    ↓
fetchBusinessContext() → Get all data
    ↓
analyzeIntentAndPlan() → Decide tools
    ↓
executeAIModules() → Call AI services
    ↓
generateUnifiedResponse() → Merge insights
    ↓
Return: response + tools + reasoning
```

---

**MunshiJi Service makes AI intelligent! 🧠🚀**
