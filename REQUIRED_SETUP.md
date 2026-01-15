# 🚀 BAZARIFY - What You Need to Run the Project

## ✅ Current Status

**GOOD NEWS:** Both Frontend and Backend are configured and running!

- ✅ Backend Server: Running on http://localhost:5000
- ✅ Frontend Server: Running on http://localhost:3000
- ⚠️ MongoDB: **NOT CONNECTED** (This is what you need to provide)

---

## 📋 What You MUST Provide

### 1. MongoDB Database (REQUIRED)

**You have 2 options:**

#### Option A: Install MongoDB Locally (Recommended for Development)

1. **Download MongoDB Community Edition:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows
   - Version: 7.0 or higher
   - Download and install

2. **Start MongoDB Service:**
   ```powershell
   # After installation, MongoDB should start automatically
   # To verify:
   Get-Service MongoDB
   
   # If not running:
   Start-Service MongoDB
   ```

3. **Verify MongoDB is Running:**
   ```powershell
   # Check if MongoDB is listening on port 27017
   Test-NetConnection -ComputerName localhost -Port 27017
   ```

4. **Your .env is already configured for local MongoDB:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/bazarify
   ```

#### Option B: Use MongoDB Atlas (Cloud - Free Tier Available)

1. **Create Free Account:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create a Cluster:**
   - Choose FREE tier (M0 Sandbox)
   - Select region closest to you
   - Create cluster

3. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bazarify`

4. **Update backend/.env:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bazarify?retryWrites=true&w=majority
   ```

5. **Whitelist Your IP:**
   - In Atlas, go to Network Access
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)

---

## 🔧 What's Already Configured (You Don't Need to Provide)

✅ **Node.js & npm** - Installed (v20.15.0)
✅ **Backend Dependencies** - Installed (Express, Mongoose, JWT, etc.)
✅ **Frontend Dependencies** - Installed (React, Vite, Tailwind, etc.)
✅ **.env Files** - Created in both frontend and backend
✅ **JWT Secret** - Already set (you can change it later)
✅ **Port Configuration** - Backend: 5000, Frontend: 3000
✅ **API URL** - Frontend configured to talk to backend

---

## 🎯 How to Run After MongoDB is Ready

### Step 1: Start Backend
```powershell
cd "e:\programming\Projects\hackathon\Bazarify\final Bazarify\backend"
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000 in development mode
MongoDB Connected: localhost  ← This confirms DB connection
```

### Step 2: Start Frontend (in new terminal)
```powershell
cd "e:\programming\Projects\hackathon\Bazarify\final Bazarify\frontend"
npm run dev
```

**Expected Output:**
```
VITE v5.4.21  ready in 10263 ms
➜  Local:   http://localhost:3000/
```

### Step 3: Access Application
- Open browser: **http://localhost:3000**
- You should see the login page
- Click "নতুন একাউন্ট তৈরি করুন" to register

---

## 📝 Environment Variables Breakdown

### Backend (.env)
```env
PORT=5000                                          # Backend server port
MONGODB_URI=mongodb://localhost:27017/bazarify    # ← YOU NEED TO PROVIDE THIS
JWT_SECRET=your_super_secret_jwt_key_change_in_production  # For token signing
JWT_EXPIRE=7d                                      # Token expiry (7 days)
NODE_ENV=development                               # Environment
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api            # Backend API URL
```

---

## 🐛 Current Issues & Fixes

### Issue 1: MongoDB Connection Error ⚠️
**Error:** `Error: connect ECONNREFUSED ::1:27017`

**Meaning:** Backend can't find MongoDB on localhost:27017

**Fix:** Install MongoDB (see Option A or B above)

### Issue 2: Mongoose Schema Warning (Minor)
**Warning:** `Duplicate schema index on {"orderNumber":1}`

**Impact:** None - just a warning, doesn't affect functionality

**Fix (Optional):** Remove duplicate index from Order model
```javascript
// In backend/src/models/Order.js
// Remove this line if it exists:
orderNumber: { type: String, unique: true, index: true }
// Keep only:
orderNumber: { type: String, unique: true }
```

---

## ✅ Quick Start Checklist

- [x] Node.js installed (v20.15.0)
- [x] Backend dependencies installed
- [x] Frontend dependencies installed
- [x] .env files created
- [ ] **MongoDB installed and running** ← YOU NEED THIS
- [ ] Backend server started
- [ ] Frontend server started
- [ ] Browser opened to http://localhost:3000

---

## 🎮 First Run Instructions

Once MongoDB is running:

1. **Start Backend:**
   ```powershell
   cd backend
   npm run dev
   ```
   Wait for: `MongoDB Connected: localhost`

2. **Start Frontend (new terminal):**
   ```powershell
   cd frontend
   npm run dev
   ```
   Wait for: `Local: http://localhost:3000/`

3. **Open Browser:**
   - Navigate to: http://localhost:3000
   - You'll see the login page in Bangla

4. **Create First Account:**
   - Click "নতুন একাউন্ট তৈরি করুন" (Create new account)
   - Fill in:
     - নাম (Name): Your name
     - ইমেইল (Email): your@email.com
     - পাসওয়ার্ড (Password): test123 (min 6 chars)
     - দোকানের নাম (Shop name): Your shop name
     - ফোন (Phone): 01712345678
     - ঠিকানা (Address): Your address
   - Click "নিবন্ধন করুন" (Register)

5. **You'll be redirected to Dashboard!**
   - Start adding products, customers, and orders
   - Everything is in Bangla

