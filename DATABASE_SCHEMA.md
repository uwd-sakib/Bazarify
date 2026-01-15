# 📊 MongoDB Schema Design - Bazarify

## Collection Overview

| Collection | Purpose | Records | Indexes |
|------------|---------|---------|---------|
| **users** | Authentication & merchant accounts | 1 per merchant | email |
| **shops** | Store/business information | 1 per merchant | ownerId |
| **products** | Product catalog | Many per shop | shopId, category |
| **orders** | Sales transactions | Many per shop | shopId, orderNumber, status |
| **customers** | Customer database | Many per shop | shopId, phone |

---

## 1. Users Collection

**Purpose:** Handles authentication and merchant account management

```javascript
{
  _id: ObjectId,
  name: String,              // Merchant name
  email: String,             // Login credential (unique)
  password: String,          // Bcrypt hashed password
  role: String,              // "merchant" or "admin"
  shopId: ObjectId,          // Reference to Shop collection
  isActive: Boolean,         // Account status
  createdAt: Date,
  updatedAt: Date
}
```

### Field Explanations

| Field | Why It Exists | Validation | Notes |
|-------|---------------|------------|-------|
| `name` | Identify merchant in system | Required, trimmed | Bangla: "নাম প্রয়োজন" |
| `email` | Unique login identifier | Required, unique, email format | Lowercased, indexed |
| `password` | Authentication | Min 6 chars, hashed | Select: false (security) |
| `role` | Access control | Enum: merchant/admin | Default: "merchant" |
| `shopId` | Link to merchant's shop | ObjectId reference | Set during registration |
| `isActive` | Account suspension | Boolean | Default: true |

### Indexes
```javascript
{ email: 1 } // Unique index for login
```

### Relations
- **One-to-One** with Shop: `shopId → shops._id`

### Security Features
- Password hashing (bcrypt, 10 salt rounds)
- Password field excluded from queries (select: false)
- Email validation regex
- Pre-save middleware for hashing

---

## 2. Shops Collection

**Purpose:** Store business/shop information for each merchant

```javascript
{
  _id: ObjectId,
  shopName: String,          // Business name
  ownerId: ObjectId,         // Reference to User
  phone: String,             // Contact number
  address: String,           // Physical location
  description: String,       // About the business
  isActive: Boolean,         // Shop status
  createdAt: Date,
  updatedAt: Date
}
```

### Field Explanations

| Field | Why It Exists | Validation | Notes |
|-------|---------------|------------|-------|
| `shopName` | Business identity | Required, trimmed | Bangla: "দোকানের নাম প্রয়োজন" |
| `ownerId` | Link to merchant account | Required ObjectId | Creates bidirectional relationship |
| `phone` | Customer contact | Optional | For invoices, customer service |
| `address` | Physical location | Optional | Delivery, billing info |
| `description` | Business details | Optional | Marketing, about section |
| `isActive` | Shop operational status | Boolean | Default: true |

### Indexes
```javascript
{ ownerId: 1 } // Fast lookup by owner
```

### Relations
- **One-to-One** with User: `ownerId → users._id`
- **One-to-Many** with Products: `_id ← products.shopId`
- **One-to-Many** with Orders: `_id ← orders.shopId`
- **One-to-Many** with Customers: `_id ← customers.shopId`

### Why Separate from Users?
- **Scalability:** Future multi-shop per user support
- **Separation of Concerns:** Auth data vs business data
- **Flexibility:** Shop can have additional owners/staff

---

## 3. Products Collection

**Purpose:** Product catalog and inventory management

```javascript
{
  _id: ObjectId,
  name: String,              // Product name
  price: Number,             // Selling price
  stock: Number,             // Available quantity
  category: String,          // Product category
  description: String,       // Product details
  status: String,            // "active" or "inactive"
  shopId: ObjectId,          // Reference to Shop
  createdAt: Date,
  updatedAt: Date
}
```

### Field Explanations

| Field | Why It Exists | Validation | Notes |
|-------|---------------|------------|-------|
| `name` | Product identification | Required, trimmed | Bangla: "পণ্যের নাম প্রয়োজন" |
| `price` | Selling price | Required, min: 0 | Stored in base currency |
| `stock` | Inventory tracking | Required, min: 0 | Updated on orders |
| `category` | Product grouping | Required | Dynamic categories |
| `description` | Product details | Optional | Marketing copy |
| `status` | Availability | Enum: active/inactive | Toggle without deletion |
| `shopId` | Multi-tenancy | Required ObjectId | Shop-level isolation |

