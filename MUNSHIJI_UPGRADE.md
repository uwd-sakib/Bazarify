# 🎯 মুন্সিজি - Unified AI Business Advisor

## ✨ What's New

**MunshiJi** (মুন্সিজি) is a unified AI Business Advisor that intelligently uses all existing AI features as tools. Instead of having separate AI functions, MunshiJi acts as a single intelligent agent that can:

- **Understand context** - Knows about your business, products, and customers
- **Use tools automatically** - Calls appropriate AI functions based on your request
- **Respond in Bangla** - All outputs are in Bengali language with experienced mentor tone
- **Maintain conversation** - Remembers previous messages in the chat
- **Structured responses** - Follows consistent 4-part format: Situation → Problem → Recommendation → Action Steps
- **Real numbers only** - References actual business data, no generic advice

---

## 🏗️ Architecture Overview

```
User Question → MunshiJiService → AI Tool Registry → AI Modules
                       ↓                   ↓
                Prompt Composer      Tool Selection
                       ↓                   ↓
                  Validation          Execution
                       ↓                   ↓
              Structured Response ← Combined Insights
```

**Key Components:**
1. **MunshiJiService** - Central orchestration brain
2. **AI Tool Registry** - Centralized tool management (eliminates duplication)
3. **Prompt Composer** - Ensures quality, structured responses
4. **AI Service** - Low-level AI function execution

---

## 🔧 Technical Implementation

### Backend Changes

#### 1. Prompt Composer (`promptComposer`)
**Location:** `backend/src/services/promptComposer.js`

**Purpose:** Structures all MunshiJi responses to ensure consistent quality.

**Key Features:**
- ✅ Generates system prompt defining MunshiJi's persona (30+ year business mentor)
- ✅ Builds context-rich user prompts with real business numbers
- ✅ Enforces 4-part response structure in Bangla
- ✅ Validates response quality (checks for real numbers, Bangla, specific advice)
- ✅ Formats business metrics and identifies problems automatically

**How it works:**
```javascript
// 1. Get system prompt (defines persona & structure)
const systemPrompt = promptComposer.composeSystemPrompt();

// 2. Build user prompt with context
const userPrompt = promptComposer.composeUserPrompt(
  userQuestion,      // "আমার স্টক দেখান"
  businessContext,   // { totalProducts: 45, lowStockProducts: [...] }
  toolInsights       // { inventory_advice: "...", sales_trend: "..." }
);

// 3. Get AI response
const response = await aiService.chatWithAI(userPrompt, [
  { role: 'system', content: systemPrompt },
  ...conversationHistory
]);

// 4. Validate quality
const validation = promptComposer.validateResponseStructure(response);
```

**Response Structure Enforced:**
```
১. পরিস্থিতি সংক্ষেপ (Situation Summary)
   → "আপনার ৪৫টি পণ্য আছে এবং গত সপ্তাহে ৳১২,০০০ বিক্রয়"
   
২. মূল সমস্যা (Key Problem)
   → "৫টি পণ্যের স্টক ১০-এর নিচে (Nike Shoes, T-Shirt...)"
   
৩. স্পষ্ট সুপারিশ (Clear Recommendation)
   → "অবিলম্বে স্টক পূরণ করুন। এই পণ্যগুলো থেকে ৩৫% আয়"
   
৪. কর্মপদক্ষেপ (Action Steps)
   → "১. সরবরাহকারীকে আজই অর্ডার দিন..."
```

**See:** [PROMPT_COMPOSER_DOCS.md](PROMPT_COMPOSER_DOCS.md), [PROMPT_COMPOSER_QUICK_REF.md](PROMPT_COMPOSER_QUICK_REF.md)

---

#### 2. AI Tool Registry (`aiToolRegistry`)
**Location:** `backend/src/services/aiToolRegistry.js`
**Location:** `backend/src/services/aiService.js`

**Key Features:**
- Uses OpenAI function calling (tools) to intelligently select which AI feature to use
- Automatically detects when to use:
  - Product description generation
  - Business insights analysis
  - Customer message creation
  - Sales trend analysis
  - Inventory management advice
  - Order report generation
- Returns both the response and which tools were used

**How it works:**
```javascript
const result = await aiService.munshiJi(
  userMessage,
  conversationHistory,
  availableTools
);

// Returns:
{
  response: "বাংলায় উত্তর...",
  toolsUsed: ['generate_product_description', 'get_business_insights']
}
```

#### 2. New Controller (`munshiJi`)
**Location:** `backend/src/controllers/aiController.js`

- Fetches business context (products, orders, stats)
- Passes context to MunshiJi service
- Returns unified response with tool usage information

