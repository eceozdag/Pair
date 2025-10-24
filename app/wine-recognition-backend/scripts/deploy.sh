#!/bin/bash

# Set environment variables
export NODE_ENV=production
export PORT=3000

# Install dependencies
npm install --production

# Build the TypeScript files
npm run build

# Run database migrations
npx prisma migrate deploy

# Start the application
npm start

echo "Deployment completed successfully."