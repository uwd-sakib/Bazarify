# MunshiJi Prompt Composer Documentation

## Overview

The Prompt Composer is a specialized service that ensures MunshiJi delivers high-quality, contextual business advice in Bangla. It enforces a consistent response structure and tone while utilizing real business data.

## Purpose

**Problem:** Generic AI responses often lack specificity and fail to reference actual business numbers, making advice less actionable.

**Solution:** A prompt composer that:
- ✅ Structures all responses in a consistent format
- ✅ Injects real business numbers into prompts
- ✅ Maintains an experienced mentor tone
- ✅ Eliminates generic advice
- ✅ Validates response quality

---

## Core Features

### 1. **System Prompt Generation**
Creates a comprehensive system prompt that defines MunshiJi's persona and behavior.

```javascript
const systemPrompt = promptComposer.composeSystemPrompt();
```

**Key Elements:**
- **Role:** Experienced Bangladeshi business mentor (30+ years experience)
- **Language:** Always Bangla
- **Tone:** Friendly but professional, encouraging
- **Structure:** Enforces 4-part response format

**4-Part Response Structure:**
1. **পরিস্থিতি সংক্ষেপ (Situation Summary)** - Current business state with real numbers
2. **মূল সমস্যা (Key Problem)** - Specific issues identified with data
3. **স্পষ্ট সুপারিশ (Clear Recommendation)** - Actionable advice tied to numbers
4. **কর্মপদক্ষেপ (Action Steps)** - Step-by-step implementation plan

### 2. **User Prompt Composition**
Builds context-rich prompts using real business data.

```javascript
const userPrompt = promptComposer.composeUserPrompt(
  userQuestion,      // "আমার স্টক দেখান"
  businessContext,   // { totalProducts: 45, lowStockProducts: [...] }
  toolInsights       // { inventory_advice: "...", business_insights: "..." }
);
```

**Includes:**
- User's original question in Bangla
- Real business metrics (products, orders, revenue, customers)
- Problems detected (out of stock, low stock, no sales)
- Insights from AI tools that were executed
- Strict instructions to reference actual numbers

### 3. **Situation Summary Builder**
Automatically formats business context with real numbers.

```javascript
buildSituationSummary(context)
```

**Output Example:**
```
• মোট পণ্য: 45টি
• ক্যাটাগরি: 5টি (Electronics, Clothing, Food ইত্যাদি)
• মোট বিক্রয়: ৳82,350.00
• মোট অর্ডার: 123টি
• গড় অর্ডার মূল্য: ৳669.51
• মোট গ্রাহক: 87 জন
• গত ৭ দিনের বিক্রয়: ৳12,450.00
• সফল ডেলিভারি: 98টি
• অপেক্ষমাণ: 15টি
```

### 4. **Problem Identification**
Detects and prioritizes business issues automatically.

```javascript
identifyKeyProblems(context)
```

**Detected Issues:**
- 🚨 **জরুরী:** Out of stock products (lists product names)
- ⚠️ **সতর্কতা:** Low stock products (< 10 units)
- 📊 **No sales** in last 7 days
- 📉 **Low order count** (< 10 orders)
- 🛍️ **No products** added yet
- 📦 **Poor delivery rate** (< 70%)

### 5. **Tool Insights Compilation**
Formats insights from executed AI tools.

```javascript
compileToolInsights(toolInsights)
```

**Maps Tool IDs to Bangla Names:**
- `business_insights` → 📊 ব্যবসায়িক বিশ্লেষণ
- `sales_trend` → 📈 বিক্রয় প্রবণতা
- `inventory_advice` → 📦 ইনভেন্টরি পরামর্শ
- `order_report` → 📋 অর্ডার রিপোর্ট
- `product_description` → 📝 পণ্য বর্ণনা
- `customer_message` → 💬 গ্রাহক বার্তা
- `chat_assistant` → 💭 সাধারণ পরামর্শ

