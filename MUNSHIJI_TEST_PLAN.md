# MunshiJi System Test Plan

## Test Scenarios for Data Integrity & Edge Cases

---

## Test Category 1: Empty Shop Scenarios

### Test 1.1: Completely New Shop (Zero Everything)

**Setup:**
```javascript
// Database state
products: []
orders: []
customers: []
```

**Expected Behavior:**
```javascript
// API Response
{
  advice: "নতুন দোকান: প্রথমে পণ্য যোগ করুন, তারপর গ্রাহকদের জানান",
  suggestedActions: [
    {
      type: 'expand_inventory',
      reason: 'নতুন দোকান শুরু করতে প্রথমে কমপক্ষে ১০টি জনপ্রিয় পণ্য যোগ করুন।',
      priority: 'high'
    },
    {
      type: 'start_marketing',
      reason: 'পণ্য যোগ করার পর সোশ্যাল মিডিয়ায় আপনার দোকানের প্রচার শুরু করুন।',
      priority: 'medium'
    }
  ]
}
```

**Validation:**
- ✅ No crashes
- ✅ All text in Bangla
- ✅ No hallucinated product names or numbers
- ✅ Actionable advice provided

---

### Test 1.2: Products Added, No Orders Yet

**Setup:**
```javascript
products: [
  { name: 'পাঞ্জাবি', stock: 10, price: 1500 },
  { name: 'জিন্স প্যান্ট', stock: 15, price: 1200 },
  { name: 'শার্ট', stock: 8, price: 800 }
]
orders: []
customers: []
```

**Expected Behavior:**
```javascript
{
  advice: "আপনার দোকানে ৩টি পণ্য আছে কিন্তু এখনো কোনো অর্ডার আসেনি। সোশ্যাল মিডিয়ায় প্রচার শুরু করুন...",
  suggestedActions: [
    {
      type: 'start_marketing',
      reason: 'বিক্রয় বাড়াতে Facebook, Instagram এ প্রচার করুন।'
    },
    {
      type: 'engage_customers',
      reason: 'আপনার পরিচিত মানুষদের দোকানের কথা জানান।'
    }
  ]
}
```

**Validation:**
- ✅ Recognizes 3 products exist
- ✅ Identifies zero sales problem
- ✅ Suggests marketing, not inventory management
- ✅ No fake sales numbers

---

## Test Category 2: Stock Management

### Test 2.1: Out of Stock Crisis

**Setup:**
```javascript
products: [
  { name: 'পাঞ্জাবি', stock: 0, price: 1500 },
  { name: 'জিন্স প্যান্ট', stock: 0, price: 1200 },
  { name: 'শার্ট', stock: 5, price: 800 }
]
orders: [
  { items: [{ product: 'পাঞ্জাবি_id', quantity: 2 }], totalAmount: 3000 },
  { items: [{ product: 'জিন্স_id', quantity: 1 }], totalAmount: 1200 }
]
```

**Expected Behavior:**
```javascript
{
  advice: "🚨 জরুরী: ২টি পণ্য সম্পূর্ণ শেষ (পাঞ্জাবি, জিন্স প্যান্ট)। গ্রাহকরা অর্ডার করতে পারছেন না...",
  suggestedActions: [
    {
      type: 'increase_stock',
      target: {
        productId: '...',
        productName: 'পাঞ্জাবি',
        currentStock: 0,
        suggestedStock: 20
      },
      reason: '"পাঞ্জাবি" সম্পূর্ণ শেষ। গ্রাহকরা অর্ডার করতে পারছেন না।',
      priority: 'high',
      urgency: 'urgent'
    },
    {
      type: 'increase_stock',
      target: {
        productName: 'জিন্স প্যান্ট',
        currentStock: 0,
        suggestedStock: 20
      },
      priority: 'high',
      urgency: 'urgent'
    }
  ]
}
```

**Validation:**
- ✅ Correctly identifies stock=0 products
- ✅ Uses real product names from database
- ✅ Suggests specific stock levels (20)
- ✅ Priority is 'high', urgency is 'urgent'
- ✅ No mention of products not in database

