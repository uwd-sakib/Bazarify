# 🤖 AI Integration with OpenRouter - Bazarify

## ✨ AI Features Implemented

Bazarify now includes **7 AI-powered features** using OpenRouter ChatGPT API:

1. **AI Product Description Generator** - Generate persuasive Bangla product descriptions
2. **Business Insights & Analytics** - Get AI-powered business recommendations  
3. **Customer Message Generator** - Create professional SMS/messages automatically
4. **Sales Trend Analysis & Prediction** - Analyze patterns and predict future sales
5. **Inventory Management Advice** - Smart stock recommendations
6. **AI Chat Assistant** - Interactive business advisor in Bangla
7. **Automated Report Generation** - AI-generated business reports

---

## 🔑 Setup OpenRouter API

### Step 1: Get Your API Key

1. **Sign up at OpenRouter:**
   - Go to: https://openrouter.ai/
   - Click "Sign Up" (free account available)
   - Verify your email

2. **Get API Key:**
   - Go to https://openrouter.ai/keys
   - Click "Create Key"
   - Name it: "Bazarify"
   - Copy the API key

3. **Add Credits (Optional):**
   - OpenRouter offers pay-as-you-go pricing
   - $5 credit = ~10,000 AI requests
   - GPT-4 Turbo: ~$0.01 per request
   - GPT-3.5 Turbo: ~$0.001 per request (recommended for cost)

### Step 2: Update Backend .env

```env
# Add to backend/.env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENROUTER_MODEL=openai/gpt-4-turbo
```

**Available Models:**
```env
# Recommended for cost
OPENROUTER_MODEL=openai/gpt-3.5-turbo

# Best quality
OPENROUTER_MODEL=openai/gpt-4-turbo

# Free tier (limited)
OPENROUTER_MODEL=google/gemini-pro-1.5
```

### Step 3: Restart Backend

```powershell
# Stop backend (Ctrl+C)
# Start again
cd backend
npm run dev
```

---

## 🎯 AI Features in Detail

### 1. AI Product Description Generator

**Location:** Products page → "AI বর্ণনা তৈরি করুন" button

**How it works:**
- Input: Product name, category, price, features
- AI generates: Persuasive Bangla description (3-5 lines)
- Automatically SEO-friendly and sales-oriented

**API Endpoint:**
```http
POST /api/ai/generate-description
Content-Type: application/json
Authorization: Bearer <token>

{
  "productName": "Samsung Galaxy A54",
  "category": "মোবাইল",
  "price": 45000,
  "features": ["৫G সাপোর্ট", "৬GB RAM", "১২৮GB Storage"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "AI দ্বারা বর্ণনা তৈরি হয়েছে",
  "data": {
    "description": "স্যামসাং গ্যালাক্সি A54 একটি অত্যাধুনিক ৫G স্মার্টফোন যা ৬GB RAM এবং ১২৮GB স্টোরেজ সহ আসে। এর শক্তিশালী পারফরম্যান্স এবং দীর্ঘস্থায়ী ব্যাটারি আপনার দৈনন্দিন কাজে সাহায্য করবে। মাত্র ৳৪৫,০০০ টাকায় পান সেরা ফোন এক্সপেরিয়েন্স!"
  }
}
```

---

### 2. Business Insights & Analytics

**Location:** Dashboard → "AI পরামর্শ" card

**How it works:**
- Analyzes: Total sales, orders, products, customers
- Provides: 3-5 actionable business recommendations
- In Bangla, tailored for Bangladesh SMEs

**API Endpoint:**
```http
GET /api/ai/business-insights
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalSales": 125000,
      "totalOrders": 45,
      "totalProducts": 23,
      "totalCustomers": 38,
      "averageOrderValue": "2777.78"
    },
    "insights": "১. আপনার গড় অর্ডার মূল্য ২,৭৭৮ টাকা। ক্রস-সেলিং ও বান্ডেল অফার দিয়ে এটি ৩,৫০০ টাকায় বৃদ্ধি করতে পারেন।\n২. ৪৫টি অর্ডারে ৩৮জন গ্রাহক মানে রিপিট কাস্টমার কম। লয়ালটি প্রোগ্রাম শুরু করুন।\n৩. পণ্যের সংখ্যা ২৩টি ভালো, তবে প্রতিটি পণ্যের বিক্রয় ট্র্যাক করে অপ্রয়োজনীয় পণ্য সরিয়ে ফেলুন।"
  }
}
```

