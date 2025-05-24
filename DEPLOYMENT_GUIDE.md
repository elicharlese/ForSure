# ForSure Deployment Guide - Vercel

## 🚀 Deploy to Vercel

This guide will help you deploy the ForSure application to Vercel with all optimizations and configurations.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Code should be pushed to GitHub
3. **MongoDB Database** (optional): Set up MongoDB Atlas for production

## 🔧 Pre-Deployment Setup

### 1. **Environment Variables**
Copy `.env.example` to `.env.local` and configure:

```bash
# Required for production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/forsure
NEXTAUTH_SECRET=your-production-secret-key
NEXTAUTH_URL=https://your-app.vercel.app

# Optional: Enable fallback mode if no database
FALLBACK_MODE=true

# Optional: Add API keys as needed
OPENAI_API_KEY=your-openai-api-key
```

### 2. **MongoDB Atlas Setup** (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Add database user with read/write permissions
4. Whitelist Vercel IP addresses (or use 0.0.0.0/0 for all IPs)
5. Get connection string and add to `MONGODB_URI`

### 3. **Commit Changes**
```bash
git add .
git commit -m "feat: add Turbopack optimization and Vercel deployment config"
git push origin main
```

## 🌐 Deployment Methods

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

### Method 2: Vercel Dashboard

1. **Connect Repository**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   MONGODB_URI=your-mongodb-connection-string
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-app.vercel.app
   FALLBACK_MODE=true
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

## ⚙️ Vercel Configuration

### **vercel.json** (Already Created)
```json
{
  "version": 2,
  "name": "forsure",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "FALLBACK_MODE": "true"
  },
  "functions": {
    "app/api/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

### **next.config.js** (Optimized for Vercel)
- Turbopack enabled for development
- CORS headers configured
- External packages properly configured
- React Strict Mode enabled

## 🔒 Environment Variables for Production

### **Required Variables**
```bash
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars
NEXTAUTH_URL=https://your-app.vercel.app
```

### **Database Variables**
```bash
# Option 1: MongoDB Atlas (Recommended)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/forsure

# Option 2: Fallback Mode (No Database)
FALLBACK_MODE=true
```

### **Optional Variables**
```bash
OPENAI_API_KEY=your-openai-api-key
JWT_SECRET=your-jwt-secret
EMAIL_FROM=noreply@yourdomain.com
```

## 🚀 Deployment Steps

### **Step 1: Prepare Repository**
```bash
# Ensure all changes are committed
git status
git add .
git commit -m "feat: prepare for Vercel deployment"
git push origin main
```

### **Step 2: Deploy with Vercel CLI**
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow prompts:
# - Link to existing project? No
# - Project name: forsure (or your preferred name)
# - Directory: ./
# - Override settings? No
```

### **Step 3: Configure Environment Variables**
```bash
# Add environment variables via CLI
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
vercel env add MONGODB_URI production
vercel env add FALLBACK_MODE production

# Or add via dashboard at vercel.com/dashboard
```

### **Step 4: Redeploy with Environment Variables**
```bash
vercel --prod
```

## 🎯 Post-Deployment Checklist

### **Verify Deployment**
- [ ] Application loads at Vercel URL
- [ ] No console errors in browser
- [ ] API endpoints respond correctly
- [ ] Authentication system works
- [ ] Database connection established (or fallback mode active)

### **Test Core Features**
- [ ] Homepage loads correctly
- [ ] User registration/login works
- [ ] Project creation functions
- [ ] File structure generation works
- [ ] AI chat interface responds

### **Performance Check**
- [ ] Page load times < 3 seconds
- [ ] Lighthouse score > 90
- [ ] No hydration errors
- [ ] Turbopack optimizations active in development

## 🔧 Troubleshooting

### **Common Issues**

1. **Build Failures**
   ```bash
   # Check build logs in Vercel dashboard
   # Common fixes:
   - Ensure all dependencies in package.json
   - Check for TypeScript errors
   - Verify environment variables
   ```

2. **Database Connection Issues**
   ```bash
   # Enable fallback mode temporarily
   FALLBACK_MODE=true
   
   # Check MongoDB Atlas IP whitelist
   # Verify connection string format
   ```

3. **Environment Variable Issues**
   ```bash
   # List current environment variables
   vercel env ls
   
   # Remove and re-add problematic variables
   vercel env rm VARIABLE_NAME production
   vercel env add VARIABLE_NAME production
   ```

4. **API Route Issues**
   ```bash
   # Check function logs in Vercel dashboard
   # Verify API routes are in app/api/ directory
   # Check for proper export statements
   ```

## 📊 Expected Performance

### **Build Metrics**
- **Build Time**: ~2-3 minutes
- **Bundle Size**: ~500KB gzipped
- **Cold Start**: ~200ms
- **Page Load**: ~1-2 seconds

### **Vercel Features Utilized**
- ✅ **Edge Functions** for API routes
- ✅ **Automatic HTTPS** with SSL certificates
- ✅ **Global CDN** for static assets
- ✅ **Serverless Functions** for backend logic
- ✅ **Preview Deployments** for branches
- ✅ **Analytics** and monitoring

## 🎉 Success!

Once deployed, your ForSure application will be available at:
**https://your-app.vercel.app**

### **Features Available**
- ✅ **Fast Loading** with Turbopack optimizations
- ✅ **Global Availability** via Vercel's CDN
- ✅ **Automatic Scaling** based on traffic
- ✅ **HTTPS Security** with automatic certificates
- ✅ **Database Integration** with MongoDB Atlas
- ✅ **API Endpoints** for full functionality

### **Development Workflow**
- **Push to main** → Automatic production deployment
- **Push to branch** → Preview deployment
- **Local development** → Fast with Turbopack

Your ForSure application is now live and ready for users! 🚀