### 6. **Response Validation**
Checks if AI responses meet quality standards.

```javascript
const validation = promptComposer.validateResponseStructure(response);
// { valid: true, hasRealNumbers: true, hasBangla: true, isNotGeneric: true }
```

**Validation Criteria:**
- ✅ Contains real numbers (`\d+`)
- ✅ Written in Bangla (Unicode range `\u0980-\u09FF`)
- ✅ Not generic (avoids words like "সাধারণভাবে", "সাধারণত")

### 7. **Helper Messages**
Pre-built message templates for common scenarios.

**Clarification:**
```javascript
composeClairificationPrompt(question, missingInfo)
```

**Success:**
```javascript
composeSuccessMessage(actionTaken, result)
```

**Error:**
```javascript
composeErrorMessage('no_data', 'প্রথমে পণ্য যোগ করুন')
```

---

## Integration with MunshiJiService

### Before (Manual Prompt Building)
```javascript
async generateUnifiedResponse(userMessage, context, insights) {
  const prompt = `
ব্যবসায়িক সংক্ষিপ্ত তথ্য:
- মোট পণ্য: ${context.totalProducts}টি
- মোট অর্ডার: ${context.totalOrders}টি
...
  `;
  
  return await aiService.chatWithAI(prompt, []);
}
```

### After (Prompt Composer)
```javascript
async generateUnifiedResponse(userMessage, context, insights) {
  const systemPrompt = promptComposer.composeSystemPrompt();
  const userPrompt = promptComposer.composeUserPrompt(userMessage, context, insights);
  
  const response = await aiService.chatWithAI(userPrompt, [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-4)
  ]);
  
  // Validate response quality
  const validation = promptComposer.validateResponseStructure(response);
  if (!validation.valid) {
    console.warn('⚠️ Response quality issue:', validation.feedback);
  }
  
  return response;
}
```

**Benefits:**
- ✅ Centralized prompt logic (easier to update)
- ✅ Consistent response quality
- ✅ Automatic validation
- ✅ Reduced code duplication (25+ lines → 7 lines)

---

## Example Scenarios

### Scenario 1: Stock Inquiry

**User Question:** "আমার স্টক দেখান"

**Generated Prompt:**
```
**ব্যবহারকারীর প্রশ্ন:** "আমার স্টক দেখান"

**ব্যবসার বর্তমান পরিস্থিতি:**
• মোট পণ্য: 45টি
• মোট অর্ডার: 123টি
• গত ৭ দিনের বিক্রয়: ৳12,450.00

**চিহ্নিত সমস্যা/সতর্কতা:**
🚨 জরুরী: 2টি পণ্য সম্পূর্ণ শেষ (Nike Shoes, Samsung Phone)
⚠️ সতর্কতা: 5টি পণ্যের স্টক কম (১০-এর নিচে) - T-Shirt, Laptop, Headphones সহ আরো

**AI টুল থেকে প্রাপ্ত বিশ্লেষণ:**

**📦 ইনভেন্টরি পরামর্শ:**
[Tool insight here...]

**নির্দেশনা:**
উপরের প্রকৃত তথ্য ও সংখ্যা ব্যবহার করে ব্যবহারকারীর প্রশ্নের উত্তর দিন।
নির্ধারিত গঠন অনুসরণ করুন: পরিস্থিতি → সমস্যা → সুপারিশ → পদক্ষেপ।
```