---

### 3. Customer Message Generator

**Location:** Customers → Select customer → "বার্তা পাঠান"

**Message Types:**
- `order_confirmation` - Order confirmation SMS
- `payment_reminder` - Payment reminder
- `promotional` - Promotional offers

**API Endpoint:**
```http
POST /api/ai/generate-message
Authorization: Bearer <token>

{
  "customerName": "রহিম আহমেদ",
  "messageType": "order_confirmation",
  "context": {
    "orderNumber": "ORD-1705123456-1",
    "total": 2500
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "AI দ্বারা বার্তা তৈরি হয়েছে",
  "data": {
    "message": "প্রিয় রহিম আহমেদ, আপনার অর্ডার #ORD-1705123456-1 (৳২৫০০) নিশ্চিত করা হয়েছে। শীঘ্রই ডেলিভারি করা হবে। ধন্যবাদ! - বাজারিফাই"
  }
}
```

---

### 4. Sales Trend Analysis

**Location:** Reports → "AI বিশ্লেষণ" tab

**How it works:**
- Analyzes: Last 7 days sales data
- Predicts: Next week's sales trend
- Suggests: Improvement strategies

**API Endpoint:**
```http
GET /api/ai/sales-analysis
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "salesData": [
      { "amount": 5000, "count": 3 },
      { "amount": 7500, "count": 5 },
      { "amount": 6000, "count": 4 }
    ],
    "analysis": "গত ৭ দিনের বিক্রয় তথ্য বিশ্লেষণ করে দেখা যাচ্ছে:\n১. ঊর্ধ্বমুখী প্রবণতা - গড়ে দৈনিক ৬,১৬৭ টাকা বিক্রয়\n২. পরবর্তী সপ্তাহে প্রায় ৫০,০০০-৫৫,০০০ টাকা বিক্রয় আশা করা যায়\n৩. মধ্য সপ্তাহে বিক্রয় বেশি, সোমবার-মঙ্গলবার প্রমোশন দিন"
  }
}
```

---

### 5. Inventory Management Advice

**Location:** Products → "AI পরামর্শ" button

**How it works:**
- Detects: Low stock products (< 10)
- Identifies: Out of stock items
- Recommends: Reorder priorities

**API Endpoint:**
```http
GET /api/ai/inventory-advice
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "advice": "⚠️ জরুরি পদক্ষেপ প্রয়োজন:\n১. 'Samsung Galaxy A54' স্টক শেষ - অবিলম্বে রিস্টক করুন (সবচেয়ে জনপ্রিয় পণ্য)\n২. 'Xiaomi Earbuds' স্টক ৮টি - ১৫-২০টি অর্ডার দিন\n৩. স্টক ম্যানেজমেন্ট: Weekly review সেট করুন"
  }
}
```

---

### 6. AI Chat Assistant

**Location:** Sidebar → "AI সহায়ক" (new menu item)

**Features:**
- Interactive chat interface
- Remembers conversation context
- Provides business advice in Bangla
- Answers questions about:
  - ব্যবসায়িক পরামর্শ
  - পণ্য ব্যবস্থাপনা
  - গ্রাহক সেবা
  - বিক্রয় কৌশল
  - আর্থিক পরিকল্পনা

