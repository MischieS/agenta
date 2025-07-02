# AWS EC2 Deployment Guide for Agenta Project

This guide will help you deploy the Agenta project (backend and frontend) to an AWS EC2 instance.

## Prerequisites

1. An AWS account
2. An EC2 instance with:
   - Amazon Linux 2 or Ubuntu Server (recommended)
   - t2.micro or larger instance type
   - Security group allowing inbound traffic on ports 22 (SSH), 3000 (frontend), and 3001 (backend)
   - Elastic IP (optional but recommended for a stable public IP)

## Step 1: Set Up Your EC2 Instance

1. **Connect to your EC2 instance via SSH**
   ```
   ssh -i your-key.pem ec2-user@your-ec2-public-ip
   ```

2. **Install Node.js and npm**
   ```
   # For Amazon Linux 2
   sudo yum update -y
   curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs git

   # For Ubuntu
   sudo apt update
   sudo apt install -y curl
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs git
   ```

3. **Install PM2 (Process Manager)**
   ```
   sudo npm install -g pm2
   ```

## Step 2: Clone and Configure the Project

1. **Clone your repository**
   ```
   git clone your-repo-url
   cd agenta
   ```

2. **Configure Backend Environment**
   ```
   cd backend
   cp .env.production .env
   ```

   Edit the `.env` file and update:
   - `FRONTEND_URL` with your EC2 public IP or domain
   - Ensure the `DATABASE_URL` is correct
   - Update the `JWT_SECRET` if needed

3. **Configure Frontend Environment**
   ```
   cd ../
   cp frontend/.env.production frontend/.env
   ```

   Edit the `.env` file and update:
   - `NEXT_PUBLIC_BACKEND_URL` with your EC2 public IP or domain and port (e.g., http://your-ec2-ip:3001)

## Step 3: Install Dependencies and Build

1. **Install Backend Dependencies and Build**
   ```
   cd backend
   npm install
   npm run build
   ```

2. **Install Frontend Dependencies and Build**
   ```
   cd ../
   npm install
   npm run build
   ```

## Step 4: Start Services with PM2

1. **Start Backend Service**
   ```
   cd backend
   pm2 start dist/src/main.js --name agenta-backend
   ```

2. **Start Frontend Service**
   ```
   cd ../
   pm2 start npm --name agenta-frontend -- start
   ```

3. **Configure PM2 to Start on Reboot**
   ```
   pm2 startup
   # Run the command that PM2 suggests
   pm2 save
   ```

## Step 5: Verify Deployment

1. **Check that services are running**
   ```
   pm2 status
   ```

2. **Test backend API**
   ```
   curl http://localhost:3001/api
   ```

3. **Access frontend in your web browser**
   Navigate to `http://your-ec2-public-ip:3000` in your web browser

## Troubleshooting

1. **Check backend logs**
   ```
   pm2 logs agenta-backend
   ```

2. **Check frontend logs**
   ```
   pm2 logs agenta-frontend
   ```

3. **Verify security group settings**
   Ensure your EC2 security group allows inbound traffic on ports 22, 3000, and 3001.

4. **Test connectivity**
   ```
   telnet your-ec2-public-ip 3001
   telnet your-ec2-public-ip 3000
   ```

## Production Best Practices

1. **Configure HTTPS**
   Use a domain name with Let's Encrypt for HTTPS
   
2. **Set Up Nginx as a Reverse Proxy**
   Install Nginx to handle requests and proxy to your Node.js applications

3. **Regular Backups**
   Set up regular backups of your database

4. **Monitoring**
   Use AWS CloudWatch to monitor your EC2 instance