#### 3. New API Route
**Location:** `backend/src/routes/aiRoutes.js`

```http
POST /api/ai/munshiji
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "আমার ব্যবসার বিশ্লেষণ দিন",
  "conversationHistory": [
    {"role": "user", "content": "..."},
    {"role": "assistant", "content": "..."}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "আপনার ব্যবসার বিশ্লেষণ...",
    "toolsUsed": ["get_business_insights", "analyze_sales_trend"]
  }
}
```

---

### Frontend Changes

#### 1. Updated API Service
**Location:** `frontend/src/services/index.js`

Added new `munshiJi` method:
```javascript
aiService.munshiJi(message, conversationHistory)
```

#### 2. MunshiJi Dashboard (NEW - Main Advisor View)
**Location:** `frontend/src/pages/MunshiJiDashboard.jsx`

**Purpose:** Main business advisor interface with daily insights and actionable recommendations.

**Features:**
- ✅ **Daily Business Advice** - Automatic advice on page load
- ✅ **AI Insight Card** - Structured advice in 4 sections (Situation, Problem, Recommendation, Actions)
- ✅ **Action Buttons** - UI-renderable action cards with:
  - Action type icons (📦 Stock, 💰 Price, 📣 Promote, etc.)
  - Priority badges (উচ্চ, মাঝারি, কম)
  - Urgency indicators (⚡ জরুরী, ⏰ শীঘ্রই, 📅 সাধারণ)
  - Target information (product names, current/suggested values)
  - Bangla reasons
  - One-click action buttons
- ✅ **Loading State** - Animated spinner with Bangla text "পরামর্শ প্রস্তুত করা হচ্ছে..."
- ✅ **Error State** - User-friendly error messages in Bangla with retry option
- ✅ **Refresh Option** - "নতুন পরামর্শ" button to get fresh advice
- ✅ **Last Updated** - Shows timestamp of last advice fetch
- ✅ **Responsive Grid** - 1-3 columns based on screen size

**Action Types Supported:**
1. 📦 **increase_stock** - Navigate to product page with stock suggestion
2. 💰 **adjust_price** - Navigate to product page with price suggestion
3. 📣 **promote_product** - Show campaign creator (placeholder)
4. 📢 **start_marketing** - Show marketing wizard (placeholder)
5. 👥 **engage_customers** - Navigate to customers page
6. 🚚 **improve_delivery** - Navigate to pending orders
7. ➕ **expand_inventory** - Navigate to products page

**UI Components:**
```jsx
// Main structure
<Layout>
  <Header with Refresh Button />
  <Loading State /> or <Error State /> or <Success State>
  
  // Success State includes:
  <AI Insight Card>
    <Situation Section />
    <Problem Section />
    <Recommendation Section />
    <Action Steps Section />
  </AI Insight Card>
  
  <Structured Actions Grid>
    {actions.map(action => (
      <Action Card with Priority, Urgency, Target Info, Button />
    ))}
  </Structured Actions Grid>
</Layout>
```

#### 3. Enhanced AI Assistant Page (Chat Interface)
**Location:** `frontend/src/pages/AIAssistant.jsx`

**Updates:**
- Changed chat to use `munshiJi` instead of basic `chat`
- Shows badges indicating which tools were used
- Updated branding to "মুন্সিজি - AI ব্যবসায়িক উপদেষ্টা"
- Improved suggestions to leverage tool capabilities
- Visual indicators for tool usage with Bangla labels:
  - 📝 পণ্য বর্ণনা (Product Description)
  - 📊 ব্যবসা বিশ্লেষণ (Business Insights)
  - 💬 গ্রাহক বার্তা (Customer Message)
  - 📈 বিক্রয় ট্রেন্ড (Sales Trend)
  - 📦 ইনভেন্টরি পরামর্শ (Inventory Advice)
  - 📋 অর্ডার রিপোর্ট (Order Report)

#### 4. Updated Navigation
**Location:** `frontend/src/App.jsx` and `frontend/src/components/Sidebar.jsx`

**New Route:**
```javascript
<Route path="/munshiji" element={<MunshiJiDashboard />} />
```

**Sidebar Updates:**
- Added "মুন্সিজি উপদেষ্টা" as highlighted menu item
- Purple theme for MunshiJi (stands out from other pages)
- "NEW" badge to draw attention
- Renamed existing AI Assistant to "AI চ্যাট"
- Both pages remain accessible (no breaking changes)

**Menu Structure:**
```
- ড্যাশবোর্ড (Dashboard)
- মুন্সিজি উপদেষ্টা (MunshiJi Dashboard) [NEW - Highlighted]
- পণ্য (Products)
- অর্ডার (Orders)
- গ্রাহক (Customers)
- রিপোর্ট (Reports)
- AI চ্যাট (AI Chat - existing AIAssistant page)
- সেটিংস (Settings)
```

