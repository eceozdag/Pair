# Local Development Setup Guide

This guide will help you run the Wine Pairing App locally on your machine.

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or Docker)
- **Expo CLI** (for mobile development) or **Expo Go** app on your phone
- **Python 3.8+** (for ML components, optional)

## Quick Start

### Prerequisites

- **Node.js v18+** - Download from https://nodejs.org/
- **npm** (comes with Node.js)
- **Git** - Download from https://git-scm.com/

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd app/wine-recognition-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cat > .env << 'EOF'
   PORT=3001
   NODE_ENV=development
   DEBUG=true
   MONGODB_URI=mongodb+srv://ildakaraj_db_user:xHLrJNB6jRb59Elr@cluster0.eg1lbjs.mongodb.net/pair_wine_db?retryWrites=true&w=majority&appName=Cluster0
   ALLOWED_ORIGINS=http://localhost:19006,exp://localhost:19000,http://localhost:3000
   EOF
   ```

4. **Start Backend:**
   ```bash
   npm run dev
   ```

   **Expected output:**
   - ✅ MongoDB connected successfully
   - 🚀 Server running on http://localhost:3001

### Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd /path/to/Pair
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Frontend:**
   ```bash
   npx expo start --web
   ```

   **Expected output:**
   - Web bundled successfully
   - Running on http://localhost:8081

   Or use the regular Expo start:
   ```bash
   npm start
   ```
   Then press:
   - `w` for web
   - `i` for iOS simulator
   - `a` for Android emulator

## Verify Setup

After starting both backend and frontend, verify everything works:

### Backend Health Check
```bash
curl http://localhost:3001/
```

Expected response:
```json
{"message":"WineMate Backend API","status":"running"}
```

### Test API Endpoint
```bash
curl http://localhost:3001/api/wines
```

### Frontend
- Should open automatically in browser at http://localhost:8081 (if using `--web`)
- Or scan QR code with Expo Go app on your phone

## Using the Start Scripts

The project includes convenience scripts:

```bash
# Start backend
./start-backend.sh

# Start frontend
./start-frontend.sh
```

Make sure the scripts are executable:
```bash
chmod +x start-backend.sh start-frontend.sh
```

## Configuration

### Backend Configuration

The backend is configured to use:
- **Port**: 3001 (default, configurable via `PORT` env variable)
- **Database**: MongoDB (default: `mongodb://localhost:27017/pair_wine_db`)
- **API Base URL**: `http://localhost:3001/api`

### Frontend Configuration

The frontend is configured in `app/config/api.ts`:
- **Development**: `http://localhost:3001/api`
- **Production**: `https://pair-wine-backend-production.up.railway.app/api`

The frontend automatically uses the development URL when running in `__DEV__` mode.

## Troubleshooting

### Backend Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running: `docker ps` (if using Docker) or check MongoDB service
   - Verify the `MONGODB_URI` in your `.env` file
   - Check MongoDB logs for errors

2. **Port Already in Use:**
   - Change the `PORT` in `.env` file
   - Or kill the process using port 3001: `lsof -ti:3001 | xargs kill`

3. **TypeScript Build Errors:**
   - Run `npm run build` to see detailed errors
   - Ensure all dependencies are installed: `npm install`

### Frontend Issues

1. **Cannot Connect to Backend:**
   - Ensure backend is running on port 3001
   - Check that `app/config/api.ts` has the correct URL
   - Verify no firewall is blocking the connection

2. **Expo Connection Issues:**
   - Try using tunnel mode: `npm start -- --tunnel`
   - Ensure your phone and computer are on the same network
   - Check Expo CLI version: `npx expo --version`

3. **Module Not Found:**
   - Clear cache: `npm start -- --clear`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

## ML Components (Optional)

If you need to use the ML/vision features:

1. **Set up Python environment:**
   ```bash
   cd app/wine-recognition-backend
   ./scripts/setup_ml_env.sh
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt  # if exists
   ```

## Database Setup

The app uses MongoDB. You have several options:

### Option 1: MongoDB Atlas (Cloud - Easiest, Recommended)

1. **Create a free MongoDB Atlas account:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account

2. **Create a free cluster:**
   - Click "Build a Database"
   - Choose the FREE "M0 Sandbox" tier
   - Select a cloud provider and region
   - Click "Create Cluster"

3. **Configure Database Access:**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access:**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0) for development
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Click "Connect your application"
   - Choose "Node.js" driver
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Add database name: `pair_wine_db`

6. **Update `.env` file:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pair_wine_db?retryWrites=true&w=majority
   ```

### Option 2: Docker (If Docker is installed)

```bash
# Start MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Stop MongoDB
docker stop mongodb

# Start MongoDB again
docker start mongodb
```

### Option 3: Homebrew (macOS)

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Option 4: Manual Installation

1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Follow installation instructions for your OS
3. Start MongoDB: `mongod --dbpath /path/to/data/directory`

### Quick Setup Script

Run the setup script for interactive MongoDB setup:
```bash
./setup-mongodb.sh
```

## Next Steps

- Check the backend API documentation at `http://localhost:3001/api-docs` (if available)
- Review the OpenAPI spec at `app/wine-recognition-backend/openapi.yaml`
- Read the architecture docs at `app/wine-recognition-backend/docs/architecture.md`

## Notes

- The `docker-compose.yml` file currently references PostgreSQL, but the app uses MongoDB. You may want to update it or use it only for other services.
- The backend runs on port 3001 by default to avoid conflicts with other services.
- Make sure to never commit your `.env` file with real credentials.

