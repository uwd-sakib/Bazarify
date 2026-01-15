# MunshiJi Actions - Quick Reference

## 📋 Action Types

| Type | Icon | Entity | When Generated | Priority |
|------|------|--------|----------------|----------|
| `increase_stock` | 📦 | product | Stock = 0 or < 10 | High/Medium |
| `adjust_price` | 💰 | product | High stock + no sales | Medium |
| `promote_product` | 📣 | product | Top 3 best sellers | High |
| `start_marketing` | 📢 | shop | Weekly revenue < ৳5000 | High |
| `engage_customers` | 👥 | customers | Low repeat orders | Medium |
| `improve_delivery` | 🚚 | operations | Delivery rate < 70% | High |
| `expand_inventory` | ➕ | shop | Revenue > ৳50k & products < 30 | Low |

---

## 🎯 Action Structure

```javascript
{
  id: "action_1737804645123_0",
  type: "increase_stock",
  target: {
    entity: "product",
    // Type-specific fields
  },
  reason: "Bangla explanation",
  priority: "high|medium|low",
  urgency: "urgent|soon|normal",
  createdAt: "ISO timestamp",
  completed: false
}
```

---

## 📦 increase_stock

```javascript
{
  type: "increase_stock",
  target: {
    entity: "product",
    productId: "507f...",
    productName: "Nike Shoes",
    currentStock: 5,
    suggestedStock: 20
  },
  reason: "Nike Shoes এর স্টক কম (৫টি)। শীঘ্রই শেষ হয়ে যাবে।"
}
```

**UI:**
```jsx
<Card>
  <Badge>উচ্চ</Badge>
  <Title>স্টক বাড়ান: {productName}</Title>
  <Stock>{currentStock} → {suggestedStock}</Stock>
  <Button onClick={() => updateStock(productId, suggestedStock)}>
    আপডেট করুন
  </Button>
</Card>
```

---

## 💰 adjust_price

```javascript
{
  type: "adjust_price",
  target: {
    entity: "product",
    productId: "507f...",
    productName: "Laptop",
    currentPrice: 45000,
    suggestedPrice: 40500,
    discount: 10
  },
  reason: "অনেক স্টক আছে কিন্তু বিক্রয় হচ্ছে না। ১০% ছাড় দিন।"
}
```

**UI:**
```jsx
<Card>
  <Title>দাম কমান: {productName}</Title>
  <Price>
    ৳{currentPrice} → ৳{suggestedPrice}
    <DiscountBadge>{discount}% ছাড়</DiscountBadge>
  </Price>
  <Button onClick={() => updatePrice(productId, suggestedPrice)}>
    প্রয়োগ করুন
  </Button>
</Card>
```

---

## 📣 promote_product

```javascript
{
  type: "promote_product",
  target: {
    entity: "product",
    productId: "507f...",
    productName: "Samsung Phone",
    salesCount: 25
  },
  reason: "সবচেয়ে বেশি বিক্রি হয়েছে (২৫ বার)। আরো প্রচার করুন।"
}
```

**UI:**
```jsx
<Card>
  <Title>প্রচার করুন: {productName}</Title>
  <Stats>মোট বিক্রয়: {salesCount} বার</Stats>
  <Button onClick={() => createCampaign(productId)}>
    ক্যাম্পেইন তৈরি করুন
  </Button>
</Card>
```

---

## 📢 start_marketing

```javascript
{
  type: "start_marketing",
  target: {
    entity: "shop",
    channels: ["facebook", "instagram", "whatsapp"],
    budget: 1000
  },
  reason: "গত সপ্তাহে মাত্র ৳২৫০০ বিক্রয়। মার্কেটিং বাড়ান।"
}
```

**UI:**
```jsx
<Card>
  <Title>মার্কেটিং শুরু করুন</Title>
  <Channels>
    {channels.map(ch => <Badge>{ch}</Badge>)}
  </Channels>
  <Budget>বাজেট: ৳{budget}</Budget>
  <Button onClick={() => openMarketingWizard(channels, budget)}>
    শুরু করুন
  </Button>
</Card>
```

---

## 👥 engage_customers

```javascript
{
  type: "engage_customers",
  target: {
    entity: "customers",
    count: 87,
    offerType: "loyalty_discount"
  },
  reason: "৮৭ জন গ্রাহক আছেন কিন্তু রিপিট অর্ডার কম।"
}
```

**UI:**
```jsx
<Card>
  <Title>গ্রাহক যুক্ততা</Title>
  <CustomerCount>{count} জন গ্রাহক</CustomerCount>
  <OfferType>{offerType}</OfferType>
  <Button onClick={() => sendOffer(offerType)}>
    অফার পাঠান
  </Button>
</Card>
```

---

## 🚚 improve_delivery

```javascript
{
  type: "improve_delivery",
  target: {
    entity: "operations",
    pendingOrders: 15,
    currentRate: 65,
    targetRate: 90
  },
  reason: "ডেলিভারি হার মাত্র ৬৫%। ১৫টি অর্ডার অপেক্ষমাণ।"
}
```

**UI:**
```jsx
<Card>
  <Title>ডেলিভারি উন্নত করুন</Title>
  <Rate>{currentRate}% → {targetRate}%</Rate>
  <Pending>{pendingOrders}টি অপেক্ষমাণ</Pending>
  <Button onClick={() => viewPendingOrders()}>
    অর্ডার দেখুন
  </Button>
</Card>
```

---

## ➕ expand_inventory