**Expected Response Structure:**
```
**পরিস্থিতি:** আপনার ব্যবসায়ে ৪৫টি পণ্য আছে এবং গত সপ্তাহে ৳১২,৪৫০ বিক্রয় হয়েছে। মোট ১২৩টি অর্ডার এসেছে।

**মূল সমস্যা:** ২টি জনপ্রিয় পণ্য (Nike Shoes, Samsung Phone) সম্পূর্ণ শেষ এবং ৫টি পণ্যের স্টক ১০-এর নিচে। এর ফলে নতুন অর্ডার হারাচ্ছেন।

**সুপারিশ:** অবিলম্বে এই ৭টি পণ্যের স্টক পুনরায় পূরণ করুন। গত মাসে এই পণ্যগুলো থেকে ৩৫% আয় এসেছে।

**পদক্ষেপ:**
১. আজই সরবরাহকারীকে অর্ডার দিন
২. প্রতি পণ্যের জন্য ন্যূনতম ২০টি স্টক রাখুন
৩. সপ্তাহে একবার স্টক পরীক্ষা করুন
```

### Scenario 2: Business Performance

**User Question:** "ব্যবসা কেমন চলছে?"

**Generated Prompt:**
```
**ব্যবহারকারীর প্রশ্ন:** "ব্যবসা কেমন চলছে?"

**ব্যবসার বর্তমান পরিস্থিতি:**
• মোট পণ্য: 45টি
• মোট বিক্রয়: ৳82,350.00
• মোট অর্ডার: 123টি
• গড় অর্ডার মূল্য: ৳669.51
• মোট গ্রাহক: 87 জন
• সফল ডেলিভারি: 98টি

**AI টুল থেকে প্রাপ্ত বিশ্লেষণ:**

**📊 ব্যবসায়িক বিশ্লেষণ:**
[Tool insight here...]

**📈 বিক্রয় প্রবণতা:**
[Tool insight here...]
```

**Expected Response:**
```
**পরিস্থিতি:** আপনার ব্যবসা ভালো চলছে! মোট ৮২,৩৫০ টাকা বিক্রয় হয়েছে ১২৩টি অর্ডারে। গড় অর্ডার মূল্য ৬৬৯ টাকা এবং ৮০% অর্ডার সফলভাবে ডেলিভার হয়েছে।

**মূল শক্তি:** ডেলিভারি হার ভালো (৮০%) এবং গ্রাহক সংখ্যা বাড়ছে (৮৭ জন)।

**সুপারিশ:** বিক্রয় আরো বাড়াতে মার্কেটিং বাড়ান এবং নতুন পণ্য যোগ করুন।

**পদক্ষেপ:**
১. সোশ্যাল মিডিয়ায় প্রচার শুরু করুন
২. বিদ্যমান গ্রাহকদের অফার দিন
৩. সবচেয়ে বিক্রিত পণ্যগুলো আরো স্টক করুন
```

---

## Technical Specifications

### File Location
```
backend/src/services/promptComposer.js
```

### Export
```javascript
export const promptComposer = new PromptComposer();
```
Singleton instance - import and use directly.

### Dependencies
- None (standalone service)

### Used By
- `backend/src/services/munshiJiService.js` - Main integration point

### Methods

| Method | Parameters | Returns | Purpose |
|--------|-----------|---------|---------|
| `composeSystemPrompt()` | None | `String` | Generate system prompt defining MunshiJi's persona |
| `composeUserPrompt()` | `userQuestion`, `businessContext`, `toolInsights` | `String` | Build context-rich user prompt |
| `buildSituationSummary()` | `context` | `String` | Format business metrics in Bangla |
| `identifyKeyProblems()` | `context` | `String` | Detect and list business issues |
| `compileToolInsights()` | `toolInsights` | `String` | Format AI tool results |
| `formatNumber()` | `num` | `String` | Format numbers with commas |
| `composeClairificationPrompt()` | `question`, `missingInfo` | `String` | Ask for missing information |
| `composeSuccessMessage()` | `action`, `result` | `String` | Generate success message |
| `composeErrorMessage()` | `errorType`, `context` | `String` | Generate error message |
| `validateResponseStructure()` | `response` | `Object` | Check response quality |

---

## Quality Assurance

### What Makes a Good Response?