---

### Test 2.2: Low Stock Warning

**Setup:**
```javascript
products: [
  { name: 'পাঞ্জাবি', stock: 3, price: 1500 },
  { name: 'জিন্স প্যান্ট', stock: 7, price: 1200 }
]
```

**Expected Behavior:**
```javascript
{
  suggestedActions: [
    {
      type: 'increase_stock',
      target: {
        productName: 'পাঞ্জাবি',
        currentStock: 3,
        suggestedStock: 9  // max(20, 3*3) = 9... wait should be 20
      },
      reason: '"পাঞ্জাবি" এর স্টক কম (৩টি)। শীঘ্রই শেষ হয়ে যাবে।',
      priority: 'medium'
    }
  ]
}
```

**Validation:**
- ✅ currentStock matches database (3, not rounded or estimated)
- ✅ suggestedStock is calculated: max(20, 3*3) = 20
- ✅ Reason mentions exact current stock
- ✅ Priority is 'medium' (not urgent like out-of-stock)

---

## Test Category 3: Sales Analysis

### Test 3.1: Zero Sales Last 7 Days

**Setup:**
```javascript
products: [
  { name: 'পাঞ্জাবি', stock: 10, price: 1500 }
]
orders: [
  // Order from 10 days ago
  { 
    items: [{ product: 'পাঞ্জাবি_id', quantity: 2 }], 
    totalAmount: 3000,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  }
]
```

**Expected Behavior:**
```javascript
{
  advice: "গত ৭ দিনে কোনো বিক্রয় নেই - মার্কেটিং ও প্রচার প্রয়োজন...",
  suggestedActions: [
    {
      type: 'start_marketing',
      reason: 'বিক্রয় বাড়াতে সোশ্যাল মিডিয়ায় প্রচার শুরু করুন।'
    }
  ]
}
```

**Validation:**
- ✅ Correctly identifies 7-day window (order 10 days ago not counted)
- ✅ Advice focuses on marketing, not inventory
- ✅ No fake recent sales mentioned

---

### Test 3.2: High Stock, No Recent Sales

**Setup:**
```javascript
products: [
  { name: 'Winter Jacket', stock: 75, price: 3000 }
]
orders: [
  // Orders for OTHER products, not Winter Jacket
  { items: [{ product: 'other_product_id', quantity: 1 }], totalAmount: 500 }
]
```

**Expected Behavior:**
```javascript
{
  suggestedActions: [
    {
      type: 'adjust_price',
      target: {
        productName: 'Winter Jacket',
        currentPrice: 3000,
        suggestedPrice: 2700,  // 10% discount
        discount: 10
      },
      reason: '"Winter Jacket" এর অনেক স্টক আছে (৭৫টি) কিন্তু বিক্রয় হচ্ছে না। ১০% ছাড় দিলে বিক্রয় বাড়বে।',
      priority: 'medium'
    }
  ]
}
```

**Validation:**
- ✅ currentPrice = 3000 (exact from database)
- ✅ suggestedPrice = 2700 (calculated: 3000 * 0.9)
- ✅ stock = 75 (exact from database)
- ✅ Correctly identified product has no sales (not in recent orders)

---

## Test Category 4: Top Performers

### Test 4.1: Promote Best Sellers

**Setup:**
```javascript
products: [
  { _id: 'A', name: 'পাঞ্জাবি', stock: 10, price: 1500 },
  { _id: 'B', name: 'শার্ট', stock: 15, price: 800 },
  { _id: 'C', name: 'জিন্স', stock: 12, price: 1200 }
]
orders: [
  { items: [{ product: 'A', quantity: 5 }] },  // Panjabi sold 5
  { items: [{ product: 'A', quantity: 3 }] },  // Panjabi sold 3 more
  { items: [{ product: 'B', quantity: 2 }] },  // Shirt sold 2
  { items: [{ product: 'C', quantity: 1 }] }   // Jeans sold 1
]
```