```javascript
{
  type: "expand_inventory",
  target: {
    entity: "shop",
    currentProducts: 25,
    suggestedProducts: 50,
    categories: ["Electronics", "Clothing"]
  },
  reason: "ব্যবসা ভালো চলছে। নতুন পণ্য যোগ করুন।"
}
```

**UI:**
```jsx
<Card>
  <Title>ইনভেন্টরি সম্প্রসারণ</Title>
  <ProductCount>{currentProducts} → {suggestedProducts}</ProductCount>
  <Categories>
    {categories.map(cat => <Badge>{cat}</Badge>)}
  </Categories>
  <Button onClick={() => navigate('/products/add')}>
    পণ্য যোগ করুন
  </Button>
</Card>
```

---

## 🎨 Priority & Urgency

### Priority Levels
- 🔴 **high** - জরুরী, এখনই করুন
- 🟡 **medium** - গুরুত্বপূর্ণ, শীঘ্রই করুন
- 🟢 **low** - সুবিধাজনক সময়ে করুন

### Urgency Levels
- ⚡ **urgent** - আজই
- ⏰ **soon** - ১-২ দিনের মধ্যে
- 📅 **normal** - সুবিধামত

### Color Coding
```jsx
const getPriorityColor = (priority) => ({
  high: 'red',
  medium: 'yellow',
  low: 'green'
})[priority];

const getUrgencyIcon = (urgency) => ({
  urgent: '⚡',
  soon: '⏰',
  normal: '📅'
})[urgency];
```

---

## 📊 Response Example

```json
{
  "success": true,
  "data": {
    "response": "**পরিস্থিতি:** ...",
    "actions": [
      {
        "id": "action_1737804645123_0",
        "type": "increase_stock",
        "target": {
          "entity": "product",
          "productId": "507f...",
          "productName": "Nike Shoes",
          "currentStock": 0,
          "suggestedStock": 20
        },
        "reason": "Nike Shoes সম্পূর্ণ শেষ।",
        "priority": "high",
        "urgency": "urgent",
        "createdAt": "2026-01-15T10:30:45.123Z",
        "completed": false
      }
    ]
  }
}
```

---

## 🔧 Action Handlers

```javascript
const actionHandlers = {
  increase_stock: (action) => {
    navigate(`/products/${action.target.productId}/edit`, {
      state: { stock: action.target.suggestedStock }
    });
  },
  
  adjust_price: (action) => {
    updatePrice(action.target.productId, action.target.suggestedPrice);
  },
  
  promote_product: (action) => {
    createCampaign({
      productId: action.target.productId,
      type: 'promotion'
    });
  },
  
  start_marketing: (action) => {
    openMarketingWizard({
      channels: action.target.channels,
      budget: action.target.budget
    });
  },
  
  engage_customers: (action) => {
    sendBulkOffer(action.target.offerType);
  },
  
  improve_delivery: (action) => {
    navigate('/orders?status=pending');
  },
  
  expand_inventory: (action) => {
    navigate('/products/add');
  }
};

const handleAction = (action) => {
  const handler = actionHandlers[action.type];
  if (handler) {
    handler(action);
    markCompleted(action.id);
  }
};
```

---

## ✅ Completion Tracking

```javascript
const [completedActions, setCompletedActions] = useState([]);

const markCompleted = (actionId) => {
  setCompletedActions(prev => [...prev, actionId]);
  
  // Optional: Save to backend
  saveCompletedAction(actionId);
};

const isCompleted = (actionId) => {
  return completedActions.includes(actionId);
};

// In render
{actions.map(action => (
  <ActionCard
    key={action.id}
    action={action}
    completed={isCompleted(action.id)}
    onComplete={() => markCompleted(action.id)}
  />
))}
```

---

## 📱 Responsive Grid

```css
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

@media (max-width: 768px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 🎯 Quick Implementation

```jsx
import React from 'react';

function ActionsPanel({ actions }) {
  return (
    <div className="actions-panel">
      <h2>প্রস্তাবিত পদক্ষেপ ({actions.length})</h2>
      
      <div className="actions-grid">
        {actions.map(action => (
          <ActionCard
            key={action.id}
            {...action}
            onExecute={() => handleAction(action)}
          />
        ))}
      </div>
    </div>
  );
}

function ActionCard({ type, target, reason, priority, urgency, onExecute }) {
  const config = ACTION_CONFIGS[type];
  
  return (
    <div className={`action-card priority-${priority}`}>
      <div className="header">
        <span className="icon">{config.icon}</span>
        <h3>{config.title}</h3>
        <span className={`badge-${priority}`}>
          {priority === 'high' ? 'উচ্চ' : 
           priority === 'medium' ? 'মাঝারি' : 'কম'}
        </span>
      </div>
      
      <div className="body">
        {config.renderTarget(target)}
        <p className="reason">{reason}</p>
      </div>
      
      <button onClick={onExecute} className="btn-primary">
        {config.buttonText}
      </button>
    </div>
  );
}

const ACTION_CONFIGS = {
  increase_stock: {
    icon: '📦',
    title: 'স্টক বাড়ান',
    buttonText: 'আপডেট করুন',
    renderTarget: (t) => (
      <div>
        <p>{t.productName}</p>
        <p>{t.currentStock} → {t.suggestedStock}টি</p>
      </div>
    )
  },
  // ... other configs
};
```

---

## 📚 See Also

- [MUNSHIJI_ACTIONS_DOCS.md](MUNSHIJI_ACTIONS_DOCS.md) - Complete documentation
- [MUNSHIJI_UPGRADE.md](MUNSHIJI_UPGRADE.md) - Overall architecture
- [API_V1_MUNSHIJI.md](API_V1_MUNSHIJI.md) - V1 API reference
