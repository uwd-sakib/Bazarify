# MunshiJi Structured Actions - Documentation

## Overview

MunshiJi now returns **structured, UI-renderable actions** with every response. These actions are business-specific, actionable, and ready to be rendered in your frontend with interactive components.

---

## Action Structure

Each action has a consistent structure designed for UI rendering:

```javascript
{
  id: "action_1737804645123_0",           // Unique identifier
  type: "increase_stock",                  // Action type (see types below)
  target: {                                // What to act on
    entity: "product",                     // Entity type
    productId: "507f1f77bcf86cd799439011", // Specific ID
    productName: "Nike Shoes",             // Display name
    currentStock: 0,                       // Current value
    suggestedStock: 20                     // Suggested value
  },
  reason: "Nike Shoes সম্পূর্ণ শেষ। গ্রাহকরা অর্ডার করতে পারছেন না।", // Bangla reason
  priority: "high",                        // Priority level
  urgency: "urgent",                       // Urgency level
  createdAt: "2026-01-15T10:30:45.123Z",  // Timestamp
  completed: false                         // Completion status
}
```

---

## Action Types

### 1. `increase_stock`
Suggest increasing stock for products that are low or out of stock.

**Target Entity:** `product`

**Target Fields:**
```javascript
{
  entity: "product",
  productId: "507f...",
  productName: "Nike Shoes",
  currentStock: 5,
  suggestedStock: 20
}
```

**Example Reason:**
- `"Nike Shoes" সম্পূর্ণ শেষ। গ্রাহকরা অর্ডার করতে পারছেন না।`
- `"T-Shirt" এর স্টক কম (৫টি)। শীঘ্রই শেষ হয়ে যাবে।`

**When Generated:**
- Product is out of stock (`stock === 0`)
- Product has low stock (`stock < 10`)

**UI Rendering:**
```jsx
<ActionCard>
  <Badge color="red">উচ্চ অগ্রাধিকার</Badge>
  <Icon name="box" />
  <Title>স্টক বাড়ান</Title>
  <ProductName>{action.target.productName}</ProductName>
  <StockInfo>
    বর্তমান: {action.target.currentStock}টি → 
    প্রস্তাবিত: {action.target.suggestedStock}টি
  </StockInfo>
  <Reason>{action.reason}</Reason>
  <Button onClick={() => increaseStock(action.target)}>
    স্টক বাড়ান
  </Button>
</ActionCard>
```

---

### 2. `adjust_price`
Suggest price adjustment for products with high stock but low sales.

**Target Entity:** `product`

**Target Fields:**
```javascript
{
  entity: "product",
  productId: "507f...",
  productName: "Laptop",
  currentPrice: 45000,
  suggestedPrice: 40500,
  discount: 10  // Percentage
}
```

**Example Reason:**
- `"Laptop" এর অনেক স্টক আছে (৬৫টি) কিন্তু বিক্রয় হচ্ছে না। ১০% ছাড় দিলে বিক্রয় বাড়বে।`

**When Generated:**
- Product has high stock (`> 50`)
- Product has no recent sales

**UI Rendering:**
```jsx
<ActionCard>
  <Badge color="yellow">মাঝারি অগ্রাধিকার</Badge>
  <Icon name="tag" />
  <Title>দাম সমন্বয় করুন</Title>
  <ProductName>{action.target.productName}</ProductName>
  <PriceInfo>
    বর্তমান: ৳{action.target.currentPrice} → 
    প্রস্তাবিত: ৳{action.target.suggestedPrice}
    ({action.target.discount}% ছাড়)
  </PriceInfo>
  <Reason>{action.reason}</Reason>
  <Button onClick={() => adjustPrice(action.target)}>
    দাম আপডেট করুন
  </Button>
</ActionCard>
```

---

### 3. `promote_product`
Suggest promoting top-selling products to increase sales further.

**Target Entity:** `product`