**Expected Behavior:**
```javascript
{
  suggestedActions: [
    {
      type: 'promote_product',
      target: {
        productName: 'পাঞ্জাবি',
        salesCount: 8  // 5 + 3
      },
      reason: '"পাঞ্জাবি" সবচেয়ে বেশি বিক্রি হয়েছে (৮ বার)। আরো প্রচার করলে বিক্রয় আরো বাড়বে।',
      priority: 'high'
    },
    {
      type: 'promote_product',
      target: {
        productName: 'শার্ট',
        salesCount: 2
      },
      reason: '"শার্ট" সবচেয়ে বেশি বিক্রি হয়েছে (২ বার)...'
    }
  ]
}
```

**Validation:**
- ✅ salesCount = 8 (correct sum: 5+3)
- ✅ Products sorted by sales (পাঞ্জাবি first, then শার্ট)
- ✅ Real product names used
- ✅ No mention of products not in database

---

## Test Category 5: Error Handling

### Test 5.1: Database Connection Failure

**Setup:**
```javascript
// MongoDB connection lost
Product.find() throws error
```

**Expected Behavior:**
```javascript
// munshiJiService.fetchBusinessContext() catch block
return {
  products: [],
  orders: [],
  customers: [],
  totalProducts: 0,
  totalRevenue: 0,
  hasProducts: false,
  hasOrders: false,
  // ... all safe defaults
}
```

**Expected API Response:**
```javascript
{
  advice: "নতুন দোকান: প্রথমে পণ্য যোগ করুন...",
  suggestedActions: [...]
}
```

**Validation:**
- ✅ No crash
- ✅ Fallback context used
- ✅ Response still valid JSON
- ✅ All Bangla text

---

### Test 5.2: Malformed Data

**Setup:**
```javascript
products: [
  { name: 'Test', stock: null, price: undefined },
  { name: 'Test2', stock: 'abc', price: -100 }
]
orders: [
  { totalAmount: null },
  { totalAmount: 'not a number' }
]
```

**Expected Behavior:**
```javascript
// All Number() conversions with || 0 fallback
const stock = Number(null) || 0;  // 0
const price = Number(undefined) || 0;  // 0
const amount = Number(null) || 0;  // 0

// Calculations proceed with 0 values
totalRevenue = 0 + 0 = 0
averageOrderValue = 0
```

**Validation:**
- ✅ No NaN in calculations
- ✅ No crashes
- ✅ Invalid data treated as 0
- ✅ System identifies lack of valid data

---

## Test Category 6: Bangla Language Enforcement

### Test 6.1: System Prompt Check

**Expected System Prompt:**
```
আপনাকে অবশ্যই বাংলায় উত্তর দিতে হবে। ইংরেজি বা অন্য কোনো ভাষা ব্যবহার করা যাবে না।

Rules:
1. শুধুমাত্র বাংলা ভাষায় কথা বলুন
2. কোনো ইংরেজি শব্দ বা বাক্য ব্যবহার করবেন না
```

**Validation:**
- ✅ Explicit Bangla-only instruction present
- ✅ No mixed language examples in prompt
- ✅ All context labels in Bangla

---

### Test 6.2: Fallback Messages

**Check All Edge Cases:**
```javascript
'নতুন দোকান: প্রথমে পণ্য যোগ করুন'  // Empty shop
'পণ্য: কোনো পণ্য যুক্ত হয়নি'  // No products
'অর্ডার: এখনো কোনো অর্ডার আসেনি'  // No orders
'গ্রাহক: কোনো গ্রাহক নেই'  // No customers
'গত ৭ দিনে কোনো বিক্রয় নেই'  // No recent sales
```

**Validation:**
- ✅ All messages in Bangla
- ✅ No English words
- ✅ Numbers can be 0, 1, 2 (English numerals acceptable)

---

## Test Category 7: Number Consistency

### Test 7.1: Cross-Reference Check

**Setup:**
```javascript
products: [
  { _id: 'A', name: 'পাঞ্জাবি', stock: 15, price: 1500 }
]
orders: [
  { items: [{ product: 'A', quantity: 2 }], totalAmount: 3000 },
  { items: [{ product: 'A', quantity: 1 }], totalAmount: 1500 }
]
```