---

## 🔍 How to Verify Everything is Working

### Test 1: Backend Health Check
```powershell
curl http://localhost:5000/health
```
**Expected Response:**
```json
{
  "success": true,
  "message": "Bazarify API is running",
  "timestamp": "2026-01-13T..."
}
```

### Test 2: Frontend Loading
- Open http://localhost:3000
- Should see login page with Bangla text
- Should see "বাজারিফাই" logo

### Test 3: Registration
- Register a new merchant
- Should redirect to dashboard
- Should see stats cards (all showing 0 initially)

### Test 4: Add Product
- Click "পণ্য" (Products) in sidebar
- Click "নতুন পণ্য যোগ করুন" (Add new product)
- Fill form and submit
- Should see success message in Bangla

---

## 🚨 Troubleshooting

### "Cannot connect to MongoDB"
**Solution:** 
- Install MongoDB (see Option A above)
- Or use MongoDB Atlas (see Option B above)
- Verify MongoDB is running: `Get-Service MongoDB`

### "Port 5000 already in use"
**Solution:**
```powershell
# Find process using port 5000
Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess
# Kill the process
Stop-Process -Id <process_id>
```

### "Port 3000 already in use"
**Solution:** Kill the process or change port in vite.config.js

### "CORS Error in Browser"
**Solution:** Backend CORS is already configured. Make sure backend is running first.

### "Cannot read property of undefined"
**Solution:** Make sure you're logged in. Token might have expired (7 days).

---

## 📊 What Happens After First Run

1. **MongoDB Database Created:**
   - Database name: `bazarify`
   - Collections created automatically:
     - users
     - shops
     - products
     - orders
     - customers

2. **Your First User Created:**
   - User account with merchant role
   - Shop document linked to user
   - JWT token generated and stored in browser

3. **Ready to Use:**
   - Add products
   - Add customers
   - Create orders
   - View dashboard analytics
   - Generate reports

---

## 🎓 MongoDB Installation Guide (Detailed)

### For Windows:

1. **Download:**
   - https://www.mongodb.com/try/download/community
   - Choose: Windows x64
   - Version: 7.0.5 (or latest)

2. **Install:**
   - Run the .msi installer
   - Choose "Complete" installation
   - Install MongoDB as a Service (recommended)
   - Install MongoDB Compass (GUI tool - optional but helpful)

3. **Verify Installation:**
   ```powershell
   # Check service status
   Get-Service MongoDB
   
   # Should show:
   # Status   Name               DisplayName
   # ------   ----               -----------
   # Running  MongoDB            MongoDB Server
   ```

4. **Test Connection:**
   ```powershell
   # Using MongoDB Shell (if installed)
   mongosh
   
   # Or test with curl
   curl http://localhost:27017
   # Should return: "It looks like you are trying to access MongoDB over HTTP..."
   ```

5. **MongoDB Compass (Optional):**
   - Open MongoDB Compass
   - Connect to: `mongodb://localhost:27017`
   - You'll see `bazarify` database after first registration

---

## 🌟 Production Deployment (Future)

When ready to deploy:

### Backend:
- Deploy to: Railway, Render, or Heroku
- Use MongoDB Atlas for production database
- Update JWT_SECRET to strong random string
- Set NODE_ENV=production

### Frontend:
- Deploy to: Vercel, Netlify, or GitHub Pages
- Update VITE_API_URL to your backend URL
- Build: `npm run build`

---

## 📞 Need Help?

### Common Commands:

```powershell
# Check if MongoDB is running
Get-Service MongoDB

# Start MongoDB
Start-Service MongoDB

# Stop MongoDB
Stop-Service MongoDB

# Restart backend (if code changes)
# Just save files - auto-restart with --watch flag

# Clear browser cache
# Ctrl + Shift + Delete

# View backend logs
# Already displayed in terminal

# View MongoDB data (if Compass installed)
# Open MongoDB Compass → Connect to localhost:27017
```

---

## 📦 What's Included in the Project

✅ **Complete Backend:**
- REST API with 6 route groups
- JWT authentication
- MongoDB integration
- Role-based access control
- Input validation
- Error handling
- Bangla error messages

✅ **Complete Frontend:**
- React 18 with Vite
- Tailwind CSS styling
- 8 pages (Login, Register, Dashboard, Products, Orders, Customers, Reports, Settings)
- 10 reusable components
- Auth context for state management
- Protected routes
- Loading states
- Error handling
- 100% Bangla interface

✅ **Database:**
- 5 MongoDB models
- Proper indexes
- Validation
- Relationships

✅ **Documentation:**
- README.md
- SETUP_GUIDE.md
- DEPLOYMENT.md
- DATABASE_SCHEMA.md
- SECURITY_DOCUMENTATION.md
- INTEGRATION_GUIDE.md
- PROJECT_SUMMARY.md

---

## 🎯 Summary: What YOU Need to Provide

### ONLY 1 THING:

**MongoDB Database**

Choose one:
- ✅ **Install MongoDB locally** (10 minutes setup)
- ✅ **Use MongoDB Atlas** (5 minutes signup, always free tier)

**Everything else is ready to run!**

After MongoDB is ready:
1. Start backend: `npm run dev`
2. Start frontend: `npm run dev`
3. Open: http://localhost:3000
4. Register and start using!

---

**Last Updated:** January 13, 2026
**Status:** ✅ Ready to run (MongoDB required)
**Estimated Setup Time:** 15 minutes