---

## 🎨 User Experience

### Before (Multiple Separate AI Features)
Users had to:
1. Navigate to different sections
2. Fill out forms for each AI feature
3. Remember which feature does what

### After (Unified MunshiJi)
Users can now:
1. **Dashboard View:** See daily advice and actionable recommendations automatically
2. **One-Click Actions:** Click buttons to take immediate action on suggestions
3. **Chat Interface:** Ask questions naturally in Bangla - MunshiJi figures out which tools to use
4. **Comprehensive Answers:** Get responses that combine multiple AI features
4. See which tools were used (transparency)

### Example Conversations

**Example 1: Product Description**
```
User: "Samsung Galaxy A54 এর জন্য একটি বর্ণনা লিখুন"
MunshiJi: [Uses generate_product_description tool]
"স্যামসাং গ্যালাক্সি A54 একটি অত্যাধুনিক..."
[Shows badge: 📝 পণ্য বর্ণনা]
```

**Example 2: Business Analysis**
```
User: "আমার ব্যবসার অবস্থা কেমন?"
MunshiJi: [Uses get_business_insights and analyze_sales_trend]
"আপনার ব্যবসায়িক বিশ্লেষণ..."
[Shows badges: 📊 ব্যবসা বিশ্লেষণ, 📈 বিক্রয় ট্রেন্ড]
```

**Example 3: Inventory Check**
```
User: "কোন পণ্যের স্টক কম আছে?"
MunshiJi: [Uses get_inventory_advice tool]
"বর্তমানে নিম্নলিখিত পণ্যগুলির স্টক কম..."
[Shows badge: 📦 ইনভেন্টরি পরামর্শ]
```

---

## ✅ What Was Preserved

### Existing AI Features (NOT Deleted)
All existing AI endpoints remain functional:
- ✅ `/api/ai/generate-description` - Product descriptions
- ✅ `/api/ai/business-insights` - Business analysis
- ✅ `/api/ai/generate-message` - Customer messages
- ✅ `/api/ai/sales-analysis` - Sales trends
- ✅ `/api/ai/inventory-advice` - Inventory recommendations
- ✅ `/api/ai/chat` - Basic chat (legacy)
- ✅ `/api/ai/order-report` - Order reports

### Backward Compatibility
- Old AI service functions still work
- Existing frontend code using individual AI features will continue to work
- No breaking changes to existing APIs

---

## 🚀 Advantages of MunshiJi

### 1. **Intelligent Tool Selection**
MunshiJi automatically decides which AI features to use based on the user's natural language query. No need to navigate menus or forms.

### 2. **Multi-Tool Responses**
Can use multiple tools in a single response. For example:
- User asks: "আমার ব্যবসার সার্বিক অবস্থা দেখান"
- MunshiJi uses: Business Insights + Sales Trend + Inventory Advice
- Provides comprehensive answer combining all three

### 3. **Context-Aware**
Has access to:
- All products in the shop
- All orders and their status
- Business statistics
- Can make informed recommendations

### 4. **Bangla-First**
- All responses in Bengali
- Understands Bengali queries naturally
- Uses appropriate Bengali business terminology

### 5. **Transparency**
Shows which tools were used, helping users understand:
- What data was analyzed
- Which AI features contributed to the answer
- Builds trust through visibility

---

## 📊 Architecture Diagram

```
User Query (Bangla)
       ↓
  MunshiJi API
       ↓
  AI Service with Function Calling
       ↓
  ┌────────────────────────────────┐
  │  Available Tools (Existing AI) │
  ├────────────────────────────────┤
  │ • Product Description          │
  │ • Business Insights            │
  │ • Customer Messages            │
  │ • Sales Trend Analysis         │
  │ • Inventory Advice             │
  │ • Order Reports                │
  └────────────────────────────────┘
       ↓
  Unified Response (Bangla)
       ↓
  User sees answer + tools used
```

---

## 🔐 Configuration Required

### Environment Variables
No changes needed! MunshiJi uses the existing OpenRouter configuration:

```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxx
OPENROUTER_MODEL=openai/gpt-4-turbo
```

**Note:** Function calling works best with GPT-4 models. For best results:
- ✅ `openai/gpt-4-turbo` (Recommended)
- ✅ `openai/gpt-4`
- ⚠️ `openai/gpt-3.5-turbo` (May work but less reliable with tools)

---

## 🧪 Testing MunshiJi

### Test Queries

