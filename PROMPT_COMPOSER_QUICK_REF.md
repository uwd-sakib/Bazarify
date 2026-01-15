# MunshiJi Prompt Composer - Quick Reference

## 📋 What It Does
Structures all MunshiJi responses to ensure:
- ✅ Bangla language only
- ✅ Experienced mentor tone
- ✅ Real numbers from business data
- ✅ No generic advice
- ✅ Consistent 4-part structure

---

## 🎯 4-Part Response Structure

Every MunshiJi response follows this format:

```
১. পরিস্থিতি সংক্ষেপ (Situation Summary)
   → Current state with real numbers
   → Example: "আপনার ৪৫টি পণ্য আছে এবং গত সপ্তাহে ৳১২,০০০ বিক্রয়"

২. মূল সমস্যা (Key Problem)
   → Specific issues identified
   → Example: "৫টি পণ্যের স্টক ১০-এর নিচে (Nike Shoes, T-Shirt...)"

৩. স্পষ্ট সুপারিশ (Clear Recommendation)
   → Actionable advice with reasoning
   → Example: "অবিলম্বে স্টক পূরণ করুন। এই পণ্যগুলো থেকে ৩৫% আয়"

৪. কর্মপদক্ষেপ (Action Steps)
   → Step-by-step what to do
   → Example: "১. সরবরাহকারীকে আজই অর্ডার দিন..."
```

---

## 🚀 Quick Usage

### Import
```javascript
import { promptComposer } from './services/promptComposer.js';
```

### Basic Flow
```javascript
// 1. Get system prompt (defines MunshiJi's persona)
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
if (!validation.valid) {
  console.warn('Quality issue:', validation.feedback);
}
```

---

## 📊 Key Methods

### System Prompt
```javascript
composeSystemPrompt()
```
Returns comprehensive system prompt defining:
- MunshiJi's role as 30+ year business mentor
- Response structure (4-part format)
- Tone guidelines (friendly + professional)
- What NOT to do (generic advice, English, vague statements)

### User Prompt with Context
```javascript
composeUserPrompt(userQuestion, businessContext, toolInsights)
```
Builds structured prompt containing:
- User's original question
- Business metrics (products, orders, revenue, customers)
- Identified problems (out of stock, low stock, etc.)
- AI tool insights formatted in Bangla
- Instructions to reference real numbers

**Example Output:**
```
**ব্যবহারকারীর প্রশ্ন:** "আমার স্টক দেখান"

**ব্যবসার বর্তমান পরিস্থিতি:**
• মোট পণ্য: 45টি
• মোট অর্ডার: 123টি
• গত ৭ দিনের বিক্রয়: ৳12,450.00

**চিহ্নিত সমস্যা/সতর্কতা:**
🚨 জরুরী: 2টি পণ্য সম্পূর্ণ শেষ (Nike Shoes, Samsung Phone)
⚠️ সতর্কতা: 5টি পণ্যের স্টক কম

**AI টুল থেকে প্রাপ্ত বিশ্লেষণ:**
**📦 ইনভেন্টরি পরামর্শ:**
[tool insight]
```

### Situation Summary
```javascript
buildSituationSummary(businessContext)
```
Auto-formats metrics:
- Products count & categories
- Orders & revenue
- Average order value
- Customers
- Weekly performance
- Order status breakdown

### Problem Identification
```javascript
identifyKeyProblems(businessContext)
```
Detects:
- 🚨 Out of stock (critical)
- ⚠️ Low stock (< 10 units)
- 📊 No sales (last 7 days)
- 📉 Low orders (< 10 total)
- 📦 Poor delivery rate (< 70%)

### Response Validation
```javascript
validateResponseStructure(response)
```
Returns:
```javascript
{
  valid: true/false,
  hasRealNumbers: true/false,
  hasBangla: true/false,
  isNotGeneric: true/false,
  feedback: "ভালো আছে" or "প্রকৃত সংখ্যা উল্লেখ করুন"
}
```

---

## 💡 Helper Methods

### Format Numbers
```javascript
formatNumber(82350.50)
// Returns: "82,350.50"
```