**Target Fields:**
```javascript
{
  entity: "product",
  productId: "507f...",
  productName: "Samsung Phone",
  salesCount: 25
}
```

**Example Reason:**
- `"Samsung Phone" সবচেয়ে বেশি বিক্রি হয়েছে (২৫ বার)। আরো প্রচার করলে বিক্রয় আরো বাড়বে।`

**When Generated:**
- Product is in top 3 best sellers
- Recent sales data exists

**UI Rendering:**
```jsx
<ActionCard>
  <Badge color="green">উচ্চ অগ্রাধিকার</Badge>
  <Icon name="megaphone" />
  <Title>পণ্য প্রচার করুন</Title>
  <ProductName>{action.target.productName}</ProductName>
  <SalesInfo>মোট বিক্রয়: {action.target.salesCount} বার</SalesInfo>
  <Reason>{action.reason}</Reason>
  <Button onClick={() => promoteProduct(action.target)}>
    প্রচার শুরু করুন
  </Button>
</ActionCard>
```

---

### 4. `start_marketing`
Suggest starting marketing campaigns when sales are low.

**Target Entity:** `shop`

**Target Fields:**
```javascript
{
  entity: "shop",
  channels: ["facebook", "instagram", "whatsapp"],
  budget: 1000
}
```

**Example Reason:**
- `গত সপ্তাহে মাত্র ৳২৫০০ বিক্রয় হয়েছে। মার্কেটিং বাড়ালে বিক্রয় বাড়বে।`
- `গত ৭ দিনে কোনো বিক্রয় নেই। সোশ্যাল মিডিয়ায় প্রচার শুরু করুন।`

**When Generated:**
- No sales in last 7 days
- Weekly revenue < ৳5,000

**UI Rendering:**
```jsx
<ActionCard>
  <Badge color="red">জরুরী</Badge>
  <Icon name="bullhorn" />
  <Title>মার্কেটিং শুরু করুন</Title>
  <ChannelList>
    {action.target.channels.map(channel => (
      <ChannelBadge key={channel}>{channel}</ChannelBadge>
    ))}
  </ChannelList>
  <Budget>প্রস্তাবিত বাজেট: ৳{action.target.budget}</Budget>
  <Reason>{action.reason}</Reason>
  <Button onClick={() => startMarketing(action.target)}>
    ক্যাম্পেইন তৈরি করুন
  </Button>
</ActionCard>
```

---

### 5. `engage_customers`
Suggest customer engagement campaigns for existing customers.

**Target Entity:** `customers`

**Target Fields:**
```javascript
{
  entity: "customers",
  count: 87,
  offerType: "loyalty_discount"
}
```

**Example Reason:**
- `৮৭ জন গ্রাহক আছেন কিন্তু রিপিট অর্ডার কম। লয়ালটি অফার দিলে তারা আবার কিনবেন।`

**When Generated:**
- Total customers > 10
- Repeat order rate is low

**UI Rendering:**
```jsx
<ActionCard>
  <Badge color="blue">মাঝারি অগ্রাধিকার</Badge>
  <Icon name="users" />
  <Title>গ্রাহক যুক্ততা বাড়ান</Title>
  <CustomerCount>{action.target.count} জন গ্রাহক</CustomerCount>
  <OfferType>অফার: লয়ালটি ডিসকাউন্ট</OfferType>
  <Reason>{action.reason}</Reason>
  <Button onClick={() => engageCustomers(action.target)}>
    অফার পাঠান
  </Button>
</ActionCard>
```

---

### 6. `improve_delivery`
Suggest improving delivery operations when delivery rate is low.

**Target Entity:** `operations`

**Target Fields:**
```javascript
{
  entity: "operations",
  pendingOrders: 15,
  currentRate: 65,  // Percentage
  targetRate: 90    // Percentage
}
```

