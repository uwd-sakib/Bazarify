# MunshiJi V1 API Documentation

## Overview

The V1 MunshiJi API endpoint provides a structured, production-ready interface for AI-powered business advisory with:
- ✅ Bangla advice in structured format
- ✅ JSON-formatted suggested actions
- ✅ Action categorization and prioritization
- ✅ Metadata for tracking and analytics

---

## Endpoint

```
POST /api/v1/ai/munshiji
```

**Authentication:** Required (Bearer token)

**Authorization:** Merchant role required

---

## Request Format

### Headers
```http
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

### Body
```json
{
  "message": "আমার স্টক দেখান",
  "conversationHistory": [
    {
      "role": "user",
      "content": "আমার ব্যবসা কেমন চলছে?"
    },
    {
      "role": "assistant",
      "content": "আপনার ব্যবসা ভালো চলছে..."
    }
  ]
}
```

### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | String | ✅ Yes | User's question in Bangla or English |
| `conversationHistory` | Array | ❌ No | Previous conversation context (max last 4 messages recommended) |

---

## Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "advice": "**পরিস্থিতি:** আপনার ব্যবসায়ে ৪৫টি পণ্য আছে এবং গত সপ্তাহে ৳১২,৪৫০ বিক্রয় হয়েছে। মোট ১২৩টি অর্ডার এসেছে।\n\n**মূল সমস্যা:** ৫টি পণ্যের স্টক ১০-এর নিচে নেমে গেছে এবং ২টি পণ্য সম্পূর্ণ শেষ। এর ফলে আপনি নতুন অর্ডার হারাচ্ছেন।\n\n**সুপারিশ:** অবিলম্বে এই ৭টি পণ্যের স্টক পুনরায় পূরণ করুন। গত মাসে এই পণ্যগুলো থেকে ৩৫% আয় এসেছে।\n\n**কর্মপদক্ষেপ:**\n১. আজই সরবরাহকারীকে অর্ডার দিন\n২. প্রতি পণ্যের জন্য ন্যূনতম ২০টি স্টক রাখুন\n৩. সপ্তাহে একবার স্টক পরীক্ষা করুন",
    
    "suggestedActions": [
      {
        "priority": 1,
        "action": "আজই সরবরাহকারীকে অর্ডার দিন",
        "category": "inventory",
        "completed": false
      },
      {
        "priority": 2,
        "action": "প্রতি পণ্যের জন্য ন্যূনতম ২০টি স্টক রাখুন",
        "category": "inventory",
        "completed": false
      },
      {
        "priority": 3,
        "action": "সপ্তাহে একবার স্টক পরীক্ষা করুন",
        "category": "operations",
        "completed": false
      }
    ],
    
    "metadata": {
      "toolsUsed": ["inventory_advice", "business_insights"],
      "reasoning": "User asked about stock, detected low inventory issues",
      "timestamp": "2026-01-15T10:30:45.123Z"
    }
  }
}
```

### Error Response (400 Bad Request)

```json
{
  "success": false,
  "message": "বার্তা প্রয়োজন"
}
```

### Error Response (500 Internal Server Error)

```json
{
  "success": false,
  "message": "মুন্সিজি সেবা অনুপলব্ধ"
}
```

---

## Response Structure

### `advice` (String)
Complete business advice in Bangla following the 4-part structure:

1. **পরিস্থিতি সংক্ষেপ (Situation Summary)**
   - Current business state with real numbers
   
2. **মূল সমস্যা (Key Problem)**
   - Specific issues identified with data
   
3. **স্পষ্ট সুপারিশ (Clear Recommendation)**
   - Actionable advice with reasoning
   
4. **কর্মপদক্ষেপ (Action Steps)**
   - Numbered, specific steps to take

### `suggestedActions` (Array)
Structured JSON array of actionable steps extracted from advice.

Each action object contains:

| Field | Type | Description |
|-------|------|-------------|
| `priority` | Number | Action priority (1 = highest) |
| `action` | String | Action description in Bangla |
| `category` | String | Action category (see categories below) |
| `completed` | Boolean | Completion status (always `false` initially) |

**Action Categories:**
- `inventory` - Stock, products, suppliers
- `marketing` - Promotion, advertising, social media
- `customer` - Customer service, communication
- `sales` - Sales, offers, discounts
- `operations` - Delivery, order processing
- `financial` - Money, revenue, expenses, profit
- `general` - Other/uncategorized

### `metadata` (Object)
Additional information for tracking and analytics:

| Field | Type | Description |
|-------|------|-------------|
| `toolsUsed` | Array | AI tools that were executed |
| `reasoning` | String | Why those tools were selected |
| `timestamp` | String | ISO 8601 timestamp of response |

---

## Flow Diagram

```
Client Request
     ↓
1. Authentication (middleware)
     ↓
2. Build Business Context
   - Fetch products, orders, customers
   - Calculate metrics
   - Detect problems
     ↓
3. Decide Required AI Tools
   - Analyze user intent
   - Match keywords
   - Check conditions
   - Prioritize tools
     ↓
4. Generate Unified Prompt
   - System prompt (persona)
   - User prompt (context)
   - Tool insights
   - Validation rules
     ↓
5. Call AI (OpenRouter)
   - GPT-4 Turbo recommended
   - Structured response
   - Bangla output
     ↓
6. Extract & Structure Actions
   - Parse response
   - Extract numbered steps
   - Categorize each action
   - Assign priorities
     ↓
Response to Client
```

---

## Example Requests & Responses

### Example 1: Stock Inquiry

**Request:**
```bash
curl -X POST https://api.bazarify.com/api/v1/ai/munshiji \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "message": "আমার স্টক দেখান"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "advice": "**পরিস্থিতি:** আপনার ৪৫টি পণ্য আছে...",
    "suggestedActions": [
      {
        "priority": 1,
        "action": "আজই সরবরাহকারীকে অর্ডার দিন",
        "category": "inventory",
        "completed": false
      }
    ],
    "metadata": {
      "toolsUsed": ["inventory_advice"],
      "reasoning": "Stock inquiry detected",
      "timestamp": "2026-01-15T10:30:45.123Z"
    }
  }
}
```

### Example 2: Business Performance

**Request:**
```bash
curl -X POST https://api.bazarify.com/api/v1/ai/munshiji \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "message": "ব্যবসা কেমন চলছে?"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "advice": "**পরিস্থিতি:** আপনার ব্যবসা ভালো চলছে! মোট ৮২,৩৫০ টাকা বিক্রয় হয়েছে...",
    "suggestedActions": [
      {
        "priority": 1,
        "action": "সোশ্যাল মিডিয়ায় প্রচার শুরু করুন",
        "category": "marketing",
        "completed": false
      },
      {
        "priority": 2,
        "action": "বিদ্যমান গ্রাহকদের অফার দিন",
        "category": "sales",
        "completed": false
      }
    ],
    "metadata": {
      "toolsUsed": ["business_insights", "sales_trend"],
      "reasoning": "General performance inquiry",
      "timestamp": "2026-01-15T10:31:22.456Z"
    }
  }
}
```

### Example 3: Complete Analysis

**Request:**
```bash
curl -X POST https://api.bazarify.com/api/v1/ai/munshiji \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "message": "সম্পূর্ণ বিশ্লেষণ দিন"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "advice": "**পরিস্থিতি:** আপনার ব্যবসায়ে ৪৫টি পণ্য, ১২৩টি অর্ডার এবং ৮৭ জন গ্রাহক আছে...",
    "suggestedActions": [
      {
        "priority": 1,
        "action": "স্টক শেষ ৫টি পণ্য পুনরায় পূরণ করুন",
        "category": "inventory",
        "completed": false
      },
      {
        "priority": 2,
        "action": "Facebook এবং Instagram এ প্রচার শুরু করুন",
        "category": "marketing",
        "completed": false
      },
      {
        "priority": 3,
        "action": "শীর্ষ ১০ গ্রাহকদের ধন্যবাদ বার্তা পাঠান",
        "category": "customer",
        "completed": false
      },
      {
        "priority": 4,
        "action": "অপেক্ষমাণ ১৫টি অর্ডার দ্রুত ডেলিভার করুন",
        "category": "operations",
        "completed": false
      }
    ],
    "metadata": {
      "toolsUsed": ["business_insights", "inventory_advice", "sales_trend", "order_report"],
      "reasoning": "Complete analysis requested, executed all relevant tools",
      "timestamp": "2026-01-15T10:32:10.789Z"
    }
  }
}
```

