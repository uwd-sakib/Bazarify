# Bazarify Deployment Guide

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

Access the application at `http://localhost:3000`

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Copy environment file
cp .env.docker .env

# Edit .env and set a secure JWT_SECRET

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access the application at `http://localhost`

---

## ☁️ Cloud Deployment

### Backend Deployment (Railway/Render)

1. **Create New Project**
   - Connect your Git repository
   - Select `backend` folder as root

2. **Environment Variables**
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   NODE_ENV=production
   ```

3. **Build Command**: `npm install`
4. **Start Command**: `npm start`

### Frontend Deployment (Vercel/Netlify)

1. **Create New Project**
   - Connect your Git repository
   - Select `frontend` folder as root

2. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

### MongoDB Atlas Setup

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create new cluster (Free tier available)
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string and add to backend env

---

## 🔐 Security Checklist

- [ ] Change default JWT_SECRET to a strong random string (32+ characters)
- [ ] Use environment variables for all sensitive data
- [ ] Enable CORS only for your frontend domain in production
- [ ] Use HTTPS for production deployments
- [ ] Regularly update dependencies
- [ ] Set up MongoDB authentication
- [ ] Implement rate limiting for APIs
- [ ] Enable MongoDB backups

---

## 📊 Production Monitoring

### Recommended Services
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics, Mixpanel
- **Logs**: Papertrail, Loggly

---

## 🔄 CI/CD Setup

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy Backend
      # Add your deployment steps
      
    - name: Deploy Frontend
      # Add your deployment steps
```

---

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check documentation in README.md

---

**বাজারিফাই** - Built for Bangladesh 🇧🇩