**API Endpoint:**
```http
POST /api/ai/chat
Authorization: Bearer <token>

{
  "message": "কিভাবে আমার বিক্রয় বাড়াতে পারি?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "আমার দোকানে গ্রাহক কম আসছে"
    },
    {
      "role": "assistant",
      "content": "গ্রাহক আকর্ষণের জন্য কিছু কৌশল..."
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "বিক্রয় বৃদ্ধির জন্য এই কৌশলগুলো অনুসরণ করুন:\n\n১. **সোশ্যাল মিডিয়া মার্কেটিং**: Facebook, Instagram-এ নিয়মিত পোস্ট করুন\n২. **বিশেষ অফার**: সপ্তাহান্তে ১০-২০% ছাড় দিন\n৩. **রেফারেল প্রোগ্রাম**: বন্ধু আনলে ৫০ টাকা বোনাস\n৪. **গুণমান সেবা**: দ্রুত ডেলিভারি ও ভালো প্যাকেজিং নিশ্চিত করুন"
  }
}
```

---

### 7. Automated Order Report

**Location:** Reports → "AI রিপোর্ট তৈরি করুন"

**Report Periods:**
- Last 7 days (`period=week`)
- Last 30 days (`period=month`)  
- All time (`period=all`)

**API Endpoint:**
```http
GET /api/ai/order-report?period=week
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "report": "📊 গত ৭ দিনের অর্ডার রিপোর্ট\n\n১. পারফরম্যান্স সারাংশ:\n- মোট অর্ডার: ৪৫টি\n- মোট আয়: ৳১,২৫,০০০\n- গড় অর্ডার মূল্য: ৳২,৭৭৮\n- সফল ডেলিভারি: ৪০টি (৮৯%)\n\n২. মূল অন্তর্দৃষ্টি:\n- সর্বোচ্চ বিক্রয় বৃহস্পতিবার-শুক্রবার\n- ক্যান্সেলেশন রেট ৫টি (১১%) - গ্রাহক ফোন নম্বর ভেরিফাই করুন\n\n৩. উন্নতির সুযোগ:\n- পেন্ডিং অর্ডার ২টি - দ্রুত প্রসেস করুন\n- কাস্টমার ফলোআপ বাড়ান\n\n৪. পরবর্তী পদক্ষেপ:\n- সপ্তাহান্তে বিশেষ অফার দিন\n- রিপিট কাস্টমার প্রোগ্রাম শুরু করুন"
  }
}
```

---

## 💰 Cost Estimation

### OpenRouter Pricing

**GPT-4 Turbo:**
- Input: $0.01 per 1K tokens (~750 words)
- Output: $0.03 per 1K tokens
- Average request: $0.01-0.02

**GPT-3.5 Turbo (Recommended):**
- Input: $0.0005 per 1K tokens
- Output: $0.0015 per 1K tokens
- Average request: $0.001-0.002

**Daily Usage Estimate (100 users):**
- 50 product descriptions/day: $0.50 (GPT-3.5) or $10 (GPT-4)
- 100 chat messages/day: $0.20 (GPT-3.5) or $4 (GPT-4)
- 20 reports/day: $0.10 (GPT-3.5) or $2 (GPT-4)
- **Total: $0.80/day (GPT-3.5) or $16/day (GPT-4)**

**Monthly Cost:**
- GPT-3.5: ~$25/month
- GPT-4: ~$500/month

**Recommendation:** Start with GPT-3.5 Turbo for cost efficiency!

---

## 🎨 UI Integration

### Dashboard Changes
- Added "AI পরামর্শ" card showing business insights
- Click to see full AI analysis

### Products Page
- "AI বর্ণনা তৈরি করুন" button in product form
- Auto-fills description field with AI-generated text

### Customers Page
- "বার্তা পাঠান" button for each customer
- Select message type, AI generates professional text

### Reports Page
- "AI বিশ্লেষণ" tab showing sales predictions
- "রিপোর্ট তৈরি করুন" button for automated reports

### New: AI Assistant Page
- Full chat interface
- Conversation history maintained
- Quick suggestion buttons
- Real-time typing indicator

---

## 🔧 Technical Implementation

### Backend Architecture

```
backend/
├── src/
│   ├── services/
│   │   └── aiService.js       ← OpenRouter API integration
│   ├── controllers/
│   │   └── aiController.js    ← 7 AI endpoints
│   ├── routes/
│   │   └── aiRoutes.js        ← /api/ai/* routes
│   └── server.js              ← AI routes mounted
```

