# 🎯 Bazarify - Complete Setup Guide

## 📋 Project Overview

**Bazarify** is a complete, production-ready SME e-commerce and business management platform built specifically for Bangladeshi merchants. This is a full-stack application with zero dependency on prototype code.

### Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + React Router
- **Backend**: Node.js + Express + MongoDB + Mongoose
- **Authentication**: JWT with secure bcrypt password hashing
- **Charts**: Recharts for analytics visualization
- **Icons**: Lucide React

---

## 🚀 Getting Started

### Step 1: Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### Step 2: Configure Environment

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bazarify
JWT_SECRET=your_very_secure_secret_key_min_32_characters_long
JWT_EXPIRE=7d
NODE_ENV=development
```

#### Frontend (.env)
```bash
cd frontend
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start MongoDB

Ensure MongoDB is running on your system:

```bash
# macOS/Linux
mongod

# Windows
# Start MongoDB service from Services or:
net start MongoDB
```

Or use Docker:
```bash
docker run -d -p 27017:27017 --name bazarify-mongo mongo:6
```

### Step 4: Run the Application

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Server will start on http://localhost:5000

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Application will start on http://localhost:3000

---

## 🏗️ Project Structure

```
bazarify/
├── backend/
│   ├── src/
│   │   ├── config/           # Database & app configuration
│   │   ├── models/           # Mongoose schemas
│   │   ├── controllers/      # Business logic
│   │   ├── routes/           # API endpoints
│   │   ├── middleware/       # Auth, validation, errors
│   │   └── server.js         # Express app entry
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Route pages
│   │   ├── services/        # API services
│   │   ├── context/         # React context (Auth)
│   │   ├── utils/           # Helper functions
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # React entry point
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── docker-compose.yml
├── DEPLOYMENT.md
└── README.md
```

---

## 🎨 Features Implemented

### ✅ Authentication
- Merchant registration with shop creation
- Secure login with JWT
- Password hashing with bcrypt
- Protected routes
- Session management

### ✅ Dashboard
- Total sales, orders, products, customers
- Sales trend charts (week/month/year)
- Recent orders list
- Top selling products
- Low stock alerts
- Pending orders notifications

### ✅ Product Management
- Add/Edit/Delete products
- Product categories
- Stock management
- Product status (active/inactive)
- Search and filter products
- Product descriptions

### ✅ Order Management
- Create orders with multiple items
- View all orders
- Order details view
- Update order status (pending/processing/delivered/cancelled)
- Automatic stock adjustment
- Filter by status and date
- Order notes

### ✅ Customer Management
- Add/Edit/Delete customers
- Customer search
- View customer order history
- Customer statistics (total orders, total spent)
- Contact information management

### ✅ Reports & Analytics
- Sales analysis charts
- Product performance
- Top selling products
- Revenue breakdown
- Period-based filtering

### ✅ Settings
- Shop information update
- Profile management
- Password change
- Contact details

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register          # Register new merchant
POST   /api/auth/login             # Login
GET    /api/auth/me                # Get current user
PUT    /api/auth/update-password   # Update password
```

### Products
```
GET    /api/products               # Get all products
POST   /api/products               # Create product
GET    /api/products/:id           # Get single product
PUT    /api/products/:id           # Update product
DELETE /api/products/:id           # Delete product
GET    /api/products/categories/list # Get categories
```

### Orders
```
GET    /api/orders                 # Get all orders
POST   /api/orders                 # Create order
GET    /api/orders/:id             # Get single order
PUT    /api/orders/:id/status      # Update order status
DELETE /api/orders/:id             # Delete order
```

### Customers
```
GET    /api/customers              # Get all customers
POST   /api/customers              # Create customer
GET    /api/customers/:id          # Get customer with order history
PUT    /api/customers/:id          # Update customer
DELETE /api/customers/:id          # Delete customer
```

### Dashboard
```
GET    /api/dashboard/stats        # Get dashboard statistics
GET    /api/dashboard/recent-orders # Get recent orders
GET    /api/dashboard/sales-chart  # Get sales chart data
GET    /api/dashboard/top-products # Get top selling products
```

### Shop
```
GET    /api/shop                   # Get shop info
PUT    /api/shop                   # Update shop info
PUT    /api/shop/profile           # Update user profile
```

---

## 🧪 Testing the Application

### 1. Register a New Merchant
- Navigate to `/register`
- Fill in all required fields
- Create your shop

### 2. Add Products
- Go to Products page
- Click "নতুন পণ্য যোগ করুন"
- Add product details

### 3. Add Customers
- Go to Customers page
- Add customer information

### 4. Create Orders
- Go to Orders page
- Click "নতুন অর্ডার তৈরি করুন"
- Select customer and products
- Submit order

### 5. View Analytics
- Check Dashboard for overview
- Go to Reports for detailed analytics

---

## 🌐 All Text in Bangla

Every user-facing text is in Bangla:
- All UI labels
- Button text
- Error messages
- Success notifications
- Form validation messages
- Status indicators

---

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt (10 rounds)
- Protected API routes
- Input validation on all endpoints
- CORS configuration
- Environment variable protection
- SQL injection prevention (NoSQL)
- XSS protection

---

## 🎯 Business Logic

- One merchant = One shop
- Merchants can only access their own data
- Stock automatically adjusts on order creation
- Stock restoration on order cancellation
- Unique order numbers
- Customer validation before orders
- Product availability checking

---

## 📦 Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

---

## 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🚨 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# Or check Docker container
docker ps | grep mongo
```

### Port Already in Use
```bash
# Backend (port 5000)
# Kill process using the port
lsof -ti:5000 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

### CORS Error
- Ensure VITE_API_URL in frontend .env matches backend URL
- Check backend CORS configuration

---

## 📱 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🎓 Learning Resources

This project demonstrates:
- Full-stack JavaScript development
- REST API design
- React hooks and context
- MongoDB schema design
- JWT authentication
- Responsive design with Tailwind
- Form validation
- State management
- Error handling
- Production deployment

---

## 📄 License

MIT License - Free for commercial and personal use

---

## 👨‍💻 Development Notes

### Code Quality
- ✅ No hardcoded data
- ✅ All logic is database-driven
- ✅ Clean component structure
- ✅ Reusable utility functions
- ✅ Consistent naming conventions
- ✅ Proper error handling
- ✅ Loading states everywhere
- ✅ Responsive design

### Future Enhancements
- Image upload for products
- Invoice generation
- SMS notifications
- Email integration
- Multi-currency support
- Advanced reporting
- Export to Excel/PDF
- Mobile app

---

**বাজারিফাই** - আপনার ব্যবসা, আপনার নিয়ন্ত্রণে 🇧🇩

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)