### Indexes
```javascript
{ shopId: 1, status: 1 }      // Fast filtering by status
{ shopId: 1, category: 1 }     // Category-based queries
```

### Relations
- **Many-to-One** with Shop: `shopId → shops._id`
- **Referenced-In** Orders: `_id ← orders.items.productId`

### Why These Indexes?
- **shopId + status:** Quickly fetch active products for a shop
- **shopId + category:** Category-wise product listing
- All queries are shop-scoped for multi-tenancy

---

## 4. Orders Collection

**Purpose:** Transaction records and sales tracking

```javascript
{
  _id: ObjectId,
  orderNumber: String,       // Unique identifier (ORD-1234567890-1)
  customerId: ObjectId,      // Reference to Customer
  customerName: String,      // Denormalized for quick access
  customerPhone: String,     // Denormalized for quick access
  items: [                   // Embedded order items
    {
      productId: ObjectId,   // Reference to Product
      productName: String,   // Snapshot at order time
      quantity: Number,      // Quantity ordered
      price: Number,         // Price at order time
      subtotal: Number       // quantity * price
    }
  ],
  totalAmount: Number,       // Sum of all subtotals
  status: String,            // Order lifecycle status
  paymentStatus: String,     // Payment tracking
  notes: String,             // Special instructions
  shopId: ObjectId,          // Reference to Shop
  createdAt: Date,
  updatedAt: Date
}
```

### Field Explanations

| Field | Why It Exists | Validation | Notes |
|-------|---------------|------------|-------|
| `orderNumber` | Human-readable ID | Required, unique | Format: ORD-{timestamp}-{count} |
| `customerId` | Link to customer | Required ObjectId | For customer history |
| `customerName` | Quick display | Required | Denormalized for performance |
| `customerPhone` | Contact info | Required | Invoice/delivery contact |
| `items` | Order details | Array, min 1 item | Embedded for atomicity |
| `items.productId` | Product reference | ObjectId | For reporting |
| `items.productName` | Price history | String | Snapshot prevents data loss |
| `items.price` | Historical pricing | Number | Price at purchase time |
| `totalAmount` | Order value | Required, min: 0 | Calculated field |
| `status` | Order tracking | Enum: 4 states | Workflow management |
| `paymentStatus` | Payment tracking | Enum: paid/unpaid | Financial tracking |
| `shopId` | Multi-tenancy | Required ObjectId | Shop-level isolation |

### Indexes
```javascript
{ shopId: 1, status: 1 }       // Status-based filtering
{ shopId: 1, createdAt: -1 }   // Recent orders first
{ orderNumber: 1 }             // Unique, fast lookup
```

### Relations
- **Many-to-One** with Shop: `shopId → shops._id`
- **Many-to-One** with Customer: `customerId → customers._id`
- **Embedded** Items: Contains product snapshots

### Why Embedded Items?
- **Atomicity:** Order data doesn't change if product changes
- **Performance:** Single query gets full order
- **Historical Accuracy:** Preserves prices at purchase time
- **Data Integrity:** Order remains valid even if product deleted

### Status Workflow
```
pending → processing → delivered
   ↓
cancelled (any time)
```

---

## 5. Customers Collection

**Purpose:** Customer database and contact management

```javascript
{
  _id: ObjectId,
  name: String,              // Customer name
  phone: String,             // Primary contact
  email: String,             // Optional email
  address: String,           // Delivery address
  shopId: ObjectId,          // Reference to Shop
  createdAt: Date,
  updatedAt: Date
}
```

### Field Explanations

| Field | Why It Exists | Validation | Notes |
|-------|---------------|------------|-------|
| `name` | Customer identity | Required, trimmed | Bangla: "নাম প্রয়োজন" |
| `phone` | Primary contact | Required | Unique per shop |
| `email` | Alternative contact | Optional | Lowercased |
| `address` | Delivery location | Optional | Order fulfillment |
| `shopId` | Multi-tenancy | Required ObjectId | Shop-level isolation |

### Indexes
```javascript
{ shopId: 1 }              // All customers for a shop
{ shopId: 1, phone: 1 }     // Duplicate phone check per shop
```