---

## Integration Examples

### JavaScript/TypeScript

```javascript
const munshiJiV1 = async (message, conversationHistory = []) => {
  const response = await fetch('/api/v1/ai/munshiji', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      message,
      conversationHistory
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log('Advice:', data.data.advice);
    console.log('Actions:', data.data.suggestedActions);
    
    // Display actions to user
    data.data.suggestedActions.forEach((action, idx) => {
      console.log(`${action.priority}. [${action.category}] ${action.action}`);
    });
  }
  
  return data;
};
```

### React Component

```jsx
import { useState } from 'react';

function MunshiJiChat() {
  const [message, setMessage] = useState('');
  const [advice, setAdvice] = useState('');
  const [actions, setActions] = useState([]);
  
  const handleSend = async () => {
    const response = await fetch('/api/v1/ai/munshiji', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ message })
    });
    
    const data = await response.json();
    
    if (data.success) {
      setAdvice(data.data.advice);
      setActions(data.data.suggestedActions);
    }
  };
  
  return (
    <div>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleSend}>Send</button>
      
      {advice && (
        <div>
          <h3>পরামর্শ:</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{advice}</p>
          
          <h3>করণীয়:</h3>
          <ul>
            {actions.map((action, idx) => (
              <li key={idx}>
                <input type="checkbox" />
                <span className={`badge-${action.category}`}>
                  {action.category}
                </span>
                {action.action}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Python

```python
import requests

def munshiji_v1(message, token, conversation_history=None):
    url = "https://api.bazarify.com/api/v1/ai/munshiji"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    payload = {
        "message": message,
        "conversationHistory": conversation_history or []
    }
    
    response = requests.post(url, json=payload, headers=headers)
    data = response.json()
    
    if data.get("success"):
        advice = data["data"]["advice"]
        actions = data["data"]["suggestedActions"]
        
        print("পরামর্শ:", advice)
        print("\nকরণীয়:")
        for action in actions:
            print(f"{action['priority']}. [{action['category']}] {action['action']}")
        
        return data["data"]
    else:
        print("Error:", data.get("message"))
        return None

# Usage
result = munshiji_v1(
    message="আমার স্টক দেখান",
    token="your_jwt_token"
)
```

---

## Comparison: V1 vs Original

| Feature | Original (`/api/ai/munshiji`) | V1 (`/api/v1/ai/munshiji`) |
|---------|-------------------------------|----------------------------|
| Response Format | Developer-focused | Production-ready |
| Advice | `response` (String) | `advice` (String) |
| Actions | Not structured | `suggestedActions` (JSON Array) |
| Action Categories | ❌ No | ✅ Yes (7 categories) |
| Action Priority | ❌ No | ✅ Yes (numbered) |
| Metadata | Inline | Nested in `metadata` |
| Client Parsing | Required | Minimal/Optional |
| UI Integration | Complex | Simple |
| Breaking Changes | ✅ Possible | ❌ Versioned |

**Recommendation:** Use V1 for production applications. Use original for testing/debugging.

---

## Action Categorization Logic

The API automatically categorizes actions based on Bangla keywords:

```javascript
// Inventory
"স্টক", "পণ্য", "সরবরাহ" → inventory

