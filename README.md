# Bazarify - SME Business Management Platform

**বাজারিফাই** - বাংলাদেশের ছোট ও মাঝারি ব্যবসায়ীদের জন্য ডিজিটাল ব্যবসা ব্যবস্থাপনা প্ল্যাটফর্ম

## 🎯 Features

- **প্রোডাক্ট ব্যবস্থাপনা** - পণ্য যোগ, সম্পাদনা, মুছে ফেলা
- **অর্ডার ব্যবস্থাপনা** - অর্ডার ট্র্যাকিং ও স্ট্যাটাস আপডেট
- **কাস্টমার ব্যবস্থাপনা** - গ্রাহক তথ্য এবং অর্ডার ইতিহাস
- **ড্যাশবোর্ড** - বিক্রয় বিশ্লেষণ এবং পরিসংখ্যান
- **নিরাপত্তা** - JWT-ভিত্তিক প্রমাণীকরণ

## 🛠 Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router v6
- Axios
- Recharts

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Express Validator

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- npm or yarn

### Backend Setup

\`\`\`bash
cd backend
npm install
cp .env.example .env
# Update .env with your configuration
npm run dev
\`\`\`

### Frontend Setup

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## 🚀 Deployment

### Backend
- Compatible with Railway, Render, or any Node.js hosting
- Set environment variables in hosting platform
- Ensure MongoDB connection string is configured

### Frontend
- Build: `npm run build`
- Deploy to Vercel, Netlify, or any static hosting
- Set API base URL in environment variables

## 📝 Default Admin Credentials

After first run, create admin via API or registration page.

## 🔒 Security

- JWT tokens with 7-day expiry
- Password hashing with bcrypt
- Protected routes with middleware
- Input validation on all endpoints

## 📄 License

MIT License - Free for commercial and personal use

## 👥 Support

For issues and feature requests, please create an issue in the repository.

---

**Built for Bangladesh 🇧🇩**