### Relations
- **Many-to-One** with Shop: `shopId → shops._id`
- **One-to-Many** with Orders: `_id ← orders.customerId`

### Why Phone is Key?
- Primary communication in Bangladesh
- More reliable than email
- Used for order confirmations

---

## 6. Transactions (Handled via Orders)

**Note:** The system doesn't have a separate Transactions collection. Financial transactions are tracked through:

1. **Orders Collection:**
   - `totalAmount` field tracks transaction value
   - `paymentStatus` tracks payment state
   - `createdAt` provides transaction timestamp

2. **If you need a separate Transactions collection:**

```javascript
// Optional future enhancement
{
  _id: ObjectId,
  transactionId: String,     // TXN-{timestamp}
  orderId: ObjectId,         // Reference to Order
  amount: Number,
  type: String,              // "sale", "refund", "expense"
  method: String,            // "cash", "bank", "mobile"
  status: String,            // "pending", "completed"
  shopId: ObjectId,
  createdAt: Date
}
```

---

## Schema Relationships Diagram

```
┌─────────────┐
│    User     │
│  (Merchant) │
└──────┬──────┘
       │ 1:1
       ▼
┌─────────────┐
│    Shop     │◄─────────────────┐
└──────┬──────┘                  │
       │                         │
       │ 1:M                     │ shopId
       ▼                         │
┌─────────────┐                  │
│   Product   │                  │
└──────┬──────┘                  │
       │                         │
       │                         │
┌──────┴──────┐                  │
│             │                  │
│   Order     │──────────────────┘
│             │
│   items: [  │
│    productId│◄─────┐
│    details  │      │ Reference
│   ]         │      │
└──────┬──────┘      │
       │             │
       │ M:1         │
       ▼             │
┌─────────────┐      │
│  Customer   │      │
└─────────────┘      │
                     │
                 ┌───┴────┐
                 │Product │
                 └────────┘
```

---

## Indexing Strategy

### Why We Index

**Performance Benefits:**
- Faster queries (O(log n) vs O(n))
- Efficient sorting
- Quick lookups
- Better aggregation performance

### Index Analysis

| Collection | Index | Cardinality | Query Pattern |
|------------|-------|-------------|---------------|
| User | `{email: 1}` | Unique | Login queries |
| Shop | `{ownerId: 1}` | 1:1 | User → Shop lookup |
| Product | `{shopId: 1, status: 1}` | High | Filter active products |
| Product | `{shopId: 1, category: 1}` | Medium | Category filtering |
| Order | `{shopId: 1, status: 1}` | High | Order status queries |
| Order | `{shopId: 1, createdAt: -1}` | High | Recent orders |
| Order | `{orderNumber: 1}` | Unique | Order lookup |
| Customer | `{shopId: 1}` | High | All customers |
| Customer | `{shopId: 1, phone: 1}` | Medium | Duplicate check |

### Compound Index Strategy

**Why `{shopId: 1, ...}`?**
- Multi-tenancy: Every query scoped by shop
- Most selective field first
- Supports shop-only queries too

**Why `{shopId: 1, createdAt: -1}`?**
- Descending createdAt for "latest first"
- Supports date range queries efficiently

---

## Multi-Tenancy Design

**Shop Isolation:**
Every data-owning collection includes `shopId`:
- Products
- Orders
- Customers

**Benefits:**
- ✅ Data isolation (Shop A can't see Shop B's data)
- ✅ Scalable (single database, many merchants)
- ✅ Simplified queries (always filter by shopId)
- ✅ Efficient indexes (shopId is most selective)

**Query Pattern:**
```javascript
// Always scope by shop
Product.find({ shopId: req.user.shopId, status: 'active' })
Order.find({ shopId: req.user.shopId, status: 'pending' })
```

---

## Data Denormalization Strategy

### Where We Denormalize

**Order Collection:**
- `customerName` and `customerPhone` (from Customer)
- `productName` and `price` (from Product in items)

### Why Denormalize?

**Performance:**
- Single query gets full order details
- No joins needed for display

**Data Integrity:**
- Historical accuracy preserved
- Order details don't change if customer/product updated
- Invoice remains valid forever