### Clarification Message
```javascript
composeClairificationPrompt(
  "কোন পণ্য?",
  ["পণ্যের নাম", "ক্যাটাগরি"]
)
```

### Success Message
```javascript
composeSuccessMessage(
  "পণ্য যোগ করা হয়েছে",
  { details: "5টি নতুন পণ্য", nextSteps: "স্টক পরীক্ষা করুন" }
)
```

### Error Message
```javascript
composeErrorMessage('no_data', 'প্রথমে পণ্য যোগ করুন')
```

**Error Types:**
- `no_data` - পর্যাপ্ত তথ্য নেই
- `api_error` - প্রযুক্তিগত সমস্যা
- `invalid_input` - প্রশ্ন বুঝতে পারিনি
- `insufficient_permissions` - অনুমতি নেই

---

## ✅ Quality Checklist

### Good Response Example
```
✅ Has real numbers: "৪৫টি পণ্য", "৳১২,০০০", "৫টি স্টক কম"
✅ In Bangla: Uses Bengali script throughout
✅ Specific advice: Names actual products, gives exact steps
✅ Follows structure: Situation → Problem → Recommendation → Steps
```

### Bad Response Example
```
❌ No numbers: "কিছু পণ্য স্টক কম"
❌ Generic: "সাধারণত ভালো সেবা দিন"
❌ No structure: Just rambling text
❌ English mixed: "আপনার business ভালো"
```

---

## 🎨 Customization

### Add New Problem Detection
```javascript
// In identifyKeyProblems() method
if (context.customerRetentionRate < 50) {
  problems.push(`📉 গ্রাহক ধরে রাখার হার কম (${context.customerRetentionRate}%)`);
}
```

### Modify Response Format
```javascript
// In composeSystemPrompt() method
**উত্তরের গঠন:**
১. পরিস্থিতি সংক্ষেপ
২. মূল সমস্যা
৩. স্পষ্ট সুপারিশ
৪. কর্মপদক্ষেপ
৫. আপনার নতুন অংশ  // Add here
```

### Add New Error Type
```javascript
// In composeErrorMessage() method
const errorMessages = {
  no_data: '...',
  your_error: 'আপনার ত্রুটি বার্তা'
};
```

---

## 🔍 Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Response in English | System prompt not sent | Add system prompt to message history |
| Generic advice | Missing context/insights | Pass complete businessContext + toolInsights |
| No numbers | Empty context | Ensure context has totalProducts, totalOrders, etc. |
| Validation fails | AI not following format | Use GPT-4, check system prompt, verify temperature < 0.8 |

---

## 📁 File Location
```
backend/src/services/promptComposer.js
```

---

## 🔗 Integration Points

**Used by:**
- `munshiJiService.js` - `generateUnifiedResponse()`

**Uses:**
- None (standalone, no dependencies)

**Exports:**
```javascript
export const promptComposer = new PromptComposer();
```

---

## 📈 Impact

### Before Prompt Composer
```javascript
// ❌ 50+ lines of manual prompt building
// ❌ Inconsistent response quality
// ❌ No validation
// ❌ Hard to update tone/structure
```

### After Prompt Composer
```javascript
// ✅ 7 lines of code
// ✅ Consistent quality (validated)
// ✅ Easy to customize
// ✅ Centralized control
```

**Code Reduction:** 50+ lines → 7 lines (86% reduction)

---

## 🎯 Key Takeaways

1. **Always use system prompt** - Defines MunshiJi's persona
2. **Pass complete context** - More data = better responses
3. **Validate responses** - Catch quality issues early
4. **Real numbers required** - No generic statements allowed
5. **Structure enforced** - 4-part format every time

---

## 📚 See Also

- [PROMPT_COMPOSER_DOCS.md](PROMPT_COMPOSER_DOCS.md) - Complete documentation
- [AI_TOOL_REGISTRY_DOCS.md](AI_TOOL_REGISTRY_DOCS.md) - Tool system
- [MUNSHIJI_UPGRADE.md](MUNSHIJI_UPGRADE.md) - Overall architecture