**Example Reason:**
- `ডেলিভারি হার মাত্র ৬৫%। ১৫টি অর্ডার অপেক্ষমাণ। দ্রুত ডেলিভার করুন।`

**When Generated:**
- Delivery rate < 70%
- Total orders > 10

**UI Rendering:**
```jsx
<ActionCard>
  <Badge color="red">জরুরী</Badge>
  <Icon name="truck" />
  <Title>ডেলিভারি উন্নত করুন</Title>
  <RateInfo>
    বর্তমান: {action.target.currentRate}% → 
    লক্ষ্য: {action.target.targetRate}%
  </RateInfo>
  <PendingOrders>{action.target.pendingOrders}টি অপেক্ষমাণ</PendingOrders>
  <Reason>{action.reason}</Reason>
  <Button onClick={() => viewPendingOrders(action.target)}>
    অপেক্ষমাণ অর্ডার দেখুন
  </Button>
</ActionCard>
```

---

### 7. `expand_inventory`
Suggest expanding product inventory when business is doing well.

**Target Entity:** `shop`

**Target Fields:**
```javascript
{
  entity: "shop",
  currentProducts: 25,
  suggestedProducts: 50,
  categories: ["Electronics", "Clothing", "Food"]
}
```

**Example Reason:**
- `আপনার ব্যবসা ভালো চলছে (৳৮২৩৫০ বিক্রয়)। নতুন পণ্য যোগ করলে আরো বেশি বিক্রয় হবে।`

**When Generated:**
- Total revenue > ৳50,000
- Total products < 30

**UI Rendering:**
```jsx
<ActionCard>
  <Badge color="green">কম অগ্রাধিকার</Badge>
  <Icon name="plus-circle" />
  <Title>ইনভেন্টরি সম্প্রসারণ করুন</Title>
  <ProductInfo>
    বর্তমান: {action.target.currentProducts}টি → 
    প্রস্তাবিত: {action.target.suggestedProducts}টি
  </ProductInfo>
  <Categories>
    {action.target.categories.map(cat => (
      <CategoryBadge key={cat}>{cat}</CategoryBadge>
    ))}
  </Categories>
  <Reason>{action.reason}</Reason>
  <Button onClick={() => addProducts()}>
    পণ্য যোগ করুন
  </Button>
</ActionCard>
```

---

## Priority & Urgency Levels

### Priority
- **`high`** - Important, should be done soon
- **`medium`** - Moderately important
- **`low`** - Nice to have, not urgent

### Urgency
- **`urgent`** - Do immediately
- **`soon`** - Do within 1-2 days
- **`normal`** - Do when convenient

### Sorting
Actions are automatically sorted by:
1. Priority (high → medium → low)
2. Urgency (urgent → soon → normal)

---

## API Response Example

### Request
```bash
POST /api/ai/munshiji
```

### Response
```json
{
  "success": true,
  "data": {
    "response": "**পরিস্থিতি:** আপনার ৪৫টি পণ্য আছে...",
    "actions": [
      {
        "id": "action_1737804645123_0",
        "type": "increase_stock",
        "target": {
          "entity": "product",
          "productId": "507f1f77bcf86cd799439011",
          "productName": "Nike Shoes",
          "currentStock": 0,
          "suggestedStock": 20
        },
        "reason": "Nike Shoes সম্পূর্ণ শেষ। গ্রাহকরা অর্ডার করতে পারছেন না।",
        "priority": "high",
        "urgency": "urgent",
        "createdAt": "2026-01-15T10:30:45.123Z",
        "completed": false
      },
      {
        "id": "action_1737804645123_1",
        "type": "start_marketing",
        "target": {
          "entity": "shop",
          "channels": ["facebook", "instagram", "whatsapp"],
          "budget": 1000
        },
        "reason": "গত সপ্তাহে মাত্র ৳২৫০০ বিক্রয়। মার্কেটিং বাড়ালে বিক্রয় বাড়বে।",
        "priority": "high",
        "urgency": "urgent",
        "createdAt": "2026-01-15T10:30:45.124Z",
        "completed": false
      }
    ],
    "toolsUsed": ["inventory_advice", "business_insights"],
    "reasoning": "Stock issues detected, sales are low",
    "context": {
      "totalProducts": 45,
      "totalOrders": 123,
      "totalRevenue": 82350,
      "lowStockCount": 5
    }
  }
}
```