**✅ Good Response:**
```
**পরিস্থিতি:** আপনার ৪৫টি পণ্য আছে এবং গত সপ্তাহে ৳১২,০০০ বিক্রয় হয়েছে।

**সমস্যা:** ৫টি পণ্যের স্টক ১০-এর নিচে (Nike Shoes, T-Shirt, Laptop, Headphones, Phone)।

**সুপারিশ:** অবিলম্বে স্টক পূরণ করুন। এই পণ্যগুলো থেকে ৩৫% আয় আসে।

**পদক্ষেপ:**
১. সরবরাহকারীকে আজই অর্ডার দিন
২. ন্যূনতম ২০টি স্টক রাখুন
৩. সপ্তাহে একবার চেক করুন
```

**❌ Bad Response:**
```
আপনার ব্যবসা ভালো চলছে। সাধারণত স্টক ভালো রাখা উচিত। 
মার্কেটিং করুন এবং গ্রাহক সেবা উন্নত করুন।
```

**Why Bad?**
- ❌ No real numbers
- ❌ Generic advice ("সাধারণত", "ভালো রাখা উচিত")
- ❌ No structure
- ❌ No specific action steps

### Validation Checks

The validator checks for:

1. **Real Numbers:** Must contain digits referencing actual data
2. **Bangla Language:** Must use Bengali script (not English)
3. **Specific Advice:** Must avoid generic phrases
4. **Structure:** Should follow 4-part format

---

## Best Practices

### 1. Always Pass Complete Context
```javascript
// ✅ Good
const context = {
  totalProducts: 45,
  totalOrders: 123,
  totalRevenue: 82350,
  lowStockProducts: [...],
  outOfStockProducts: [...]
};

const prompt = promptComposer.composeUserPrompt(question, context, insights);
```

```javascript
// ❌ Bad - Missing data
const context = {
  totalProducts: 45
  // Missing other fields
};

const prompt = promptComposer.composeUserPrompt(question, context, insights);
```

### 2. Validate Responses
```javascript
const response = await aiService.chatWithAI(prompt, history);

// Check quality
const validation = promptComposer.validateResponseStructure(response);
if (!validation.valid) {
  console.warn('Quality issue:', validation.feedback);
  // Consider retrying or logging for improvement
}
```

### 3. Use Tool Insights Properly
```javascript
// ✅ Good - Pass actual insights
const toolInsights = {
  inventory_advice: "স্টক পুনরায় পূরণ করুন...",
  business_insights: "বিক্রয় বাড়ছে..."
};

// ❌ Bad - Empty or missing
const toolInsights = {};
```

### 4. Keep Conversation History
```javascript
const response = await aiService.chatWithAI(userPrompt, [
  { role: 'system', content: systemPrompt },
  ...conversationHistory.slice(-4) // Last 4 messages
]);
```

---

## Customization

### Adding New Error Types
```javascript
// In composeErrorMessage() method
const errorMessages = {
  no_data: '...',
  api_error: '...',
  invalid_input: '...',
  custom_error: 'আপনার কাস্টম ত্রুটি বার্তা'  // Add here
};
```

### Modifying Response Structure
Edit the system prompt in `composeSystemPrompt()`:

```javascript
composeSystemPrompt() {
  return `আপনি "মুন্সিজি"...

**উত্তরের গঠন:**
১. পরিস্থিতি সংক্ষেপ
২. মূল সমস্যা
৩. স্পষ্ট সুপারিশ
৪. কর্মপদক্ষেপ
৫. আপনার নতুন অংশ  // Add new section
...`;
}
```

### Adding More Problem Detection
```javascript
identifyKeyProblems(context) {
  const problems = [];
  
  // Existing checks...
  
  // New check
  if (context.customerRetentionRate < 50) {
    problems.push(`📉 গ্রাহক ধরে রাখার হার কম (${context.customerRetentionRate}%)`);
  }
  
  return problems.join('\n');
}
```

---

## Performance Considerations

### Memory Efficiency
- Singleton instance (only one object created)
- No caching needed (stateless operations)
- Lightweight string operations