// Marketing
"মার্কেটিং", "প্রচার", "বিজ্ঞাপন", "সোশ্যাল" → marketing

// Customer
"গ্রাহক", "সেবা", "যোগাযোগ" → customer

// Sales
"বিক্রয়", "অফার", "ছাড়" → sales

// Operations
"ডেলিভারি", "অর্ডার", "প্রসেস" → operations

// Financial
"টাকা", "আয়", "খরচ", "লাভ" → financial

// General (fallback)
Everything else → general
```

---

## Best Practices

### 1. Conversation History
```javascript
// ✅ Good - Include last 2-4 messages
const history = [
  { role: 'user', content: 'স্টক দেখান' },
  { role: 'assistant', content: '...' },
  { role: 'user', content: 'আরো বিস্তারিত' }
];

// ❌ Bad - Too many messages (performance impact)
const history = [...lastHundredMessages];
```

### 2. Action Display
```javascript
// ✅ Good - Group by category
const groupedActions = actions.reduce((acc, action) => {
  (acc[action.category] = acc[action.category] || []).push(action);
  return acc;
}, {});

// Display by category
Object.entries(groupedActions).forEach(([category, items]) => {
  console.log(`\n${category.toUpperCase()}:`);
  items.forEach(item => console.log(`  ${item.priority}. ${item.action}`));
});
```

### 3. Error Handling
```javascript
try {
  const response = await munshiJiV1(message);
  
  if (!response.success) {
    // Handle API error
    showError(response.message);
    return;
  }
  
  // Process successful response
  displayAdvice(response.data.advice);
  displayActions(response.data.suggestedActions);
  
} catch (error) {
  // Handle network error
  console.error('Network error:', error);
  showError('সংযোগ সমস্যা হয়েছে');
}
```

### 4. Action Tracking
```javascript
// Track completed actions
const markActionComplete = async (actionIndex) => {
  const updatedActions = [...actions];
  updatedActions[actionIndex].completed = true;
  
  // Save to backend/state
  await saveActions(updatedActions);
  
  // Update UI
  setActions(updatedActions);
};
```

---

## Rate Limiting

**Current Limits:** (Configure in production)
- 30 requests per minute per user
- 500 requests per hour per user

**Headers:**
```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 25
X-RateLimit-Reset: 1642252800
```

---

## Troubleshooting

### No Actions Returned

**Cause:** Response doesn't contain action steps section

**Solution:** Ensure the prompt composer generates the full 4-part structure

### Wrong Action Categories

**Cause:** Keyword matching didn't find relevant terms

**Solution:** Add more keywords to `categorizeAction()` function or manually override categories

### Advice in English

**Cause:** System prompt not properly applied

**Solution:** Verify OpenRouter API key and model configuration (use GPT-4 for best Bangla support)

---

## Security

### Authentication
- JWT token required in Authorization header
- Token must be valid and not expired
- Merchant role required

### Data Privacy
- User messages are not logged
- Business context is fetched per request (not cached)
- Conversation history is not stored server-side

### Input Validation
- Message length limit: 1000 characters
- Conversation history limit: 10 messages
- Sanitized before AI processing

---

## Future Enhancements

### Planned Features
1. **Action Webhooks** - Notify when actions completed
2. **Scheduled Actions** - Set reminders for actions
3. **Action Templates** - Pre-built action plans
4. **Multi-language** - English advice option
5. **Voice Input** - Speech-to-text for questions
6. **Batch Processing** - Multiple questions in one request

---

## Support

**Documentation:**
- Main: [MUNSHIJI_UPGRADE.md](MUNSHIJI_UPGRADE.md)
- Prompt: [PROMPT_COMPOSER_DOCS.md](PROMPT_COMPOSER_DOCS.md)
- Registry: [AI_TOOL_REGISTRY_DOCS.md](AI_TOOL_REGISTRY_DOCS.md)

**Endpoint:** `/api/v1/ai/munshiji`

**Version:** 1.0.0

**Status:** ✅ Production Ready