---

## Frontend Integration

### React Component Example

```jsx
import React from 'react';

function ActionsList({ actions }) {
  const renderAction = (action) => {
    switch (action.type) {
      case 'increase_stock':
        return (
          <StockAction
            key={action.id}
            productName={action.target.productName}
            currentStock={action.target.currentStock}
            suggestedStock={action.target.suggestedStock}
            reason={action.reason}
            priority={action.priority}
            onAction={() => handleIncreaseStock(action)}
          />
        );
      
      case 'adjust_price':
        return (
          <PriceAction
            key={action.id}
            productName={action.target.productName}
            currentPrice={action.target.currentPrice}
            suggestedPrice={action.target.suggestedPrice}
            discount={action.target.discount}
            reason={action.reason}
            onAction={() => handleAdjustPrice(action)}
          />
        );
      
      case 'promote_product':
        return (
          <PromoteAction
            key={action.id}
            productName={action.target.productName}
            salesCount={action.target.salesCount}
            reason={action.reason}
            onAction={() => handlePromoteProduct(action)}
          />
        );
      
      case 'start_marketing':
        return (
          <MarketingAction
            key={action.id}
            channels={action.target.channels}
            budget={action.target.budget}
            reason={action.reason}
            onAction={() => handleStartMarketing(action)}
          />
        );
      
      default:
        return (
          <GenericAction
            key={action.id}
            type={action.type}
            reason={action.reason}
            priority={action.priority}
          />
        );
    }
  };

  return (
    <div className="actions-container">
      <h3>প্রস্তাবিত পদক্ষেপ</h3>
      {actions.map(renderAction)}
    </div>
  );
}

// Individual action components
function StockAction({ productName, currentStock, suggestedStock, reason, priority, onAction }) {
  return (
    <div className={`action-card priority-${priority}`}>
      <div className="action-header">
        <span className="action-icon">📦</span>
        <h4>স্টক বাড়ান</h4>
        <span className={`badge-${priority}`}>
          {priority === 'high' ? 'উচ্চ' : priority === 'medium' ? 'মাঝারি' : 'কম'}
        </span>
      </div>
      
      <div className="action-body">
        <p className="product-name">{productName}</p>
        <div className="stock-info">
          <span>বর্তমান: {currentStock}টি</span>
          <span className="arrow">→</span>
          <span>প্রস্তাবিত: {suggestedStock}টি</span>
        </div>
        <p className="reason">{reason}</p>
      </div>
      
      <div className="action-footer">
        <button onClick={onAction} className="btn-primary">
          স্টক বাড়ান
        </button>
      </div>
    </div>
  );
}
```

### Action Handlers

```javascript
const handleIncreaseStock = async (action) => {
  try {
    // Navigate to product edit page with suggested stock
    const productId = action.target.productId;
    const suggestedStock = action.target.suggestedStock;
    
    // Option 1: Direct API call
    await updateProductStock(productId, suggestedStock);
    toast.success('স্টক আপডেট হয়েছে!');
    
    // Option 2: Navigate to edit page
    navigate(`/products/${productId}/edit`, {
      state: { suggestedStock }
    });
    
    // Mark action as completed
    markActionCompleted(action.id);
  } catch (error) {
    toast.error('স্টক আপডেট করতে ব্যর্থ');
  }
};

const handleAdjustPrice = async (action) => {
  const { productId, suggestedPrice, discount } = action.target;
  
  // Show confirmation dialog
  const confirmed = await confirm(
    `${discount}% ছাড় দিয়ে দাম ৳${suggestedPrice} করবেন?`
  );
  
  if (confirmed) {
    await updateProductPrice(productId, suggestedPrice);
    markActionCompleted(action.id);
  }
};

const handlePromoteProduct = async (action) => {
  const { productId, productName } = action.target;
  
  // Navigate to marketing campaign creator
  navigate('/marketing/create', {
    state: {
      productId,
      productName,
      campaignType: 'promotion'
    }
  });
  
  markActionCompleted(action.id);
};

const handleStartMarketing = async (action) => {
  const { channels, budget } = action.target;
  
  // Open marketing wizard
  openMarketingWizard({
    channels,
    suggestedBudget: budget
  });
};
```