**Trade-offs:**
- ✅ Faster reads (most common operation)
- ✅ Data consistency (historical records)
- ⚠️ Slightly larger documents
- ⚠️ Update complexity (if customer changes name, old orders keep old name - this is desired!)

---

## Scalability Considerations

### Current Design Scales To:

- **1,000+ shops** per database
- **100,000+ products** (indexed queries remain fast)
- **1,000,000+ orders** (date-based partitioning possible)
- **100,000+ customers** per shop

### Future Enhancements:

**1. Sharding Strategy:**
```javascript
// Shard key on shopId for horizontal scaling
sh.shardCollection("bazarify.products", { shopId: 1 })
sh.shardCollection("bazarify.orders", { shopId: 1 })
```

**2. Additional Indexes:**
```javascript
// For advanced search
productSchema.index({ name: 'text', description: 'text' })

// For analytics
orderSchema.index({ shopId: 1, createdAt: 1, status: 1 })
```

**3. Archive Strategy:**
```javascript
// Move old orders to archive collection
orders → orders_archive (yearly)
```

---

## Validation Summary

### Schema-Level Validation

**All Collections:**
- ✅ Required fields enforced
- ✅ Data types validated
- ✅ Enum constraints
- ✅ Min/max values
- ✅ String trimming
- ✅ Email format validation

**Bangla Error Messages:**
All validation errors return Bangla messages for UX.

### Application-Level Validation

**Additional Checks:**
- Email uniqueness (users)
- Phone uniqueness per shop (customers)
- Stock availability (orders)
- Price validation (non-negative)
- Order total calculation

---

## Best Practices Implemented

✅ **Naming Conventions:**
- Consistent camelCase
- Descriptive field names
- Clear collection names (plural)

✅ **Timestamps:**
- Auto-generated `createdAt`, `updatedAt`
- Enables auditing and sorting

✅ **References:**
- ObjectId for relations
- Proper `ref` declarations
- Denormalization where needed

✅ **Indexing:**
- Compound indexes for common queries
- Unique indexes for constraints
- Selective indexes (not over-indexing)

✅ **Security:**
- Password field excluded by default
- No sensitive data in embedded docs
- Shop-level data isolation

✅ **Performance:**
- Embedded documents where appropriate
- Indexed foreign keys
- Denormalized frequent-access data

---

## Query Examples

### 1. Get Shop's Active Products by Category
```javascript
Product.find({
  shopId: mongoose.Types.ObjectId(shopId),
  status: 'active',
  category: 'Electronics'
})
```
**Uses Index:** `{shopId: 1, category: 1}`

### 2. Get Recent Orders
```javascript
Order.find({ shopId })
  .sort({ createdAt: -1 })
  .limit(10)
```
**Uses Index:** `{shopId: 1, createdAt: -1}`

### 3. Find Customer by Phone
```javascript
Customer.findOne({ shopId, phone: '01712345678' })
```
**Uses Index:** `{shopId: 1, phone: 1}`

### 4. Get Order with Full Details
```javascript
Order.findById(orderId)
  .populate('customerId', 'name phone address')
```
**No extra query needed for items** (embedded)

---

## Migration Notes

### From Prototype to Production:

**Changes Made:**
- Added `shopId` to all collections
- Implemented compound indexes
- Added Bangla validation messages
- Embedded order items for atomicity
- Denormalized customer info in orders

**Data Migration Steps:**
```javascript
// 1. Add shopId to existing products
db.products.updateMany({}, { $set: { shopId: ObjectId(...) } })

// 2. Create indexes
db.products.createIndex({ shopId: 1, status: 1 })

// 3. Migrate orders to new schema
// (convert separate line items to embedded items)
```

---

## Summary

### Design Principles

✅ **Normalized** where frequent updates occur (Users, Shops, Products, Customers)
✅ **Denormalized** for read performance (Order items, customer snapshots)
✅ **Indexed** based on query patterns (shopId first, then specific filters)
✅ **Multi-tenant** via shopId scoping
✅ **Scalable** with proper indexes and document design
✅ **Secure** with validation and data isolation
✅ **Bangla-first** with localized messages

### Collection Relationships Summary

```
User (1) ─── (1) Shop
                 │
                 ├─── (M) Product
                 ├─── (M) Order
                 └─── (M) Customer
                          │
                          └─── (M) Order
```

**Transactions are tracked through Orders collection** with `totalAmount` and `paymentStatus` fields.
