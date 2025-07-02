#!/bin/bash

# Deployment script for Agenta on EC2
# This script will optimize and prepare the application for EC2 deployment

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting Agenta deployment optimization...${NC}"

# Install dependencies if not already installed
if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    npm install -g pnpm
fi

# Clean up previous builds
echo -e "\n${YELLOW}🧹 Cleaning up...${NC}"
rm -rf .next
rm -rf node_modules
rm -f pnpm-lock.yaml

# Install production dependencies
echo -e "\n${YELLOW}📦 Installing dependencies...${NC}"
pnpm install --production --frozen-lockfile

# Set environment variables for limited memory environments
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=1024 --no-warnings --expose-gc"

# Build the application
echo -e "\n${YELLOW}🔨 Building application...${NC}"
pnpm run build

# Create deployment package
echo -e "\n${YELLOW}📦 Creating deployment package...${NC}"
DEPLOY_DIR="agenta-deploy-$(date +%Y%m%d%H%M%S)"
mkdir -p "$DEPLOY_DIR"

# Optimize and copy only necessary files for production
echo -e "\n${YELLOW}📦 Optimizing for production...${NC}"

# Only include production assets
cp -r .next/standalone "$DEPLOY_DIR/.next/"
cp -r .next/static "$DEPLOY_DIR/.next/"
cp -r public "$DEPLOY_DIR/"
cp package.json next.config.mjs "$DEPLOY_DIR/"

# Create minimal production-only package.json
cat > "$DEPLOY_DIR/package.json" << 'EOL'
{
  "name": "agenta-optimized",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "next": "^14.2.30"
  }
}
EOL

# Copy server.js from standalone build
cp .next/standalone/server.js "$DEPLOY_DIR/"

# Create .env.production if it doesn't exist
if [ ! -f "$DEPLOY_DIR/.env.production" ]; then
  echo "# Production environment variables" > "$DEPLOY_DIR/.env.production"
  echo "NODE_ENV=production" >> "$DEPLOY_DIR/.env.production"
  echo "NODE_OPTIONS=--max-old-space-size=1024" >> "$DEPLOY_DIR/.env.production"
fi

# Create start script
cat > "$DEPLOY_DIR/start.sh" << 'EOL'
#!/bin/bash
set -e

# Install dependencies if not already installed
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm
fi

# Install minimal production dependencies
pnpm install --prod --no-optional --frozen-lockfile

# Set environment variables
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=768 --no-warnings --expose-gc"

# Start the application
exec pnpm start
EOL

chmod +x "$DEPLOY_DIR/start.sh"

# Create deployment instructions
cat > "$DEPLOY_DIR/DEPLOY.md" << 'EOL'
# Agenta EC2 Deployment Instructions

## Prerequisites
- Node.js 18+ installed
- pnpm installed globally (`npm install -g pnpm`)
- Sufficient disk space (at least 2GB free)

## Deployment Steps

1. **Transfer files to EC2**
   ```bash
   # From your local machine
   scp -r agenta-deploy-* ubuntu@your-ec2-ip:~/
   ```

2. **SSH into your EC2 instance**
   ```bash
   ssh ubuntu@your-ec2-ip
   ```

3. **Optimize EC2 instance settings**
   ```bash
   # Disable services you don't need
   sudo systemctl disable snapd.service
   sudo systemctl disable snapd.socket
   sudo systemctl disable snapd.seeded.service
   
   # Optimize swap usage
   sudo sysctl vm.swappiness=10
   echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
   
   # Reduce memory cache pressure
   sudo sysctl vm.vfs_cache_pressure=50
   echo 'vm.vfs_cache_pressure=50' | sudo tee -a /etc/sysctl.conf
   ```

3. **Set up swap space (if not already set up)**
   ```bash
   sudo fallocate -l 4G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```

4. **Install dependencies and start the application**
   ```bash
   cd agenta-deploy-*
   ./start.sh
   ```

5. **Access the application**
   The application will be available at: http://your-ec2-ip:3000

## Using PM2 for Process Management (Recommended)

1. Install PM2 globally:
   ```bash
   npm install -g pm2
   ```

2. Start the application with PM2:
   ```bash
   cd agenta-deploy-*
   pm2 start ./start.sh --name "agenta"
   pm2 save
   pm2 startup
   ```

3. View logs:
   ```bash
   pm2 logs agenta
   ```
EOL

# Create zip file
echo -e "\n${YELLOW}📦 Creating deployment package...${NC}"
zip -r "$DEPLOY_DIR.zip" "$DEPLOY_DIR"

# Clean up
echo -e "\n${YELLOW}🧹 Cleaning up temporary files...${NC}"
rm -rf "$DEPLOY_DIR"

echo -e "\n${GREEN}✅ Deployment package created: $DEPLOY_DIR.zip${NC}"
echo -e "\n📋 Next steps:"
echo "1. Copy the zip file to your EC2 instance:"
echo "   scp $DEPLOY_DIR.zip ubuntu@your-ec2-ip:~/"