---

## Complete React Example

```jsx
import React, { useState, useEffect } from 'react';
import { aiService } from '../services';

function MunshiJiDashboard() {
  const [response, setResponse] = useState(null);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(false);

  const askMunshiJi = async (question) => {
    setLoading(true);
    try {
      const result = await aiService.munshiJi(question);
      
      if (result.success) {
        setResponse(result.data.response);
        setActions(result.data.actions);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-ask for business overview on mount
    askMunshiJi('ব্যবসা কেমন চলছে?');
  }, []);

  const groupActionsByType = (actions) => {
    return actions.reduce((acc, action) => {
      (acc[action.type] = acc[action.type] || []).push(action);
      return acc;
    }, {});
  };

  const urgentActions = actions.filter(a => a.urgency === 'urgent');
  const groupedActions = groupActionsByType(actions);

  return (
    <div className="munshiji-dashboard">
      <header>
        <h1>মুন্সিজি ড্যাশবোর্ড</h1>
        <p>আপনার AI ব্যবসায়িক উপদেষ্টা</p>
      </header>

      {loading && <Loading />}

      {response && (
        <div className="advice-section">
          <h2>পরামর্শ</h2>
          <div className="advice-text" style={{ whiteSpace: 'pre-wrap' }}>
            {response}
          </div>
        </div>
      )}

      {urgentActions.length > 0 && (
        <div className="urgent-section">
          <h2>🚨 জরুরী পদক্ষেপ ({urgentActions.length})</h2>
          <div className="actions-grid">
            {urgentActions.map(action => (
              <ActionCard key={action.id} action={action} />
            ))}
          </div>
        </div>
      )}

      <div className="actions-section">
        <h2>প্রস্তাবিত পদক্ষেপ ({actions.length})</h2>
        
        {Object.entries(groupedActions).map(([type, typeActions]) => (
          <div key={type} className="action-group">
            <h3>{getActionTypeLabel(type)} ({typeActions.length})</h3>
            <div className="actions-grid">
              {typeActions.map(action => (
                <ActionCard key={action.id} action={action} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getActionTypeLabel(type) {
  const labels = {
    increase_stock: '📦 স্টক ব্যবস্থাপনা',
    adjust_price: '💰 দাম সমন্বয়',
    promote_product: '📣 পণ্য প্রচার',
    start_marketing: '📢 মার্কেটিং',
    engage_customers: '👥 গ্রাহক যুক্ততা',
    improve_delivery: '🚚 ডেলিভারি',
    expand_inventory: '➕ ইনভেন্টরি সম্প্রসারণ'
  };
  return labels[type] || type;
}
```

---

## Summary

MunshiJi now provides **7 types of structured actions** that are:
- ✅ **UI-renderable** - Complete data for components
- ✅ **Actionable** - Specific targets and values
- ✅ **Contextual** - Based on real business data
- ✅ **Bangla reasons** - Clear explanations
- ✅ **Prioritized** - Sorted by importance
- ✅ **Trackable** - Can be marked as completed

Each action type has:
- Specific target entity (product, shop, customers, operations)
- Current vs suggested values
- Bangla explanation
- Priority and urgency levels
- Unique ID and timestamp
