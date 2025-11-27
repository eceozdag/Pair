# Configuration Needed to Run the App Locally

## ✅ What's Already Done

1. ✅ Backend dependencies installed
2. ✅ Backend `.env` file created with MongoDB Atlas connection
3. ✅ Frontend dependencies installed
4. ✅ CORS configuration updated
5. ✅ Metro config already exists
6. ✅ Backend tested and working with MongoDB Atlas

## 🚀 Quick Start Commands

### Terminal 1 - Backend

```bash
cd app/wine-recognition-backend
npm run dev
```

**Expected output:**
- ✅ MongoDB connected successfully
- 🚀 Server running on http://localhost:3001

### Terminal 2 - Frontend

```bash
# From project root
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

## ✅ Current Configuration

### Backend `.env` File

Located at: `app/wine-recognition-backend/.env`

```env
PORT=3001
NODE_ENV=development
DEBUG=true
MONGODB_URI=mongodb+srv://ildakaraj_db_user:xHLrJNB6jRb59Elr@cluster0.eg1lbjs.mongodb.net/pair_wine_db?retryWrites=true&w=majority&appName=Cluster0
ALLOWED_ORIGINS=http://localhost:19006,exp://localhost:19000,http://localhost:3000
```

✅ **Already configured and working!**

### Frontend Configuration

- `metro.config.js` - Already exists and configured
- `app/config/api.ts` - Points to `http://localhost:3001/api` in development

✅ **Already configured!**

## 🧪 Verify Setup

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

## 📋 Required Software

Team members need to install:

- **Node.js v18+** - https://nodejs.org/
- **npm** (comes with Node.js)
- **Git** - https://git-scm.com/

Verify installation:
```bash
node --version  # Should be >= 18.0.0
npm --version
git --version
```

## 🔒 Security Note

**IMPORTANT:** The `.env` file contains sensitive credentials. 
- ✅ **DO NOT** commit `.env` to git (already in `.gitignore`)
- ✅ Share `.env` contents securely with team members
- ✅ Use `.env.example` as a template (without real credentials)

## 📝 For New Team Members

1. Clone the repository
2. Install Node.js v18+
3. Run `npm install` in both root and `app/wine-recognition-backend`
4. Get `.env` file contents from team lead (securely)
5. Create `.env` file in `app/wine-recognition-backend/` with the credentials
6. Start backend: `cd app/wine-recognition-backend && npm run dev`
7. Start frontend: `npm start` (from root)

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string in `.env`
- Ensure MongoDB Atlas cluster is running
- Check network access in MongoDB Atlas (should allow 0.0.0.0/0)

### Frontend can't connect to backend
- Ensure backend is running on port 3001
- Check CORS configuration in `app/wine-recognition-backend/src/app.ts`
- Verify `ALLOWED_ORIGINS` in `.env` includes your frontend URL

### Port already in use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill
```

## 📚 Additional Resources

- Detailed setup: [LOCAL_SETUP.md](./LOCAL_SETUP.md)
- Backend README: [app/wine-recognition-backend/README.md](./app/wine-recognition-backend/README.md)