### Execution Speed
- All methods are synchronous (except when calling AI)
- No database queries
- No external API calls (except AI service)

### Scalability
- Can handle any business context size
- Gracefully handles missing data
- No bottlenecks

---

## Future Enhancements

### Planned Features
1. **Multi-language Support** - Add English, Hindi prompts
2. **Response Templates** - Pre-built templates for common queries
3. **A/B Testing** - Compare different prompt structures
4. **Prompt Analytics** - Track which prompts generate best responses
5. **Dynamic Tone Adjustment** - Formal vs casual based on context
6. **Industry-specific Prompts** - Retail, services, manufacturing variations

### Improvement Ideas
- **Auto-correction:** Fix common AI response issues automatically
- **Response Scoring:** Rate responses on quality metrics
- **Learning Loop:** Improve prompts based on user feedback
- **Localization:** Regional variations of Bangla (Dhaka, Chittagong, Sylhet)

---

## Troubleshooting

### Issue: Response Not in Bangla
**Cause:** System prompt not properly sent to AI  
**Solution:** Verify prompt is in message history:
```javascript
await aiService.chatWithAI(userPrompt, [
  { role: 'system', content: systemPrompt },  // Must include this
  ...conversationHistory
]);
```

### Issue: Generic Responses
**Cause:** Missing business context or tool insights  
**Solution:** Pass complete context object:
```javascript
const context = await munshiJiService.fetchBusinessContext(shopId);
const insights = await aiToolRegistry.executeTools(tools, context, query);
const prompt = promptComposer.composeUserPrompt(query, context, insights);
```

### Issue: Validation Fails
**Cause:** AI not following structure  
**Solution:** 
1. Check system prompt is being used
2. Review AI model (GPT-4 recommended)
3. Add more examples in system prompt
4. Increase temperature for creativity (but not > 0.8)

### Issue: Numbers Not Showing
**Cause:** Context data missing or incorrect  
**Solution:** Verify context has all required fields:
```javascript
console.log('Context:', JSON.stringify(context, null, 2));
```

---

## Testing

### Unit Tests (Recommended)
```javascript
import { promptComposer } from './promptComposer.js';

describe('PromptComposer', () => {
  test('should generate system prompt', () => {
    const prompt = promptComposer.composeSystemPrompt();
    expect(prompt).toContain('মুন্সিজি');
    expect(prompt).toContain('পরিস্থিতি সংক্ষেপ');
  });
  
  test('should build situation summary', () => {
    const context = {
      totalProducts: 45,
      totalOrders: 123,
      totalRevenue: 82350
    };
    
    const summary = promptComposer.buildSituationSummary(context);
    expect(summary).toContain('45টি');
    expect(summary).toContain('123টি');
  });
  
  test('should validate good response', () => {
    const response = '**পরিস্থিতি:** ৪৫টি পণ্য আছে এবং ৳১২,০০০ বিক্রয়।';
    const validation = promptComposer.validateResponseStructure(response);
    expect(validation.valid).toBe(true);
  });
});
```

### Manual Testing
1. **Test with various questions:**
   - "আমার স্টক দেখান"
   - "ব্যবসা কেমন চলছে?"
   - "সম্পূর্ণ বিশ্লেষণ দিন"

2. **Test with edge cases:**
   - No products
   - No orders
   - Missing context data

3. **Verify response quality:**
   - Check for real numbers
   - Check for Bangla language
   - Check for specific advice
   - Check for action steps

---

## Summary

The Prompt Composer ensures MunshiJi consistently delivers:
- ✅ **Structured responses** following 4-part format
- ✅ **Real business numbers** in every answer
- ✅ **Experienced mentor tone** in Bangla
- ✅ **Specific actionable advice** (no generic tips)
- ✅ **Quality validation** with automatic checks

**Result:** Better user experience, more actionable insights, and consistent quality across all AI interactions.