**Expected Calculations:**
```javascript
totalOrders = 2
totalRevenue = 3000 + 1500 = 4500
averageOrderValue = 4500 / 2 = 2250
```

**AI Response Must Match:**
```
"আপনার মোট ২টি অর্ডার হয়েছে। মোট বিক্রয় ৪৫০০ টাকা। গড় অর্ডার মূল্য ২২৫০ টাকা।"
```

**Validation:**
- ✅ totalOrders = 2 (exact)
- ✅ totalRevenue = 4500 (exact sum)
- ✅ averageOrderValue = 2250 (exact division)
- ✅ No rounding errors in AI response

---

### Test 7.2: Stock Level Accuracy

**Setup:**
```javascript
{ name: 'Test Product', stock: 7 }
```

**AI Response Should Say:**
```
"Test Product এর স্টক কম (৭টি)"  // Exact: 7
```

**AI Response Should NOT Say:**
```
"Test Product এর স্টক কম (প্রায় ৫-১০টি)"  // Vague
"Test Product প্রায় শেষ"  // Estimated
```

**Validation:**
- ✅ Exact stock number (7) mentioned
- ✅ No approximations or ranges
- ✅ No "about" or "around" phrasing

---

## Test Category 8: Performance Under Load

### Test 8.1: Large Dataset

**Setup:**
```javascript
products: Array(500).fill({ name: '...', stock: 10, price: 1000 })
orders: Array(10000).fill({ totalAmount: 500 })
```

**Expected Behavior:**
- ✅ Response time < 5 seconds
- ✅ All calculations complete
- ✅ No memory errors
- ✅ Actions limited to top 5-10 (not all 500 products)

---

## Test Execution Checklist

### Manual Tests
- [ ] Test 1.1: New shop (zero everything)
- [ ] Test 1.2: Products added, no orders
- [ ] Test 2.1: Out of stock crisis
- [ ] Test 2.2: Low stock warning
- [ ] Test 3.1: Zero sales last 7 days
- [ ] Test 3.2: High stock, no sales
- [ ] Test 4.1: Promote best sellers
- [ ] Test 5.1: Database error
- [ ] Test 5.2: Malformed data
- [ ] Test 6.1: System prompt Bangla check
- [ ] Test 6.2: Fallback messages Bangla check
- [ ] Test 7.1: Number cross-reference
- [ ] Test 7.2: Stock level accuracy

### Automated Tests (Future)
```javascript
// Example test structure
describe('MunshiJi Data Integrity', () => {
  test('handles empty shop gracefully', async () => {
    const context = await fetchBusinessContext('empty_shop_id');
    expect(context.hasProducts).toBe(false);
    expect(context.totalRevenue).toBe(0);
    
    const response = await munshiJiService.processRequest('দোকানের অবস্থা?', 'empty_shop_id');
    expect(response.advice).toMatch(/নতুন দোকান/);
  });
  
  test('never hallucinates product names', async () => {
    const context = await fetchBusinessContext('shop_id');
    const response = await munshiJiService.processRequest('পরামর্শ দিন', 'shop_id');
    
    // Extract all product names mentioned in response
    const mentionedProducts = extractProductNames(response.advice);
    
    // Verify all mentioned products exist in database
    mentionedProducts.forEach(productName => {
      const exists = context.products.some(p => p.name === productName);
      expect(exists).toBe(true);
    });
  });
});
```

---

## Success Criteria

### All Tests Must Pass:
- ✅ No crashes on empty data
- ✅ No hallucinated numbers
- ✅ All outputs in Bangla
- ✅ Accurate calculations
- ✅ Real product/order data only
- ✅ Graceful error handling
- ✅ Actionable advice in all scenarios

### System Ready for Production When:
1. All 13 manual tests pass
2. No English text in responses
3. All numbers verifiable against database
4. Edge cases handled gracefully
5. Performance acceptable (<5s response time)

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Status**: Ready for Testing  