### Frontend Architecture

```
frontend/
├── src/
│   ├── pages/
│   │   └── AIAssistant.jsx    ← New AI chat page
│   ├── services/
│   │   └── index.js           ← aiService with 7 methods
│   ├── components/
│   │   └── Sidebar.jsx        ← Added AI Assistant link
│   └── App.jsx                ← /ai-assistant route
```

### API Flow

```
Frontend Component
      ↓
aiService.generateDescription()
      ↓
Axios POST /api/ai/generate-description
      ↓
Backend aiController.generateProductDescription()
      ↓
aiService.generateProductDescription()
      ↓
OpenRouter API (GPT-4/3.5)
      ↓
AI Response in Bangla
      ↓
Response to Frontend
      ↓
Display to User
```

---

## 🧪 Testing AI Features

### 1. Test Product Description Generator

```bash
curl -X POST http://localhost:5000/api/ai/generate-description \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "Samsung LED TV 43 inch",
    "category": "ইলেকট্রনিক্স",
    "price": 35000,
    "features": ["Full HD", "Smart TV", "Wi-Fi"]
  }'
```

### 2. Test AI Chat

```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "আমার ব্যবসায়ের জন্য কি ধরনের প্রচার ভালো হবে?"
  }'
```

### 3. Test Business Insights

```bash
curl http://localhost:5000/api/ai/business-insights \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🚀 Quick Start Guide

### Complete Setup in 5 Minutes:

**1. Get OpenRouter API Key**
```
Visit: https://openrouter.ai/keys
Create key → Copy
```

**2. Update Backend .env**
```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
OPENROUTER_MODEL=openai/gpt-3.5-turbo
```

**3. Install Dependencies**
```bash
cd backend
npm install axios
```

**4. Restart Servers**
```bash
# Backend
cd backend && npm run dev

# Frontend (already running)
# No changes needed!
```

**5. Test AI Features**
- Login to http://localhost:3000
- Go to "AI সহায়ক" in sidebar
- Start chatting!
- Try generating product descriptions
- View business insights on dashboard

---

## 📊 AI Features Summary

| Feature | Endpoint | Purpose | Input | Output |
|---------|----------|---------|-------|--------|
| Product Description | POST /api/ai/generate-description | Auto-generate product text | Product details | Bangla description |
| Business Insights | GET /api/ai/business-insights | Business recommendations | Auto (uses shop data) | 3-5 insights |
| Customer Message | POST /api/ai/generate-message | Generate SMS/messages | Customer name, type | Professional message |
| Sales Analysis | GET /api/ai/sales-analysis | Predict future sales | Auto (last 7 days) | Trend analysis |
| Inventory Advice | GET /api/ai/inventory-advice | Stock recommendations | Auto (product stock) | Reorder priorities |
| AI Chat | POST /api/ai/chat | Interactive advisor | User message | Bangla response |
| Order Report | GET /api/ai/order-report | Automated reports | Period (week/month) | Comprehensive report |

---

## 🔐 Security & Best Practices

✅ **API Key Security:**
- Never commit .env file to git
- Use different keys for dev/prod
- Rotate keys regularly

✅ **Cost Control:**
- Use GPT-3.5 for most features
- Reserve GPT-4 for critical tasks
- Set OpenRouter spending limits

✅ **Error Handling:**
- All AI errors return Bangla messages
- Graceful fallbacks if API fails
- User-friendly error messages

✅ **Rate Limiting:**
- Consider adding rate limits per user
- Prevent API abuse
- Cache frequently requested results

---

## 🎯 What You Need to Provide

**ONLY THIS:**
1. **OpenRouter API Key** - Get from https://openrouter.ai/keys
2. Add to `backend/.env`:
   ```env
   OPENROUTER_API_KEY=sk-or-v1-your_key_here
   OPENROUTER_MODEL=openai/gpt-3.5-turbo
   ```

**Everything else is ready!** 🎉

---

**AI integration is complete and production-ready!** 🤖✨
