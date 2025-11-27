#!/bin/bash

# MongoDB Setup Script for Wine Pairing App
# This script helps you set up MongoDB for local development

echo "🍷 Wine Pairing App - MongoDB Setup"
echo "===================================="
echo ""

# Check if MongoDB is already running
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB is installed"
    if pgrep -x mongod > /dev/null; then
        echo "✅ MongoDB is already running"
        exit 0
    fi
fi

# Check for Docker
if command -v docker &> /dev/null; then
    echo "🐳 Docker is available"
    echo ""
    echo "Option 1: Use Docker (Recommended)"
    echo "-----------------------------------"
    echo "Run this command to start MongoDB with Docker:"
    echo "  docker run -d -p 27017:27017 --name mongodb mongo:latest"
    echo ""
    echo "To stop MongoDB:"
    echo "  docker stop mongodb"
    echo ""
    echo "To start MongoDB again:"
    echo "  docker start mongodb"
    echo ""
fi

# Check for Homebrew
if command -v brew &> /dev/null; then
    echo "🍺 Homebrew is available"
    echo ""
    echo "Option 2: Install MongoDB with Homebrew"
    echo "----------------------------------------"
    echo "Run these commands:"
    echo "  brew tap mongodb/brew"
    echo "  brew install mongodb-community"
    echo "  brew services start mongodb-community"
    echo ""
fi

echo "Option 3: Use MongoDB Atlas (Cloud - Easiest)"
echo "----------------------------------------------"
echo "1. Go to https://www.mongodb.com/cloud/atlas"
echo "2. Create a free account"
echo "3. Create a free cluster (M0 Sandbox)"
echo "4. Configure network access (allow from anywhere: 0.0.0.0/0)"
echo "5. Create a database user"
echo "6. Get your connection string"
echo "7. Update MONGODB_URI in app/wine-recognition-backend/.env"
echo ""
echo "Example connection string:"
echo "  mongodb+srv://username:password@cluster.mongodb.net/pair_wine_db"
echo ""

echo "Option 4: Manual MongoDB Installation"
echo "--------------------------------------"
echo "Download MongoDB Community Server from:"
echo "  https://www.mongodb.com/try/download/community"
echo ""
echo "After installation, start MongoDB:"
echo "  mongod --dbpath /path/to/data/directory"
echo ""

echo "📝 Next Steps:"
echo "1. Choose one of the options above"
echo "2. Update app/wine-recognition-backend/.env with your MONGODB_URI"
echo "3. Start the backend: cd app/wine-recognition-backend && npm run dev"
echo ""

