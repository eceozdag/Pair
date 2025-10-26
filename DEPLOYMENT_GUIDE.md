# 🚀 PAIR APP - Complete Deployment Guide
## Wine & Food Pairing iOS Application

**Tech Stack**: React Native (Expo) + Node.js/Express + MongoDB + Railway + Apple App Store

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Phase 1: Backend Setup (Railway + MongoDB)](#phase-1-backend-setup)
3. [Phase 2: Enhanced Pairing Logic Implementation](#phase-2-enhanced-pairing-logic)
4. [Phase 3: Database Migration & Data Import](#phase-3-database-migration)
5. [Phase 4: Frontend Integration](#phase-4-frontend-integration)
6. [Phase 5: iOS App Store Deployment](#phase-5-ios-deployment)
7. [Maintenance & Monitoring](#maintenance)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Prerequisites

### Required Accounts
- [ ] **Railway Account** - Sign up at [railway.app](https://railway.app) (free tier available)
- [ ] **MongoDB Atlas Account** - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
- [ ] **Apple Developer Program** - Enroll at [developer.apple.com/programs](https://developer.apple.com/programs) ($99/year)
- [ ] **GitHub Account** - For code repository and CI/CD

### Required Software
- [ ] **Node.js** (v18+) - [nodejs.org](https://nodejs.org)
- [ ] **npm** or **yarn** - Package manager
- [ ] **Xcode** (latest version) - For iOS development (Mac only)
- [ ] **Expo CLI** - `npm install -g expo-cli`
- [ ] **EAS CLI** - `npm install -g eas-cli` (Expo Application Services)
- [ ] **Git** - Version control

### Environment Setup Checklist
```bash
# Verify installations
node --version    # Should be v18+
npm --version
expo --version
eas --version
git --version
xcode-select -p   # Should return Xcode path
```

---

## 📦 Phase 1: Backend Setup (Railway + MongoDB)

### Step 1.1: MongoDB Atlas Setup

1. **Create MongoDB Cluster**
   - Go to https://cloud.mongodb.com
   - Click "Build a Database"
   - Choose FREE "M0 Sandbox" tier
   - Select Cloud Provider: AWS
   - Region: Select closest to your users (e.g., US East)
   - Cluster Name: "pair-wine-db"
   - Click "Create Cluster"

2. **Configure Database Access**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Authentication Method: Password
   - Username: pair_admin
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

3. **Configure Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Comment: "Railway Backend Access"
   - Click "Confirm"

4. **Get Connection String**
   - Go to "Database" → "Connect"
   - Click "Connect your application"
   - Driver: Node.js, Version: 4.1 or later
   - Copy connection string:
     ```
     mongodb+srv://pair_admin:<password>@pair-wine-db.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password
   - Save this connection string!

### Step 1.2: Prepare Backend for Deployment

1. **Install MongoDB Driver**
   ```bash
   cd /Users/Shared/Pair/app/wine-recognition-backend
   npm install mongodb mongoose
   npm install --save-dev @types/mongoose
   ```

2. **Update package.json scripts**
   ```bash
   # Edit package.json and update scripts section:
   ```
   ```json
   {
     "scripts": {
       "start": "node dist/index.js",
       "build": "tsc",
       "dev": "nodemon --exec ts-node src/index.ts",
       "postinstall": "npm run build"
     }
   }
   ```

3. **Create .env.example file**
   ```bash
   cd /Users/Shared/Pair/app/wine-recognition-backend
   cat > .env.example << 'EOF'
# Server
PORT=3001
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pair_wine_db?retryWrites=true&w=majority

# JWT (for future authentication)
JWT_SECRET=your-super-secret-jwt-key-change-this

# CORS
ALLOWED_ORIGINS=http://localhost:19006,exp://localhost:19000

# External Services (optional)
ML_SERVICE_URL=http://localhost:5000
IMAGE_STORAGE_URL=https://your-cloudinary-url.com
EOF
   ```

4. **Create Railway configuration**
   ```bash
   cat > railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF
   ```

### Step 1.3: Deploy to Railway

1. **Login to Railway**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login
   railway login
   ```

2. **Initialize Railway Project**
   ```bash
   cd /Users/Shared/Pair/app/wine-recognition-backend
   railway init
   # Project name: pair-wine-backend
   # Select: Create new project
   ```

3. **Add Environment Variables**
   ```bash
   # Set MongoDB connection string (replace with your actual string)
   railway variables set MONGODB_URI="mongodb+srv://pair_admin:YOUR_PASSWORD@pair-wine-db.xxxxx.mongodb.net/pair_wine_db?retryWrites=true&w=majority"

   # Set other variables
   railway variables set PORT=3001
   railway variables set NODE_ENV=production
   railway variables set JWT_SECRET=$(openssl rand -base64 32)
   ```

4. **Deploy**
   ```bash
   # Deploy to Railway
   railway up

   # Get deployment URL
   railway domain
   # Output example: https://pair-wine-backend.up.railway.app
   # Save this URL!
   ```

5. **Verify Deployment**
   ```bash
   # Test health endpoint
   curl https://your-railway-url.up.railway.app/

   # Should return:
   # {"message":"WineMate Backend API","status":"running"}
   ```

---

## 🧠 Phase 2: Enhanced Pairing Logic Implementation

### Step 2.1: Download Kaggle Dataset

1. **Install Kaggle CLI**
   ```bash
   pip install kaggle
   ```

2. **Configure Kaggle API**
   ```bash
   # Go to https://www.kaggle.com/settings
   # Scroll to "API" section
   # Click "Create New API Token"
   # Download kaggle.json

   # Place credentials
   mkdir -p ~/.kaggle
   mv ~/Downloads/kaggle.json ~/.kaggle/
   chmod 600 ~/.kaggle/kaggle.json
   ```

3. **Download Wine-Food Pairing Dataset**
   ```bash
   cd /Users/Shared/Pair
   mkdir -p data/kaggle
   kaggle datasets download -d wafaaelhusseini/wine-and-food-pairing-dataset -p data/kaggle
   unzip data/kaggle/wine-and-food-pairing-dataset.zip -d data/kaggle
   ```

### Step 2.2: Download Descriptor Mapping

```bash
# Download descriptor mapping CSV
cd /Users/Shared/Pair/data
curl -o descriptor_mapping.csv https://raw.githubusercontent.com/RoaldSchuring/wine_food_pairing/master/descriptor_mapping.csv

# Verify download
head -5 descriptor_mapping.csv
```

### Step 2.3: Create MongoDB Models

1. **Create models directory**
   ```bash
   mkdir -p /Users/Shared/Pair/app/wine-recognition-backend/src/models
   ```

2. **Create Wine Model** (`src/models/Wine.ts`)
   ```typescript
   import mongoose, { Document, Schema } from 'mongoose';

   export interface IWine extends Document {
     name: string;
     type: 'red' | 'white' | 'rosé' | 'sparkling' | 'dessert';
     category: string;
     region: string;
     country?: string;
     vintage?: number;
     grapeVariety?: string;
     description?: string;
     body?: number; // 1-4
     sweetness?: number; // 1-4
     acidity?: number; // 1-4
     tannin?: number; // 1-4
     aromas?: string[];
     imageUrl?: string;
     rating?: number;
     createdAt: Date;
   }

   const WineSchema = new Schema<IWine>({
     name: { type: String, required: true, index: true },
     type: { type: String, required: true, enum: ['red', 'white', 'rosé', 'sparkling', 'dessert'] },
     category: { type: String, required: true },
     region: { type: String, required: true },
     country: String,
     vintage: Number,
     grapeVariety: String,
     description: String,
     body: { type: Number, min: 1, max: 4 },
     sweetness: { type: Number, min: 1, max: 4 },
     acidity: { type: Number, min: 1, max: 4 },
     tannin: { type: Number, min: 1, max: 4 },
     aromas: [String],
     imageUrl: String,
     rating: { type: Number, min: 0, max: 5 },
     createdAt: { type: Date, default: Date.now }
   });

   export default mongoose.model<IWine>('Wine', WineSchema);
   ```

3. **Create database connection** (`src/config/database.ts`)
   ```typescript
   import mongoose from 'mongoose';

   export const connectDatabase = async () => {
     try {
       const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pair_wine_db';

       await mongoose.connect(mongoUri);

       console.log('✅ MongoDB connected successfully');
       console.log(`📍 Database: ${mongoose.connection.name}`);
     } catch (error) {
       console.error('❌ MongoDB connection error:', error);
       process.exit(1);
     }
   };

   mongoose.connection.on('disconnected', () => {
     console.log('⚠️  MongoDB disconnected');
   });

   mongoose.connection.on('error', (err) => {
     console.error('❌ MongoDB error:', err);
   });
   ```

4. **Update index.ts**
   ```typescript
   import { connectDatabase } from './config/database';
   import app from './app';

   const startServer = async () => {
     await connectDatabase();

     const PORT = process.env.PORT || 3001;
     app.listen(PORT, () => {
       console.log(`🚀 Server running on port ${PORT}`);
     });
   };

   startServer();
   ```

---

## 📱 Phase 3: Frontend Integration

### Step 3.1: Configure API Base URL

1. **Create API configuration** (`app/config/api.ts`)
   ```typescript
   const ENV = {
     dev: {
       apiUrl: 'http://localhost:3001/api',
     },
     prod: {
       apiUrl: 'https://pair-wine-backend.up.railway.app/api',
     },
   };

   const getEnvVars = () => {
     if (__DEV__) return ENV.dev;
     return ENV.prod;
   };

   export default getEnvVars();
   ```

2. **Create API client** (`app/services/api.ts`)
   ```typescript
   import axios from 'axios';
   import API_CONFIG from '../config/api';

   const apiClient = axios.create({
     baseURL: API_CONFIG.apiUrl,
     timeout: 10000,
     headers: {
       'Content-Type': 'application/json',
     },
   });

   export default apiClient;
   ```

---

## 🍎 Phase 4: iOS App Store Deployment

### Step 4.1: Apple Developer Account Setup

1. **Enroll in Apple Developer Program**
   - Go to https://developer.apple.com/programs/enroll/
   - Sign in with Apple ID
   - Complete enrollment ($99/year)
   - Wait for approval (1-2 days)

2. **Create App Identifier**
   - Go to https://developer.apple.com/account/resources/identifiers
   - Click "+" to create new identifier
   - Select "App IDs"
   - Description: "Pair Wine & Food App"
   - Bundle ID: com.yourcompany.pair (Explicit)
   - Click "Register"

### Step 4.2: Configure Expo for iOS Build

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   eas login
   ```

2. **Initialize EAS Build**
   ```bash
   cd /Users/Shared/Pair
   eas build:configure
   ```

3. **Update app.json**
   ```json
   {
     "expo": {
       "name": "Pair Wine & Food",
       "slug": "pair-wine-food",
       "version": "1.0.0",
       "ios": {
         "bundleIdentifier": "com.yourcompany.pair",
         "buildNumber": "1",
         "supportsTablet": true,
         "infoPlist": {
           "NSCameraUsageDescription": "We need camera access to scan wine labels",
           "NSPhotoLibraryUsageDescription": "We need photo library access to upload wine images"
         }
       }
     }
   }
   ```

### Step 4.3: Build and Submit

1. **Create Production Build**
   ```bash
   eas build --platform ios --profile production
   ```

2. **Submit to App Store**
   ```bash
   eas submit --platform ios --profile production
   ```

---

## 🔧 Maintenance & Monitoring

### Railway Backend Monitoring

```bash
# View logs
railway logs

# Monitor with tail
railway logs --tail
```

### Over-The-Air Updates

```bash
# For small JS/asset changes (no native code)
eas update --branch production --message "Fix pairing algorithm"
```

---

## 🚨 Troubleshooting

### Backend Issues

**Problem: Railway deployment fails**
```bash
# Check build logs
railway logs --verbose

# Test build locally
npm run build
npm start
```

**Problem: MongoDB connection timeout**
- Verify IP whitelist in MongoDB Atlas
- Ensure connection string is correct
- Test: `mongosh "your-connection-string"`

### iOS Build Issues

**Problem: EAS build fails**
```bash
# View detailed logs
eas build --platform ios --profile production --verbose

# Clear cache
eas build:clean
```

---

## ✅ Launch Checklist

### Pre-Launch
- [ ] Backend deployed to Railway
- [ ] MongoDB populated with data
- [ ] All API endpoints tested
- [ ] iOS build created and tested
- [ ] Privacy policy published
- [ ] App Store listing complete

### Launch Week
- [ ] Submit app for review
- [ ] Monitor App Store review status
- [ ] Prepare for bug reports

### Post-Launch
- [ ] Monitor crash reports
- [ ] Respond to user reviews
- [ ] Gather feedback
- [ ] Plan first update

---

## 💰 Estimated Costs

**Monthly:**
- Railway: $5-20 (Free tier available)
- MongoDB Atlas: $0 (Free tier)
- Apple Developer: $8.25/month ($99/year)
- **Total: ~$13-28/month**

**Timeline:**
- Backend Setup: 1 week
- Frontend Integration: 3 days
- iOS Deployment: 1 week
- **Total: 2-3 weeks**

---

## 📚 Resources

- **Expo Docs**: https://docs.expo.dev
- **Railway Docs**: https://docs.railway.app
- **MongoDB Docs**: https://docs.mongodb.com
- **Apple Developer**: https://developer.apple.com

---

## 🆘 Need Help?

**Common Commands:**
```bash
# Backend
railway up                    # Deploy
railway logs                  # View logs
railway variables             # List env vars

# Frontend
eas build --platform ios     # Build iOS app
eas submit --platform ios    # Submit to App Store
eas update                    # OTA update

# Database
mongosh "connection-string"  # Connect to MongoDB
```

---

**Good luck with your deployment! 🍷🍽️📱**

**Last Updated**: 2025-10-26
