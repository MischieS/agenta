# Agenta Project EC2 Optimization Guide

This guide documents the optimizations made to the Agenta project to make it more efficient on EC2 instances with resource constraints.

## Optimizations Applied

### 1. Directory Structure Cleanup
- Removed empty `frontend` folder
- Optimized project layout for better deployment efficiency

### 2. Next.js Configuration Optimizations
- Reduced memory usage during build process
- Limited runtime memory requirements to 1024MB
- Improved caching for faster responses
- Removed unused static image imports
- Disabled development-only features in production
- Added performance budgets for assets and entry points
- Limited the number of concurrent operations for better stability

### 3. Package.json Optimizations
- Removed unused dependencies to decrease bundle size
- Added memory limit settings to build scripts
- Added cleaning scripts to remove build artifacts
- Optimized script commands for EC2 environments

### 4. Backend Optimizations
- Enhanced memory management in the NestJS application
- Added automatic garbage collection triggers
- Improved error handling for better stability
- Added memory usage monitoring to prevent crashes
- Optimized CORS settings for production environments
- Added graceful shutdown handlers

### 5. Deployment Script Improvements
- Modified deployment process to create smaller packages
- Added system tuning recommendations for EC2 instances
- Improved swap configuration for better memory management
- Reduced memory requirements for the Node.js runtime

## How to Deploy

1. **Run the Optimization Script**
   ```bash
   chmod +x optimize-project.sh
   ./optimize-project.sh
   ```

2. **Deploy to EC2**
   ```bash
   chmod +x deploy-ec2.sh
   ./deploy-ec2.sh
   ```

3. **Follow the EC2 Setup Instructions**
   - Set up proper swap configuration
   - Disable unnecessary services
   - Use PM2 for process management

## EC2 Recommendations

- Minimum EC2 Instance Type: `t3.small` (2GB RAM)
- Recommended EC2 Instance Type: `t3.medium` (4GB RAM) for better performance
- Set up a 4GB swap file if using a smaller instance
- Configure PM2 with memory limits:
  ```bash
  pm2 start npm --name "agenta" -- start --max-memory-restart 800M
  ```

## Performance Monitoring

To monitor resource usage on your EC2 instance:

```bash
# Memory usage
free -m

# CPU load
top

# Node.js memory usage
pm2 monit
```

## Troubleshooting

- If the application crashes, check the memory usage with `free -m`
- Increase swap space if needed: `sudo fallocate -l 6G /swapfile`
- Check application logs: `pm2 logs agenta`
- Adjust NODE_OPTIONS in `.env.production` if memory issues persist