**1. Product Management**
```
"Samsung Galaxy phone এর জন্য একটি আকর্ষণীয় বর্ণনা লিখুন যার দাম ৪৫০০০ টাকা"
Expected: Uses generate_product_description
```

**2. Business Analysis**
```
"আমার ব্যবসার বর্তমান অবস্থা কেমন? পরামর্শ দিন"
Expected: Uses get_business_insights
```

**3. Inventory Management**
```
"কোন পণ্যগুলি শেষ হয়ে যাচ্ছে? কি করা উচিত?"
Expected: Uses get_inventory_advice
```

**4. Sales Analysis**
```
"গত সপ্তাহের বিক্রয় কেমন ছিল? ভবিষ্যত পূর্বাভাস দিন"
Expected: Uses analyze_sales_trend
```

**5. Customer Communication**
```
"রহিম সাহেবের জন্য একটি payment reminder SMS লিখুন, বকেয়া ৫০০০ টাকা"
Expected: Uses generate_customer_message
```

**6. Reports**
```
"গত মাসের অর্ডার রিপোর্ট তৈরি করুন"
Expected: Uses generate_order_report
```

**7. Combined Query**
```
"আমার সব ব্যবসায়িক তথ্য বিশ্লেষণ করে বলুন কি উন্নতি করা যায়"
Expected: Uses multiple tools (insights + sales + inventory)
```

---

## � System Components Summary

| Component | File | Purpose | Key Features |
|-----------|------|---------|--------------|
| **Prompt Composer** | `promptComposer.js` | Ensures quality responses | 4-part structure, validation, real numbers |
| **AI Tool Registry** | `aiToolRegistry.js` | Centralized tool management | Registration, selection, execution |
| **MunshiJi Service** | `munshiJiService.js` | Orchestration brain | Context fetching, planning, synthesis |
| **AI Service** | `aiService.js` | Low-level AI calls | OpenRouter integration, all AI modules |
| **AI Controller** | `aiController.js` | API endpoint handlers | Request validation, response formatting |
| **AI Routes** | `aiRoutes.js` | Route definitions | POST /api/ai/munshiji |

**Code Metrics:**
- Total lines: ~1,500
- Reduction from duplication: 87-94%
- Files created: 3 new services
- API endpoints: 1 new route
- Zero breaking changes

---

## 📈 Future Enhancements

### Potential Additions
1. **Memory System** - Remember user preferences across sessions
2. **Proactive Alerts** - MunshiJi suggests actions without being asked
3. **Multi-language** - Support English alongside Bangla
4. **Custom Tools** - Add shop-specific custom AI functions
5. **Voice Interface** - Bangla voice input/output
6. **Scheduled Reports** - Automatic daily/weekly AI reports
7. **A/B Testing** - Compare prompt structures for better responses
8. **Response Analytics** - Track which prompts generate best outcomes

---

## 🎓 For Developers

### Adding New Tools to MunshiJi

1. **Add the tool function to `aiService`:**
```javascript
myNewTool: async (params) => {
  // Implementation
  return result;
}
```

2. **Register the tool in `munshiJi` function:**
```javascript
{
  type: 'function',
  function: {
    name: 'my_new_tool',
    description: 'বাংলায় বর্ণনা',
    parameters: {
      type: 'object',
      properties: {
        param1: { type: 'string', description: 'বর্ণনা' }
      },
      required: ['param1']
    }
  }
}
```

3. **Add the case in the switch statement:**
```javascript
case 'my_new_tool':
  result = await aiService.myNewTool(functionArgs.param1);
  break;
```

4. **Add Bangla label in frontend:**
```javascript
const toolLabels = {
  'my_new_tool': '🔧 নতুন টুল',
  // ... other tools
};
```

---

## 📝 Summary

✅ **Created:** Unified MunshiJi AI advisor with intelligent tool calling  
✅ **Preserved:** All existing AI features and APIs  
✅ **Enhanced:** User experience with natural Bangla conversation  
✅ **Added:** Tool usage transparency with visual badges  
✅ **Maintained:** Backward compatibility  

**MunshiJi is now your single point of contact for all AI-powered business assistance in Bangla!**

---

## 🆘 Troubleshooting

### Issue: "মুন্সিজি বর্তমানে অনুপলব্ধ"
**Solution:** Check OpenRouter API key and model configuration

### Issue: Tools not being called
**Solution:** Ensure using GPT-4 model, GPT-3.5 may not reliably use function calling

### Issue: Response not in Bangla
**Solution:** Check system prompt in `aiService.munshiJi` - should specify Bangla responses

### Issue: Old chat still being used
**Solution:** Clear browser cache and refresh, ensure frontend is using `aiService.munshiJi`

---

**Made with ❤️ for Bangladeshi SME businesses**
