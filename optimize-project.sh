#!/bin/bash

# Optimization script for Agenta Project
# This script cleans up unnecessary files and optimizes the project for EC2 deployment

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🧹 Starting project optimization...${NC}"

# Remove unnecessary directories
echo -e "\n${YELLOW}🗑️ Removing unnecessary directories and files...${NC}"
# Remove frontend folder (empty)
rm -rf frontend
echo -e "${GREEN}✅ Removed frontend folder${NC}"

# Remove node_modules_old (backup of old dependencies)
if [ -d "node_modules_old" ]; then
  rm -rf node_modules_old
  echo -e "${GREEN}✅ Removed node_modules_old${NC}"
fi

# Clean build artifacts
echo -e "\n${YELLOW}🧹 Cleaning build artifacts...${NC}"
rm -rf .next
rm -f tsconfig.tsbuildinfo
rm -rf backend/dist
echo -e "${GREEN}✅ Removed build artifacts${NC}"

# Clean backend test files in production
if [ "$NODE_ENV" == "production" ]; then
  echo -e "\n${YELLOW}🧹 Removing test files for production...${NC}"
  find backend/src -name "*.spec.ts" -delete
  find backend/src -name "*.test.ts" -delete
  rm -rf backend/test
  rm -rf backend/tests
  echo -e "${GREEN}✅ Removed test files${NC}"
fi

# Remove dashboard backup file (large and likely unused)
if [ -f "dashboard-page-backup.tsx" ]; then
  rm -f dashboard-page-backup.tsx
  echo -e "${GREEN}✅ Removed dashboard backup file${NC}"
fi

# Clean up node_modules (removing dev dependencies in production)
echo -e "\n${YELLOW}📦 Optimizing node_modules...${NC}"

# Install production dependencies only if in production mode
if [ "$NODE_ENV" == "production" ]; then
  rm -rf node_modules
  echo "Installing production dependencies only..."
  npm install --production --no-optional
  echo -e "${GREEN}✅ Installed production dependencies only${NC}"
else
  echo "Skipping node_modules cleanup (not in production mode)"
fi

# Set environment variables for better performance
export NODE_OPTIONS="--max-old-space-size=1024 --no-warnings --expose-gc"

# Build the application with optimized settings
echo -e "\n${YELLOW}🔨 Building application with optimized settings...${NC}"
npm run build

echo -e "\n${GREEN}✅ Project optimization complete!${NC}"
echo -e "Next steps:"
echo "1. Run deploy-ec2.sh to deploy to EC2"
echo "2. Make sure your EC2 instance has at least 1GB RAM"
echo "3. Consider using PM2 for process management"
