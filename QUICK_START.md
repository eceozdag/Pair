# Quick Start Guide - Wine Pairing App

## Prerequisites

- **Node.js v18+** - https://nodejs.org/
- **npm** (comes with Node.js)
- **Git** - https://git-scm.com/

Verify:
```bash
node --version  # Should be >= 18.0.0
npm --version
git --version
```

---

## 1. Backend Setup

```bash
# Navigate to backend
cd app/wine-recognition-backend

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
PORT=3001
NODE_ENV=development
DEBUG=true
MONGODB_URI=mongodb+srv://ildakaraj_db_user:xHLrJNB6jRb59Elr@cluster0.eg1lbjs.mongodb.net/pair_wine_db?retryWrites=true&w=majority&appName=Cluster0
ALLOWED_ORIGINS=http://localhost:19006,exp://localhost:19000,http://localhost:3000
EOF

# Start backend
npm run dev
```

**Expected output:**
- ✅ MongoDB connected successfully
- 🚀 Server running on http://localhost:3001

---

## 2. Frontend Setup

```bash
# Navigate to project root (from backend directory)
cd ../..

# Install dependencies
npm install

# Start frontend
npx expo start --web
```

**Expected output:**
- Web bundled successfully
- Running on http://localhost:8081

Or use regular Expo start:
```bash
npm start
```
Then press `w` for web, `i` for iOS, or `a` for Android.

---

## 3. Verify Setup

### Backend Health Check
```bash
curl http://localhost:3001/
```

Expected:
```json
{"message":"WineMate Backend API","status":"running"}
```

### Test API Endpoint
```bash
curl http://localhost:3001/api/wines
```

Should return JSON array of wines from MongoDB.

---

## 4. Files Already in Repository

✅ `metro.config.js` - Already configured to exclude backend from Metro bundler
✅ `app/config/api.ts` - Configured to use `http://localhost:3001/api` in development
✅ `.gitignore` - `.env` files are excluded from git

---

## 5. Environment Variables

### Backend `.env` (DO NOT commit to git)

Location: `app/wine-recognition-backend/.env`

```env
PORT=3001
NODE_ENV=development
DEBUG=true
MONGODB_URI=mongodb+srv://ildakaraj_db_user:xHLrJNB6jRb59Elr@cluster0.eg1lbjs.mongodb.net/pair_wine_db?retryWrites=true&w=majority&appName=Cluster0
ALLOWED_ORIGINS=http://localhost:19006,exp://localhost:19000,http://localhost:3000
```

**Security:** Share `.env` contents securely with team members. Never commit to git.

---

## 6. Quick Reference Commands

### Terminal 1 - Backend
```bash
cd app/wine-recognition-backend
npm run dev
```

### Terminal 2 - Frontend
```bash
# From project root
npx expo start --web
# or
npm start
```

---

## Troubleshooting

### Port already in use
```bash
lsof -ti:3001 | xargs kill  # Kill backend
lsof -ti:8081 | xargs kill  # Kill frontend
```

### Backend connection error
- Verify MongoDB Atlas cluster is running
- Check network access in MongoDB Atlas (should allow 0.0.0.0/0)
- Verify connection string in `.env`

### Frontend can't connect
- Ensure backend is running on port 3001
- Check CORS configuration
- Verify `ALLOWED_ORIGINS` includes your frontend URL

---

## Additional Resources

- Detailed setup: [LOCAL_SETUP.md](./LOCAL_SETUP.md)
- Configuration guide: [CONFIGURATION_NEEDED.md](./CONFIGURATION_NEEDED.md)
- Backend README: [app/wine-recognition-backend/README.md](./app/wine-recognition-backend/README.md)

